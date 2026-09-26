import "server-only";
import { prisma } from "@/lib/prisma";

export async function getPaymentMethods(userId: string) {
  return prisma.paymentMethod.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}
