"use server";

import { randomBytes } from "crypto";
import { unstable_rethrow } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { checkRateLimit } from "@/lib/rate-limit";
import { OrderStatus, PaymentProvider, PaymentStatus } from "@/generated/prisma/enums";
import {
  toKobo,
  chargePaystackAuthorization,
  submitPaystackOtp,
  type PaystackChannel,
} from "@/lib/payments/paystack";
import { createOpayCashierCheckout } from "@/lib/payments/opay";
import { markOrderPaidByReference } from "@/lib/payments/order-status";
import { syncOrderPaymentFromProvider } from "@/lib/payments/reconcile";
import { getBaseUrl } from "@/lib/url";
import { isUuid } from "@/lib/uuid";
import { type ActionResult, actionError } from "@/lib/action-result";

// A failure the customer should see verbatim. Anything else thrown inside
// an action is logged and reported with a generic message instead.
class PaymentError extends Error {}

// Every exported action runs through this. Next.js strips the message
// from errors a server action throws in production, so failures are
// returned as { ok: false, error } values the UI can show. Next's own
// control-flow errors (verifySession's redirect to /login) are rethrown
// so they still work.
async function runPaymentAction<T extends object>(
  action: () => Promise<T>,
): Promise<ActionResult<T>> {
  try {
    return { ok: true, ...(await action()) };
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof PaymentError) return actionError(error.message);
    console.error("[payment] Unexpected error:", error);
    return actionError("Something went wrong with the payment. Please try again.");
  }
}

// Each call here hits an external payment provider's API (and rewrites
// the order's paymentReference) - without this, a malicious or buggy
// client could spam either provider's API through our server.
async function assertPaymentInitiationRateLimit(userId: string) {
  const allowed = await checkRateLimit(`initiate-payment:${userId}`, 10, 10 * 60 * 1000);
  if (!allowed) {
    throw new PaymentError("Too many payment attempts. Please wait a few minutes and try again.");
  }
}

// Looks up an unpaid, not-cancelled order owned by this user. Every
// payment path calls this first so none can be pointed at someone else's
// order, re-charge a paid one, or take money for a cancelled one.
async function getPayableOrderForUser(userId: string, orderId: string) {
  const order = isUuid(orderId)
    ? await prisma.order.findFirst({ where: { id: orderId, userId } })
    : null;

  if (!order) throw new PaymentError("Order not found.");
  if (order.paymentStatus === PaymentStatus.PAID) {
    throw new PaymentError("This order has already been paid for.");
  }
  if (order.status === OrderStatus.CANCELLED) {
    throw new PaymentError("This order was cancelled and can't be paid for.");
  }
  return order;
}

// Regenerated on every attempt, so retrying a cancelled/failed attempt
// gets a fresh provider reference instead of colliding with the old one.
// The order number prefix is load-bearing: see findOrderForReference in
// src/lib/payments/order-status.ts.
function newPaymentReference(orderNumber: string) {
  return `${orderNumber}-${randomBytes(4).toString("hex")}`.toUpperCase();
}

// Before replacing an order's reference with a new attempt's, ask the
// provider of the previous attempt (Paystack or OPay) whether it actually
// went through. If it did, the order is marked paid and no new charge is
// started.
async function previousAttemptPaid(order: Awaited<ReturnType<typeof getPayableOrderForUser>>) {
  return (await syncOrderPaymentFromProvider(order)) === "paid";
}

// Prepares a Paystack popup charge for an existing order. Returns only
// what the client-side popup needs - the charge is verified server-side
// afterwards (/api/verify-payment and the webhook), including its amount.
export async function initiatePaystackPayment(orderId: string, channel: PaystackChannel) {
  return runPaymentAction(async () => {
    const session = await verifySession();
    await assertPaymentInitiationRateLimit(session.user.id);
    const order = await getPayableOrderForUser(session.user.id, orderId);

    if (channel !== "card" && channel !== "bank_transfer") {
      throw new PaymentError("Choose a payment method.");
    }

    if (await previousAttemptPaid(order)) {
      return { alreadyPaid: true as const, orderId: order.id };
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: session.user.id },
      select: { email: true },
    });

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) throw new PaymentError("Card payments are not available right now.");

    const reference = newPaymentReference(order.orderNumber);

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentProvider: PaymentProvider.PAYSTACK, paymentReference: reference },
    });

    return {
      alreadyPaid: false as const,
      reference,
      amountKobo: toKobo(Number(order.total)),
      email: user.email,
      channels: [channel] as PaystackChannel[],
      publicKey,
    };
  });
}

