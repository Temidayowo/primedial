import "server-only";
import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@/generated/prisma/enums";
import { sendOrderConfirmationEmail } from "@/lib/actions/order-confirmation-email";

// The one place all three payment paths (client-side verify call,
// Paystack webhook, OPay webhook) converge to mark an order paid - so
// "paid" always means the same thing regardless of which path noticed it
// first, and a duplicate notification (the webhook firing after the
// client already verified, or vice versa) is just a harmless no-op.
export async function markOrderPaidByReference(reference: string) {
  const order = await prisma.order.findUnique({
    where: { paymentReference: reference },
    include: { items: { select: { productId: true } } },
  });

  if (!order) {
    return { ok: false as const, reason: "order_not_found" };
  }

  if (order.paymentStatus === PaymentStatus.PAID) {
    return { ok: true as const, orderId: order.id, alreadyPaid: true };
  }

  await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: PaymentStatus.PAID, paidAt: new Date() },
    }),
    // Only now, once payment is confirmed, does the cart actually empty -
    // mirrors the old checkout() behavior but moved to the payment
    // confirmation step instead of order creation. Scoped to exactly the
    // product ids this order paid for (not the user's whole cart) since
    // the order sits PENDING for a while before this runs, and the user
    // is free to keep shopping and add unrelated items to their cart in
    // the meantime - those shouldn't vanish unpurchased.
    prisma.cartItem.deleteMany({
      where: {
        userId: order.userId,
        productId: { in: order.items.map((item) => item.productId) },
      },
    }),
  ]);

  // Best-effort - a flaky email send should never undo (or even appear to
  // undo) a payment that already cleared, so this is deliberately outside
  // the transaction above and swallows its own errors.
  try {
    await sendOrderConfirmationEmail(order.id);
  } catch (error) {
    console.error(`[order confirmation email] Failed for order ${order.id}:`, error);
  }

  return { ok: true as const, orderId: order.id, alreadyPaid: false };
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
