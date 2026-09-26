"use server";

import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/actions/welcome-email";
import { checkRateLimit } from "@/lib/rate-limit";
import { normalizeEmail } from "@/lib/email-address";
import { sendVerificationEmail } from "@/lib/email/verification";
import { emailFromVerifyIdentifier } from "@/lib/email/tokens";

export type VerifyEmailResult = {
  success: boolean;
  message: string;
  email?: string;
};

export async function verifyEmail(token: string): Promise<VerifyEmailResult> {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  // A password reset token is not a verification token.
  const email = verificationToken
    ? emailFromVerifyIdentifier(verificationToken.identifier)
    : null;

  if (!verificationToken || !email) {
    return {
      success: false,
      message: "This verification link is invalid.",
    };
  }

  if (verificationToken.expires < new Date()) {
    return {
      success: false,
      message: "This verification link has expired.",
      email,
    };
  }

  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });

  await prisma.verificationToken.delete({ where: { token } });

  if (!user) {
    return { success: false, message: "This verification link is invalid." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date() },
  });

  await sendWelcomeEmail(user.email, user.name);

  return { success: true, message: "Your email has been verified." };
}

const resendSchema = z.object({
  email: z.email(),
});

export type ResendVerificationState = { message: string } | undefined;

export async function resendVerificationEmail(
  prevState: ResendVerificationState,
  formData: FormData,
): Promise<ResendVerificationState> {
  const validatedFields = resendSchema.safeParse({
    email: formData.get("email"),
  });

  // Always the same message, whether or not the account exists or is
  // already verified, so this can't be used to enumerate accounts.
  const genericMessage = "If that account needs verifying, we've sent a new link.";

  if (!validatedFields.success) {
    return { message: genericMessage };
  }

  const email = normalizeEmail(validatedFields.data.email);

  const allowed = await checkRateLimit(`resend-verify:${email}`, 3, 60 * 60 * 1000);
  if (!allowed) {
    return { message: genericMessage };
  }

  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });

  if (user && !user.emailVerified) {
    await sendVerificationEmail(user.email);
  }

  return { message: genericMessage };
}
