import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

const PAYSTACK_API_BASE = "https://api.paystack.co";

export type PaystackChannel = "card" | "bank_transfer";

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    status: "success" | "failed" | "abandoned" | string;
    reference: string;
    amount: number; // kobo
    currency: string;
    channel: string;
  };
}

// Converts a naira amount (what's stored on Order.total) to the kobo
// integer Paystack's API expects. Rounded because Decimal -> Number can
// carry float dust (e.g. 4999.9999999999).
export function toKobo(nairaAmount: number) {
  return Math.round(nairaAmount * 100);
}

// Server-side verification against Paystack's own record of the charge -
// never trust the client's "it succeeded" callback alone. Used by both
// /api/verify-payment (client-triggered, fast path) and the webhook
// (backup path, in case the client never calls verify).
export async function verifyPaystackTransaction(reference: string) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured");
  }

  const res = await fetch(
    `${PAYSTACK_API_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${secretKey}` },
      cache: "no-store",
    },
  );

  const body = (await res.json()) as PaystackVerifyResponse;

  if (!res.ok || !body.status || !body.data) {
    throw new Error(body.message || "Paystack verification request failed");
  }

  return body.data;
}

// Paystack signs webhook bodies with HMAC-SHA512 of the *raw* request body
// using the secret key, sent back as the `x-paystack-signature` header.
// https://paystack.com/docs/payments/webhooks/#verifying-the-source-of-the-webhook
export function verifyPaystackWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey || !signatureHeader) return false;

  const expected = createHmac("sha512", secretKey).update(rawBody).digest("hex");

  const expectedBuf = Buffer.from(expected, "utf8");
  const actualBuf = Buffer.from(signatureHeader, "utf8");

  return (
    expectedBuf.length === actualBuf.length &&
    timingSafeEqual(expectedBuf, actualBuf)
  );
}
