"use server";

import { randomBytes } from "crypto";
import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { EMAIL_FROM, getResendClient, isEmailConfigured } from "@/lib/resend";
import { getBaseUrl } from "@/lib/url";
import { sendWelcomeEmail } from "@/lib/actions/welcome-email";
import { checkRateLimit } from "@/lib/rate-limit";

const VERIFY_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function sendVerificationEmail(email: string) {
  const token = randomBytes(32).toString("hex");

  await prisma.verificationToken.deleteMany({ where: { identifier: email } });
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(Date.now() + VERIFY_TOKEN_TTL_MS),
    },
  });

  const verifyLink = `${await getBaseUrl()}/verify-email/${token}`;

  if (isEmailConfigured()) {
    const { error } = await getResendClient().emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: "Verify your Prime Dial Solutions email",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h1 style="color: #0f172a; font-size: 20px;">Verify your email</h1>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            Confirm your email address to finish creating your Prime Dial
            Solutions account. This link expires in 24 hours.
          </p>
          <a
            href="${verifyLink}"
            style="display: inline-block; margin-top: 16px; padding: 10px 20px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 14px;"
          >
            Verify Email
          </a>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
            If you didn't create this account, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error(`[verify email] Resend failed for ${email}:`, error);
    }
  } else {
    console.log(`[verify email] ${email} -> ${verifyLink} (expires in 24h)`);
  }
}

export type VerifyEmailResult = {
  success: boolean;
  message: string;
  email?: string;
};

export async function verifyEmail(token: string): Promise<VerifyEmailResult> {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return {
      success: false,
      message: "This verification link is invalid.",
    };
  }

  if (verificationToken.expires < new Date()) {
    return {
      success: false,
      message: "This verification link has expired.",
      email: verificationToken.identifier,
    };
  }

  const user = await prisma.user.update({
    where: { email: verificationToken.identifier },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({ where: { token } });

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

  const { email } = validatedFields.data;

  const allowed = await checkRateLimit(`resend-verify:${email}`, 3, 60 * 60 * 1000);
  if (!allowed) {
    return { message: genericMessage };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (user && !user.emailVerified) {
    await sendVerificationEmail(email);
  }

  return { message: genericMessage };
}
