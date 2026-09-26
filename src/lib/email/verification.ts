import "server-only";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { EMAIL_FROM, getResendClient, isEmailConfigured } from "@/lib/resend";
import { getBaseUrl } from "@/lib/url";
import { normalizeEmail } from "@/lib/email-address";
import { verifyIdentifier } from "./tokens";

const VERIFY_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Server-only on purpose. It used to live in a "use server" file, which
// made it callable from any browser with any email address - anyone could
// make the site send verification emails to arbitrary inboxes. Callers
// (signup, the Google createUser event, the rate-limited resend action)
// decide when it's appropriate to send.
export async function sendVerificationEmail(rawEmail: string) {
  const email = normalizeEmail(rawEmail);
  const token = randomBytes(32).toString("hex");

  // Replaces only this email's earlier verification links - a pending
  // password reset link for the same email stays valid.
  await prisma.verificationToken.deleteMany({
    where: { identifier: { in: [verifyIdentifier(email), email] } },
  });
  await prisma.verificationToken.create({
    data: {
      identifier: verifyIdentifier(email),
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
