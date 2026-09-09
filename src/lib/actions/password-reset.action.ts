"use server";

import { randomBytes } from "crypto";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { EMAIL_FROM, getResendClient, isEmailConfigured } from "@/lib/resend";
import { getBaseUrl } from "@/lib/url";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

const requestSchema = z.object({
  email: z.email({ error: "Please enter a valid email." }).trim(),
});

export type RequestResetState = { message?: string; error?: string } | undefined;

export async function requestPasswordReset(
  prevState: RequestResetState,
  formData: FormData,
): Promise<RequestResetState> {
  const validatedFields = requestSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return { error: "Please enter a valid email." };
  }

  const { email } = validatedFields.data;

  // Always return the same message whether or not the account exists,
  // so this form can't be used to enumerate registered emails.
  const genericMessage =
    "If an account exists for that email, a password reset link has been sent.";

  const user = await prisma.user.findUnique({ where: { email } });

  if (user?.password) {
    const token = randomBytes(32).toString("hex");

    await prisma.verificationToken.deleteMany({ where: { identifier: email } });
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });

    const resetLink = `${await getBaseUrl()}/reset-password/${token}`;

    if (isEmailConfigured()) {
      const { error } = await getResendClient().emails.send({
        from: EMAIL_FROM,
        to: email,
        subject: "Reset your Prime Dial Solutions password",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h1 style="color: #0f172a; font-size: 20px;">Reset your password</h1>
            <p style="color: #475569; font-size: 14px; line-height: 1.6;">
              We received a request to reset the password for your Prime Dial
              Solutions account. This link expires in 1 hour.
            </p>
            <a
              href="${resetLink}"
              style="display: inline-block; margin-top: 16px; padding: 10px 20px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 14px;"
            >
              Reset Password
            </a>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
              If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        `,
      });

      if (error) {
        // Don't surface delivery failures to the client - that would
        // let this form be used to probe which emails are registered.
        console.error(`[password reset] Resend failed for ${email}:`, error);
      }
    } else {
      // No RESEND_API_KEY set yet - log the link so the flow stays
      // testable in dev until a real key is added.
      console.log(`[password reset] ${email} -> ${resetLink} (expires in 1h)`);
    }
  }

  return { message: genericMessage };
}

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, { error: "Be at least 8 characters long." })
      .regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
      .regex(/[0-9]/, { error: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, { error: "Contain at least one special character." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordState =
  | {
      errors?: { password?: string[]; confirmPassword?: string[] };
      error?: string;
      success?: boolean;
    }
  | undefined;

export async function resetPassword(
  token: string,
  prevState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const validatedFields = resetSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return { errors: z.flattenError(validatedFields.error).fieldErrors };
  }

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken || verificationToken.expires < new Date()) {
    return { error: "This reset link is invalid or has expired." };
  }

  const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10);

  await prisma.user.update({
    where: { email: verificationToken.identifier },
    data: { password: hashedPassword },
  });

  await prisma.verificationToken.delete({ where: { token } });

  return { success: true };
}
