import "server-only";
import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@/generated/prisma/enums";
import { sendOrderConfirmationEmail } from "@/lib/actions/order-confirmation-email";
import { toKobo } from "@/lib/payments/amount";
import { recordOrderEventSafely } from "@/lib/orders/events";

// The one place all three payment paths (client-side verify call,
// Paystack webhook, OPay webhook) converge to mark an order paid - so
// "paid" always means the same thing regardless of which path noticed it
// first, and a duplicate notification (the webhook firing after the
// client already verified, or vice versa) is just a harmless no-op.
//
// paidAmountKobo is what the provider says was actually charged (for
// Paystack, the amount before any fee passed on to the customer). It must
// equal the order total: the Paystack popup's amount is set in the
// browser, so a charge on the right reference for the wrong amount is
// exactly what tampering looks like.
export async function markOrderPaidByReference(reference: string, paidAmountKobo: number) {
  const order = await findOrderForReference(reference);

  if (!order) {
    return { ok: false as const, reason: "order_not_found" };
  }

  if (order.paymentStatus === PaymentStatus.PAID) {
    return { ok: true as const, orderId: order.id, userId: order.userId, alreadyPaid: true };
  }

  const expectedKobo = toKobo(Number(order.total));
  if (paidAmountKobo !== expectedKobo) {
    console.error(
      `[payment] Amount mismatch for order ${order.id} reference=${reference}: paid=${paidAmountKobo} expected=${expectedKobo}. Not marking paid.`,
    );
    return { ok: false as const, reason: "amount_mismatch" };
  }

  // One conditional update - the Neon HTTP driver can't run
  // transactions. It only changes a row that isn't PAID yet, so when the
  // webhook and the client's verify call arrive together exactly one of
  // them "wins", and only the winner clears the cart and sends the email.
  // Also records which reference actually paid, in case it was an earlier
  // attempt's (see findOrderForReference).
  const { count } = await prisma.order.updateMany({
    where: { id: order.id, paymentStatus: { not: PaymentStatus.PAID } },
    data: { paymentStatus: PaymentStatus.PAID, paidAt: new Date(), paymentReference: reference },
  });

  if (count === 0) {
    return { ok: true as const, orderId: order.id, userId: order.userId, alreadyPaid: true };
  }

  await recordOrderEventSafely(order.id, "PAID", { message: "Payment confirmed" });

  try {
    // Only now, once payment is confirmed, does the cart actually empty -
    // mirrors the old checkout() behavior but moved to the payment
    // confirmation step instead of order creation. Scoped to exactly the
    // product ids this order paid for (not the user's whole cart) since
    // the order sits PENDING for a while before this runs, and the user
    // is free to keep shopping and add unrelated items to their cart in
    // the meantime - those shouldn't vanish unpurchased.
    await prisma.cartItem.deleteMany({
      where: {
        userId: order.userId,
        productId: { in: order.items.map((item) => item.productId) },
      },
    });
  } catch (error) {
    // The payment is recorded; a leftover cart is only an annoyance.
    console.error(`[payment] Paid order ${order.id}, but clearing the cart failed:`, error);
  }

  // Best-effort - a flaky email send should never undo (or even appear to
  // undo) a payment that already cleared, so this is deliberately outside
  // the transaction above and swallows its own errors.
  try {
    await sendOrderConfirmationEmail(order.id);
  } catch (error) {
    console.error(`[order confirmation email] Failed for order ${order.id}:`, error);
  }

  return { ok: true as const, orderId: order.id, userId: order.userId, alreadyPaid: false };
}

export async function markOrderFailedByReference(reference: string) {
  const order = await prisma.order.findUnique({ where: { paymentReference: reference } });

  if (!order || order.paymentStatus === PaymentStatus.PAID) {
    return { ok: order != null } as const;
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { paymentStatus: PaymentStatus.FAILED },
  });

  return { ok: true } as const;
}

// Every reference is "<orderNumber>-<8 hex chars>" (newPaymentReference in
// payments.action.ts), regenerated on each attempt. A confirmation can
// arrive for an EARLIER attempt's reference - e.g. a bank transfer that
// lands after the customer retried with OPay. That reference is no longer
// on the order, but its order number still identifies the order, so the
// payment is never orphaned. The amount check in the caller still applies.
const REFERENCE_PATTERN = /^(PDS-\d{4}-[0-9A-F]{6})-[0-9A-F]{8}$/;

export function orderNumberFromReference(reference: string) {
  return REFERENCE_PATTERN.exec(reference)?.[1] ?? null;
}

async function findOrderForReference(reference: string) {
  const include = { items: { select: { productId: true } } };

  const current = await prisma.order.findUnique({
    where: { paymentReference: reference },
    include,
  });
  if (current) return current;

  const orderNumber = orderNumberFromReference(reference);
  if (!orderNumber) return null;

  return prisma.order.findUnique({ where: { orderNumber }, include });
}
