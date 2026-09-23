"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

export async function getPaymentMethods(userId: string) {
  return prisma.paymentMethod.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

export async function deletePaymentMethod(paymentMethodId: string) {
  const session = await verifySession();

  await prisma.paymentMethod.deleteMany({
    where: { id: paymentMethodId, userId: session.user.id },
  });

  revalidatePath("/account/payment-methods");
}
