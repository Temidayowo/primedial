"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

export async function getAddresses(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

const addressSchema = z.object({
  label: z.string().trim().optional(),
  fullName: z.string().min(2, { error: "Full name is required." }).trim(),
  line1: z.string().min(3, { error: "Address is required." }).trim(),
  line2: z.string().trim().optional(),
  city: z.string().min(1, { error: "City is required." }).trim(),
  state: z.string().trim().optional(),
  postalCode: z.string().min(1, { error: "Postal code is required." }).trim(),
  country: z.string().min(1, { error: "Country is required." }).trim(),
  phone: z.string().trim().optional(),
});

export type AddressFormState =
  | { errors?: Record<string, string[]>; message?: string }
  | undefined;

export async function createAddress(
  prevState: AddressFormState,
  formData: FormData,
): Promise<AddressFormState> {
  const session = await verifySession();

  const validatedFields = addressSchema.safeParse({
    label: formData.get("label") || undefined,
    fullName: formData.get("fullName"),
    line1: formData.get("line1"),
    line2: formData.get("line2") || undefined,
    city: formData.get("city"),
    state: formData.get("state") || undefined,
    postalCode: formData.get("postalCode"),
    country: formData.get("country"),
    phone: formData.get("phone") || undefined,
  });

  if (!validatedFields.success) {
    return { errors: z.flattenError(validatedFields.error).fieldErrors };
  }

  const isFirstAddress = (await prisma.address.count({
    where: { userId: session.user.id },
  })) === 0;

  await prisma.address.create({
    data: {
      ...validatedFields.data,
      userId: session.user.id,
      isDefault: isFirstAddress,
    },
  });

  revalidatePath("/account/addresses");
  return { message: "Address added." };
}

export async function deleteAddress(addressId: string) {
  const session = await verifySession();

  await prisma.address.deleteMany({
    where: { id: addressId, userId: session.user.id },
  });

  revalidatePath("/account/addresses");
}

export async function setDefaultAddress(addressId: string) {
  const session = await verifySession();

  await prisma.$transaction([
    prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    }),
    prisma.address.updateMany({
      where: { id: addressId, userId: session.user.id },
      data: { isDefault: true },
    }),
  ]);

  revalidatePath("/account/addresses");
}
