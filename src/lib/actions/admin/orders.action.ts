"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";
import { OrderStatus } from "@/generated/prisma/enums";

export async function getAllOrdersAdmin() {
  await requireAdmin();

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { name: true } } } },
    },
  });

  return orders.map((order) => ({ ...order, total: Number(order.total) }));
}

export async function getOrderByIdAdmin(id: string) {
  await requireAdmin();

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      shippingAddress: true,
      items: { include: { product: { select: { name: true, images: true, slug: true } } } },
    },
  });

  if (!order) return null;

  return {
    ...order,
    total: Number(order.total),
    items: order.items.map((item) => ({ ...item, price: Number(item.price) })),
  };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await requireAdmin();

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}
