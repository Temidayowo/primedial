import "server-only";
import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@/generated/prisma/enums";
import { isUuid } from "@/lib/uuid";

// Server-only reads for the customer's own orders. Callers pass the id
// from verifySession(), never one from the client.

export async function getOrderStats(userId: string) {
  const [orderCount, paid] = await Promise.all([
    prisma.order.count({ where: { userId } }),
    // Only money actually received counts as "spent" - unpaid, failed
    // and abandoned orders don't.
    prisma.order.aggregate({
      where: { userId, paymentStatus: PaymentStatus.PAID },
      _sum: { total: true },
    }),
  ]);

  return {
    totalOrders: orderCount,
    totalSpent: Number(paid._sum.total ?? 0),
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
  if (!isUuid(orderId)) return null;
  return prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: { include: { product: true } },
      shippingAddress: true,
      events: { orderBy: { occurredAt: "desc" } },
    },
  });
}