// Charges a saved card directly via its stored Paystack authorization -
// no popup, no re-entering card details.
export async function payWithSavedCard(orderId: string, paymentMethodId: string) {
  return runPaymentAction(async () => {
    const session = await verifySession();
    await assertPaymentInitiationRateLimit(session.user.id);
    const order = await getPayableOrderForUser(session.user.id, orderId);

    const paymentMethod = isUuid(paymentMethodId)
      ? await prisma.paymentMethod.findFirst({
          where: { id: paymentMethodId, userId: session.user.id },
        })
      : null;

    if (!paymentMethod?.paystackAuthorizationCode || !paymentMethod.paystackCustomerEmail) {
      throw new PaymentError("This saved card can't be charged. Use a new card instead.");
    }

    if (await previousAttemptPaid(order)) {
      return { status: "paid" as const, orderId: order.id };
    }

    const reference = newPaymentReference(order.orderNumber);
    const amountKobo = toKobo(Number(order.total));

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentProvider: PaymentProvider.PAYSTACK, paymentReference: reference },
    });

    const charge = await chargePaystackAuthorization({
      authorizationCode: paymentMethod.paystackAuthorizationCode,
      email: paymentMethod.paystackCustomerEmail,
      amountKobo,
      reference,
    });

    if (charge.status === "success") {
      const result = await markOrderPaidByReference(
        reference,
        charge.requested_amount ?? charge.amount ?? amountKobo,
      );
      if (!result.ok) throw new Error(`markOrderPaidByReference failed: ${result.reason}`);
      return { status: "paid" as const, orderId: result.orderId };
    }

    if (charge.status === "send_otp") {
      return {
        status: "otp_required" as const,
        reference: charge.reference,
        displayText: charge.display_text ?? "Enter the OTP sent to your card",
      };
    }

    throw new PaymentError(charge.gateway_response || "Your card was declined.");
  });
}

// Continues a payWithSavedCard charge that came back "otp_required".
export async function submitSavedCardOtp(orderId: string, reference: string, otp: string) {
  return runPaymentAction(async () => {
    const session = await verifySession();
    await assertPaymentInitiationRateLimit(session.user.id);
    const order = await getPayableOrderForUser(session.user.id, orderId);

    if (order.paymentReference !== reference || !/^\d{4,8}$/.test(otp)) {
      throw new PaymentError("That code isn't valid. Check it and try again.");
    }

    const charge = await submitPaystackOtp({ otp, reference });

    if (charge.status !== "success") {
      throw new PaymentError(charge.gateway_response || "Incorrect OTP.");
    }

    const result = await markOrderPaidByReference(
      reference,
      charge.requested_amount ?? charge.amount ?? toKobo(Number(order.total)),
    );
    if (!result.ok) throw new Error(`markOrderPaidByReference failed: ${result.reason}`);
    return { status: "paid" as const, orderId: result.orderId };
  });
}

// Creates the OPay hosted-checkout session and returns the cashierUrl the
// browser should be sent to. OPay payments are confirmed by asking OPay
// directly (see syncOrderPaymentFromProvider), never by trusting a
// webhook body.
export async function initiateOpayPayment(orderId: string) {
  return runPaymentAction(async () => {
    const session = await verifySession();
    await assertPaymentInitiationRateLimit(session.user.id);
    const order = await getPayableOrderForUser(session.user.id, orderId);

    if (await previousAttemptPaid(order)) {
      return { alreadyPaid: true as const, orderId: order.id };
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: session.user.id },
      select: { email: true },
    });

    const reference = newPaymentReference(order.orderNumber);

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentProvider: PaymentProvider.OPAY, paymentReference: reference },
    });

    const baseUrl = await getBaseUrl();

    const cashier = await createOpayCashierCheckout({
      reference,
      amountKobo: toKobo(Number(order.total)),
      description: `Order ${order.orderNumber}`,
      userEmail: user.email,
      returnUrl: `${baseUrl}/account/orders/${order.id}`,
      callbackUrl: `${baseUrl}/api/opay-webhook`,
      cancelUrl: `${baseUrl}/account/orders/${order.id}`,
    });

    return { alreadyPaid: false as const, cashierUrl: cashier.cashierUrl };
  });
}
