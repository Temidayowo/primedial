"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

const nameSchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters." }).trim(),
});

export type UpdateNameState = { error?: string; message?: string } | undefined;

export async function updateName(
  prevState: UpdateNameState,
  formData: FormData,
): Promise<UpdateNameState> {
  const session = await verifySession();

  const validatedFields = nameSchema.safeParse({ name: formData.get("name") });

  if (!validatedFields.success) {
    return { error: "Please enter a valid name." };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: validatedFields.data.name },
  });

  revalidatePath("/account/settings");
  revalidatePath("/account");
  return { message: "Name updated." };
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, { error: "Enter your current password." }),
    newPassword: z
      .string()
      .min(8, { error: "Be at least 8 characters long." })
      .regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
      .regex(/[0-9]/, { error: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, { error: "Contain at least one special character." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ChangePasswordState =
  | {
      errors?: {
        currentPassword?: string[];
        newPassword?: string[];
        confirmPassword?: string[];
      };
      error?: string;
      message?: string;
    }
  | undefined;

export async function changePassword(
  prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const session = await verifySession();

  const validatedFields = passwordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return { errors: z.flattenError(validatedFields.error).fieldErrors };
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user?.password) {
    return {
      error:
        "This account signed up with Google and has no password to change.",
    };
  }

  const currentMatches = await bcrypt.compare(
    validatedFields.data.currentPassword,
    user.password,
  );

  if (!currentMatches) {
    return { error: "Current password is incorrect." };
  }

  const hashedPassword = await bcrypt.hash(validatedFields.data.newPassword, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  });

  return { message: "Password updated." };
}
