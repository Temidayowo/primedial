"use server";

import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { checkRateLimit } from "@/lib/rate-limit";
import { PaymentProvider, PaymentStatus } from "@/generated/prisma/enums";
import {
  toKobo,
  verifyPaystackTransaction,
  chargePaystackAuthorization,
  submitPaystackOtp,
  saveOrUpdatePaystackAuthorization,
  type PaystackChannel,
} from "@/lib/payments/paystack";
import { createOpayCashierCheckout } from "@/lib/payments/opay";
import { markOrderPaidByReference } from "@/lib/payments/order-status";
import { getBaseUrl } from "@/lib/url";

// Each call here hits an external payment provider's API (and, for
// Paystack, rewrites the order's paymentReference) - without this, a
// malicious or buggy client could spam either provider's API through our
// server, or keep invalidating a legitimate in-flight reference.
async function assertPaymentInitiationRateLimit(userId: string) {
  const allowed = await checkRateLimit(`initiate-payment:${userId}`, 10, 10 * 60 * 1000);
  if (!allowed) {
    throw new Error("Too many payment attempts. Please wait a few minutes and try again.");
  }
}

// Looks up a PENDING order owned by this user. Both payment paths below
// call this first so neither one can be pointed at someone else's order,
// or re-charge an order that's already been paid.
async function getPendingOrderForUser(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.paymentStatus === PaymentStatus.PAID) {
    throw new Error("This order has already been paid for");
  }

  return order;
}

// Regenerated on every call rather than reused, so retrying a
// cancelled/failed attempt on the same order gets a fresh Paystack/OPay
// reference instead of colliding with the abandoned one.
function newPaymentReference(orderNumber: string) {
  return `${orderNumber}-${randomBytes(4).toString("hex")}`.toUpperCase();
}

type PendingOrder = Awaited<ReturnType<typeof getPendingOrderForUser>>;

// Before starting a *new* Paystack attempt, check whether the order's
// existing reference (left over from a prior attempt) actually already
// succeeded. Without this, retrying right after a transient verify
// failure - exactly what happened when the amount-comparison bug above
// was live - overwrites paymentReference with a fresh value. If
// Paystack's webhook for that first, genuinely successful charge then
// arrives reporting the OLD reference, it no longer matches anything on
// the order and silently no-ops, orphaning a real payment. This closes
// that race by resolving the old reference first instead of abandoning it.
async function reconcileIfAlreadyPaid(order: PendingOrder, cardholderName: string) {
  if (order.paymentProvider !== PaymentProvider.PAYSTACK || !order.paymentReference) {
    return null;
  }

  try {
    const transaction = await verifyPaystackTransaction(order.paymentReference);
    const chargedAmount = transaction.requested_amount ?? transaction.amount;

    if (transaction.status !== "success" || chargedAmount !== toKobo(Number(order.total))) {
      return null;
    }

    const result = await markOrderPaidByReference(order.paymentReference);
    if (!result.ok) return null;

    if (transaction.authorization && transaction.customer) {
      await saveOrUpdatePaystackAuthorization({
        userId: order.userId,
        authorization: transaction.authorization,
        email: transaction.customer.email,
        cardholderName,
      });
    }

    return result.orderId;
  } catch {
    // Paystack unreachable, or the reference belongs to a different
    // provider (e.g. this order's last attempt was OPay) - fall through
    // to starting a fresh attempt rather than blocking checkout on this.
    return null;
  }
}

// Prepares a Paystack popup charge for an existing pending order. Returns
// only what the client-side popup (react-paystack / inline.js) needs to
// initialize - the actual charge still has to be verified server-side
// afterwards (see /api/verify-payment) before the order is trusted as paid.
export async function initiatePaystackPayment(
  orderId: string,
  channel: PaystackChannel,
) {
  const session = await verifySession();
  await assertPaymentInitiationRateLimit(session.user.id);
  const order = await getPendingOrderForUser(session.user.id, orderId);

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: { email: true, name: true },
  });

  const alreadyPaidOrderId = await reconcileIfAlreadyPaid(order, user.name ?? "Cardholder");
  if (alreadyPaidOrderId) {
    return { alreadyPaid: true as const, orderId: alreadyPaidOrderId };
  }

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
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  };
}

// Charges a saved card directly via its stored Paystack authorization - no
// popup, no re-entering card details. Same retry-race protection as
// initiatePaystackPayment above.
export async function payWithSavedCard(orderId: string, paymentMethodId: string) {
  const session = await verifySession();
  await assertPaymentInitiationRateLimit(session.user.id);
  const order = await getPendingOrderForUser(session.user.id, orderId);

  const paymentMethod = await prisma.paymentMethod.findFirst({
    where: { id: paymentMethodId, userId: session.user.id },
  });

  if (!paymentMethod?.paystackAuthorizationCode || !paymentMethod.paystackCustomerEmail) {
    throw new Error("This saved card can't be charged directly");
  }

  const alreadyPaidOrderId = await reconcileIfAlreadyPaid(order, paymentMethod.cardholderName);
  if (alreadyPaidOrderId) {
    return { status: "paid" as const, orderId: alreadyPaidOrderId };
  }

  const reference = newPaymentReference(order.orderNumber);

  await prisma.order.update({
    where: { id: order.id },
    data: { paymentProvider: PaymentProvider.PAYSTACK, paymentReference: reference },
  });

  const charge = await chargePaystackAuthorization({
    authorizationCode: paymentMethod.paystackAuthorizationCode,
    email: paymentMethod.paystackCustomerEmail,
    amountKobo: toKobo(Number(order.total)),
    reference,
  });

  if (charge.status === "success") {
    const result = await markOrderPaidByReference(reference);
    if (!result.ok) throw new Error("Order not found");
    return { status: "paid" as const, orderId: result.orderId };
  }

  if (charge.status === "send_otp") {
    return {
      status: "otp_required" as const,
      reference: charge.reference,
      displayText: charge.display_text ?? "Enter the OTP sent to your card",
    };
  }

  throw new Error(charge.gateway_response || "Card charge failed");
}

// Continues a payWithSavedCard charge that came back status: "otp_required".
export async function submitSavedCardOtp(orderId: string, reference: string, otp: string) {
  const session = await verifySession();
  await assertPaymentInitiationRateLimit(session.user.id);

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id, paymentReference: reference },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const charge = await submitPaystackOtp({ otp, reference });

  if (charge.status !== "success") {
    throw new Error(charge.gateway_response || "Incorrect OTP");
  }

  const result = await markOrderPaidByReference(reference);
  if (!result.ok) throw new Error("Order not found");
  return { status: "paid" as const, orderId: result.orderId };
}

// Creates the OPay hosted-checkout session and returns the cashierUrl the
// browser should be redirected to. OPay confirms payment via
// /api/opay-webhook - see the FLAG comment block in src/lib/payments/opay.ts
// before relying on this against real OPay traffic.
export async function initiateOpayPayment(orderId: string) {
  const session = await verifySession();
  await assertPaymentInitiationRateLimit(session.user.id);
  const order = await getPendingOrderForUser(session.user.id, orderId);

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
    cancelUrl: `${baseUrl}/checkout`,
  });

  return { cashierUrl: cashier.cashierUrl };
}
