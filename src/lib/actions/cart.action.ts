"use server";

import { revalidatePath } from "next/cache";
import { randomBytes, randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { auth } from "@/auth";
import { isSessionExpired } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";
import { getCart } from "@/lib/queries/cart";
import { SHIPPING_METHODS, TAX_RATE } from "@/lib/cart-constants";
import { OrderStatus, PaymentStatus } from "@/generated/prisma/enums";
import { MAX_CART_QUANTITY, isPurchasable } from "@/lib/product-availability";
import { toShippingDetails } from "@/lib/shipping-details";
import { isUuid } from "@/lib/uuid";
import { type ActionResult, actionError } from "@/lib/action-result";
import { recordOrderEventSafely } from "@/lib/orders/events";

// Everything here is callable from a browser with any arguments, so every
// input is validated server-side - never trust a quantity, price or
// shipping cost from the client.

function isValidQuantity(quantity: unknown): quantity is number {
  return (
    typeof quantity === "number" &&
    Number.isInteger(quantity) &&
    quantity >= 1 &&
    quantity <= MAX_CART_QUANTITY
  );
}

const roundMoney = (amount: number) => Math.round(amount * 100) / 100;

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

export async function addToCart(productId: string, quantity = 1): Promise<ActionResult> {
  const session = await verifySession();

  if (!isUuid(productId) || !isValidQuantity(quantity)) {
    return actionError("Choose a quantity between 1 and 99.");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { inStock: true, price: true },
  });

  if (!product) return actionError("This product is no longer available.");
  if (!isPurchasable(product)) {
    return actionError("This product is out of stock.");
  }

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
    select: { quantity: true },
  });

  if ((existing?.quantity ?? 0) + quantity > MAX_CART_QUANTITY) {
    return actionError(`You can order up to ${MAX_CART_QUANTITY} of one item online.`);
  }

  await prisma.cartItem.upsert({
    where: { userId_productId: { userId: session.user.id, productId } },
    update: { quantity: { increment: quantity } },
    create: { userId: session.user.id, productId, quantity },
  });

  revalidatePath("/cart");
  return { ok: true };
}

export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number,
): Promise<ActionResult> {
  const session = await verifySession();

  if (!isUuid(cartItemId)) return actionError("Cart item not found.");

  if (quantity === 0) {
    await prisma.cartItem.deleteMany({
      where: { id: cartItemId, userId: session.user.id },
    });
  } else if (isValidQuantity(quantity)) {
    await prisma.cartItem.updateMany({
      where: { id: cartItemId, userId: session.user.id },
      data: { quantity },
    });
  } else {
    return actionError("Choose a quantity between 1 and 99.");
  }

  revalidatePath("/cart");
  return { ok: true };
}

export async function removeCartItem(cartItemId: string) {
  const session = await verifySession();

  if (!isUuid(cartItemId)) return;

  await prisma.cartItem.deleteMany({
    where: { id: cartItemId, userId: session.user.id },
  });

  revalidatePath("/cart");
}

// Creates the order up front, before any money has moved, with
// paymentStatus PENDING. The cart is deliberately left intact here - it's
// only cleared once payment actually clears (see markOrderPaidByReference
// in src/lib/payments/order-status.ts), so a user who abandons the
// Paystack popup or the OPay redirect doesn't lose their cart.
//
// Every amount is computed here from the database: the client only picks
// which shipping method and which of its own saved addresses to use.
export async function createPendingOrder(options: {
  addressId: string;
  shippingMethodId: string;
}): Promise<ActionResult<{ orderId: string; orderNumber: string; total: number }>> {
  const session = await verifySession();

  const allowed = await checkRateLimit(
    `create-order:${session.user.id}`,
    10,
    10 * 60 * 1000,
  );
  if (!allowed) {
    return actionError("Too many order attempts. Please wait a few minutes and try again.");
  }

  const shippingMethod = SHIPPING_METHODS.find((m) => m.id === options.shippingMethodId);
  if (!shippingMethod) {
    return actionError("Choose a shipping method.");
  }

  const address = isUuid(options.addressId)
    ? await prisma.address.findFirst({
        where: { id: options.addressId, userId: session.user.id },
      })
    : null;
  if (!address) {
    return actionError("Choose a shipping address.");
  }

  const { items } = await getCart(session.user.id);

  if (items.length === 0) {
    return actionError("Your cart is empty.");
  }

  const unavailable = items.find(
    (item) => !isPurchasable(item.product) || !isValidQuantity(item.quantity),
  );
  if (unavailable) {
    return actionError(
      `"${unavailable.product.name}" can't be ordered right now. Remove it from your cart to continue.`,
    );
  }

  const subtotal = roundMoney(
    items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0),
  );
  const tax = roundMoney(subtotal * TAX_RATE);
  const shippingCost = shippingMethod.cost;
  const total = roundMoney(subtotal + tax + shippingCost);
  const shippingDetails = { ...toShippingDetails(address) };

  // Idempotency: reuse the most recent still-unpaid order instead of
  // minting a new one every time "Place Order" is clicked - covers
  // double-clicks and retrying after a cancelled/abandoned popup. Only
  // reused when the cart, prices and shipping method all still match, and
  // never when an admin has cancelled it.
  const existingPending = await prisma.order.findFirst({
    where: {
      userId: session.user.id,
      paymentStatus: PaymentStatus.PENDING,
      status: { not: OrderStatus.CANCELLED },
    },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  if (
    existingPending &&
    Number(existingPending.total) === total &&
    existingPending.shippingMethod === shippingMethod.id
  ) {
    const cartSignature = items
      .map((item) => `${item.productId}:${item.quantity}:${Number(item.product.price)}`)
      .sort()
      .join(",");
    const existingSignature = existingPending.items
      .map((item) => `${item.productId}:${item.quantity}:${Number(item.price)}`)
      .sort()
      .join(",");

    if (cartSignature === existingSignature) {
      const order = await prisma.order.update({
        where: { id: existingPending.id },
        data: { shippingAddressId: address.id, shippingDetails },
      });

      return {
        ok: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        total: Number(order.total),
      };
    }
  }

  const orderNumber = `PDS-${new Date().getFullYear()}-${randomBytes(3).toString("hex").toUpperCase()}`;

  // The Neon HTTP driver (src/lib/prisma.ts) can't run transactions of
  // any kind - a nested `items: { create }` write, or $transaction, fails
  // with "Transactions are not supported in HTTP mode". So the order and
  // its items are two inserts, and the order is removed again if the
  // items fail, so a half-created order is never left behind.
  const orderId = randomUUID();
  const order = await prisma.order.create({
    data: {
      id: orderId,
      orderNumber,
      subtotal,
      tax,
      shippingCost,
      shippingMethod: shippingMethod.id,
      total,
      userId: session.user.id,
      shippingAddressId: address.id,
      shippingDetails,
    },
  });

  try {
    await prisma.orderItem.createMany({
      data: items.map((item) => ({
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      })),
    });
  } catch (error) {
    await prisma.order.delete({ where: { id: orderId } }).catch(() => {});
    throw error;
  }

  await recordOrderEventSafely(orderId, "PLACED", { message: "Order placed" });

  return {
    ok: true,
    orderId: order.id,
    orderNumber: order.orderNumber,
    total: Number(order.total),
  };
}
