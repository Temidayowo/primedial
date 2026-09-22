"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { auth } from "@/auth";
import { isSessionExpired } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";
import { TAX_RATE, FLAT_SHIPPING } from "@/lib/cart-constants";
import { PaymentStatus } from "@/generated/prisma/enums";

export async function getCart(userId: string) {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: { product: true },
  });

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  return { items, subtotal };
}

export async function getCartCount() {
  // Deliberately not verifySession() - this backs the header badge on
  // public pages too, where "not logged in" should just mean "0 items",
  // not force a redirect to /login.
  const session = await auth();
  if (!session?.user || isSessionExpired(session)) return 0;

  const result = await prisma.cartItem.aggregate({
    where: { userId: session.user.id },
    _sum: { quantity: true },
  });

  return result._sum.quantity ?? 0;
}

export async function addToCart(productId: string, quantity = 1) {
  const session = await verifySession();

  await prisma.cartItem.upsert({
    where: { userId_productId: { userId: session.user.id, productId } },
    update: { quantity: { increment: quantity } },
    create: { userId: session.user.id, productId, quantity },
  });

  revalidatePath("/cart");
}

export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number,
) {
  const session = await verifySession();

  if (quantity < 1) {
    await prisma.cartItem.deleteMany({
      where: { id: cartItemId, userId: session.user.id },
    });
  } else {
    await prisma.cartItem.updateMany({
      where: { id: cartItemId, userId: session.user.id },
      data: { quantity },
    });
  }

  revalidatePath("/cart");
}

export async function removeCartItem(cartItemId: string) {
  const session = await verifySession();

  await prisma.cartItem.deleteMany({
    where: { id: cartItemId, userId: session.user.id },
  });

  revalidatePath("/cart");
}

// Creates the order up front, before any money has moved, with
// paymentStatus PENDING. The cart is deliberately left intact here - it's
// only cleared once payment actually clears (see markOrderPaid in
// payments.action.ts), so a user who abandons the Paystack popup or the
// OPay redirect doesn't lose their cart along with the failed attempt.
export async function createPendingOrder(options: {
  addressId?: string;
  shippingCost?: number;
}) {
  const session = await verifySession();

  const allowed = await checkRateLimit(
    `create-order:${session.user.id}`,
    10,
    10 * 60 * 1000,
  );
  if (!allowed) {
    throw new Error("Too many order attempts. Please wait a few minutes and try again.");
  }

  const { items, subtotal } = await getCart(session.user.id);

  if (items.length === 0) {
    redirect("/cart");
  }

  const shippingCost = options.shippingCost ?? FLAT_SHIPPING;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + shippingCost;

  // Falls back to the account's default address (and to whatever address
  // matches, ignoring ownership, if the caller didn't validate it) - the
  // ownership check happens here via userId so a stray/foreign addressId
  // can never attach someone else's address to this order.
  const shippingAddress = options.addressId
    ? await prisma.address.findFirst({
        where: { id: options.addressId, userId: session.user.id },
      })
    : await prisma.address.findFirst({
        where: { userId: session.user.id, isDefault: true },
      });

  // Idempotency: reuse the most recent still-unpaid order instead of
  // minting a new one every time "Place Order" is clicked - covers
  // double-clicks and retrying after a cancelled/abandoned popup, which
  // would otherwise leave a trail of abandoned PENDING orders. Only reuses
  // it if the cart hasn't actually changed since that order was created;
  // otherwise (items added/removed/re-quantified) a fresh order is created
  // as before, and the stale one is left for the user to notice via the
  // "Payment not completed" banner on its own order page.
  const existingPending = await prisma.order.findFirst({
    where: { userId: session.user.id, paymentStatus: PaymentStatus.PENDING },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  if (existingPending && Number(existingPending.total) === total) {
    const cartSignature = items
      .map((item) => `${item.productId}:${item.quantity}`)
      .sort()
      .join(",");
    const existingSignature = existingPending.items
      .map((item) => `${item.productId}:${item.quantity}`)
      .sort()
      .join(",");

    if (cartSignature === existingSignature) {
      const order = await prisma.order.update({
        where: { id: existingPending.id },
        data: { shippingAddressId: shippingAddress?.id },
      });

      return {
        orderId: order.id,
        orderNumber: order.orderNumber,
        total: Number(order.total),
      };
    }
  }

  const orderNumber = `PDS-${new Date().getFullYear()}-${randomBytes(3).toString("hex").toUpperCase()}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      total,
      userId: session.user.id,
      shippingAddressId: shippingAddress?.id,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },
  });

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    total: Number(order.total),
  };
}
