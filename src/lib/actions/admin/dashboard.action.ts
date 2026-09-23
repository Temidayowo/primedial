"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";
import { PaymentStatus } from "@/generated/prisma/enums";

export async function getDashboardStats() {
  await requireAdmin();

  const [revenue, orderCount, pendingCount, productCount, outOfStockCount, recentOrders] =
    await Promise.all([
      prisma.order.aggregate({
        where: { paymentStatus: PaymentStatus.PAID },
        _sum: { total: true },
      }),
      prisma.order.count(),
      prisma.order.count({ where: { paymentStatus: PaymentStatus.PENDING } }),
      prisma.product.count(),
      prisma.product.count({ where: { inStock: false } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: { select: { name: true, email: true } } },
      }),
    ]);

  return {
    totalRevenue: Number(revenue._sum.total ?? 0),
    orderCount,
    pendingCount,
    productCount,
    outOfStockCount,
    recentOrders: recentOrders.map((order) => ({
      ...order,
      total: Number(order.total),
    })),
  };
}
