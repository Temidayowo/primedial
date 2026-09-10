"use server";

import { prisma } from "@/lib/prisma";

export async function getOrderStats(userId: string) {
  const result = await prisma.order.aggregate({
    where: { userId },
    _count: { _all: true },
    _sum: { total: true },
  });

  return {
    totalOrders: result._count._all,
    totalSpent: Number(result._sum.total ?? 0),
  };
}

export async function getRecentOrders(userId: string, limit = 3) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      items: { include: { product: { select: { name: true, images: true } } } },
    },
  });
}

export async function getAllOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: { select: { name: true, images: true } } } },
    },
  });
}

export async function getOrderById(userId: string, orderId: string) {
  return prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: { include: { product: true } },
      shippingAddress: true,
    },
  });
}
