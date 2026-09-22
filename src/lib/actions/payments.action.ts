"use server";

import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { checkRateLimit } from "@/lib/rate-limit";
import { PaymentProvider } from "@/generated/prisma/enums";
import { toKobo, type PaystackChannel } from "@/lib/payments/paystack";
import { createOpayCashierCheckout } from "@/lib/payments/opay";
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

  if (order.paymentStatus === "PAID") {
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
    select: { email: true },
  });

  const reference = newPaymentReference(order.orderNumber);

  await prisma.order.update({
    where: { id: order.id },
    data: { paymentProvider: PaymentProvider.PAYSTACK, paymentReference: reference },
  });

  return {
    reference,
    amountKobo: toKobo(Number(order.total)),
    email: user.email,
    channels: [channel] as PaystackChannel[],
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  };
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
