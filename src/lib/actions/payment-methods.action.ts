"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

export async function deletePaymentMethod(paymentMethodId: string) {
  const session = await verifySession();

  await prisma.paymentMethod.deleteMany({
    where: { id: paymentMethodId, userId: session.user.id },
  });

  revalidatePath("/account/payment-methods");
}
