import "server-only";
import { Resend } from "resend";

// Constructing `new Resend()` throws immediately if there's no API key,
// so this stays lazy - callers check `isEmailConfigured()` first and
// fall back to a dev-mode console.log when no key is set yet.
let client: Resend | undefined;

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export function getResendClient() {
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
}

export const EMAIL_FROM =
  process.env.EMAIL_FROM || "Prime Dial Solutions <onboarding@resend.dev>";
