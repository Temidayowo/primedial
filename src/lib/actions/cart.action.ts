"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { auth } from "@/auth";
import { isSessionExpired } from "@/lib/session";
import { TAX_RATE, FLAT_SHIPPING } from "@/lib/cart-constants";

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

export type PromoResult =
  | { valid: true; code: string; percentOff: number }
  | { valid: false; message: string };

export async function applyPromoCode(code: string): Promise<PromoResult> {
  const promo = await prisma.promoCode.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  if (!promo || !promo.active) {
    return { valid: false, message: "That promo code isn't valid." };
  }

  return { valid: true, code: promo.code, percentOff: promo.percentOff };
}

export async function checkout(promoCode?: string) {
  const session = await verifySession();
  const { items, subtotal } = await getCart(session.user.id);

  if (items.length === 0) {
    redirect("/cart");
  }

  let percentOff = 0;
  if (promoCode) {
    const promo = await applyPromoCode(promoCode);
    if (promo.valid) {
      percentOff = promo.percentOff;
    }
  }

  const discount = (subtotal * percentOff) / 100;
  const tax = (subtotal - discount) * TAX_RATE;
  const total = subtotal - discount + tax + FLAT_SHIPPING;

  const defaultAddress = await prisma.address.findFirst({
    where: { userId: session.user.id, isDefault: true },
  });

  const orderNumber = `PDS-${new Date().getFullYear()}-${randomBytes(3).toString("hex").toUpperCase()}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      total,
      userId: session.user.id,
      shippingAddressId: defaultAddress?.id,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },
  });

  await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });

  revalidatePath("/cart");
  redirect(`/account/orders/${order.id}`);
}
