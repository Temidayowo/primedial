import { EMAIL_FROM, getResendClient, isEmailConfigured } from "@/lib/resend";

// Not a form action - called from the `createUser` event in src/auth.ts,
// which only fires when the adapter creates a brand-new user (i.e. a
// first-time OAuth sign-in). Credentials signups never hit this since
// they create their User row directly in src/lib/actions/auth.action.ts.
export async function sendWelcomeEmail(email: string, name?: string | null) {
  if (!isEmailConfigured()) {
    console.log(`[welcome email] Skipped for ${email} (Resend not configured)`);
    return;
  }

  const { error } = await getResendClient().emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: "Welcome to Prime Dial Solutions",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="color: #0f172a; font-size: 20px;">Welcome${name ? `, ${name}` : ""}!</h1>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">
          Your Prime Dial Solutions account is ready to go. Since you signed
          up with Google, your email is already verified - no extra steps
          needed.
        </p>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">
          You can now sign in to manage your orders, request quotes, and
          access exclusive pricing for your survey crew.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error(`[welcome email] Resend failed for ${email}:`, error);
  }
}
