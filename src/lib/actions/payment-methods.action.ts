"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

export async function getPaymentMethods(userId: string) {
  return prisma.paymentMethod.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

// This form only ever collects display-safe fields (brand, last 4,
// expiry) - never a full card number. There is no payment processor
// wired up yet, so this is a placeholder for the UI, not a real card
// vault. Wire up a real processor (e.g. Stripe) before this app ever
// needs to charge anyone.
const paymentMethodSchema = z.object({
  brand: z.string().min(2, { error: "Card brand is required." }).trim(),
  last4: z
    .string()
    .trim()
    .regex(/^\d{4}$/, { error: "Enter the last 4 digits only." }),
  expiryMonth: z.coerce.number().int().min(1).max(12),
  expiryYear: z.coerce.number().int().min(new Date().getFullYear()),
});

export type PaymentMethodFormState =
  | { errors?: Record<string, string[]>; message?: string }
  | undefined;

export async function createPaymentMethod(
  prevState: PaymentMethodFormState,
  formData: FormData,
): Promise<PaymentMethodFormState> {
  const session = await verifySession();

  const validatedFields = paymentMethodSchema.safeParse({
    brand: formData.get("brand"),
    last4: formData.get("last4"),
    expiryMonth: formData.get("expiryMonth"),
    expiryYear: formData.get("expiryYear"),
  });

  if (!validatedFields.success) {
    return { errors: z.flattenError(validatedFields.error).fieldErrors };
  }

  const isFirst = (await prisma.paymentMethod.count({
    where: { userId: session.user.id },
  })) === 0;

  await prisma.paymentMethod.create({
    data: {
      ...validatedFields.data,
      userId: session.user.id,
      isDefault: isFirst,
    },
  });

  revalidatePath("/account/payment-methods");
  return { message: "Payment method added." };
}

export async function deletePaymentMethod(paymentMethodId: string) {
  const session = await verifySession();

  await prisma.paymentMethod.deleteMany({
    where: { id: paymentMethodId, userId: session.user.id },
  });

  revalidatePath("/account/payment-methods");
}
