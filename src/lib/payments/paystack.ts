import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";

const PAYSTACK_API_BASE = "https://api.paystack.co";

export type PaystackChannel = "card" | "bank_transfer";

// Paystack's reusable-charge token for a card, returned on any successful
// transaction. `reusable: false` shows up for channels/cards Paystack
// won't let you charge again this way (e.g. some bank transfers) - only
// save it as a PaymentMethod when true.
export interface PaystackAuthorization {
  authorization_code: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  brand?: string;
  card_type?: string;
  reusable: boolean;
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    status: "success" | "failed" | "abandoned" | string;
    reference: string;
    // The total actually charged - when the merchant account is set to
    // pass its transaction fee on to the customer (as this one is),
    // Paystack adds that fee on top and `amount` reflects the
    // fee-inclusive total, NOT what we asked to charge. Compare against
    // `requestedAmount` below instead, or every fee-inclusive charge will
    // look like an amount mismatch.
    amount: number; // kobo
    requested_amount?: number; // kobo - what we actually asked Paystack to charge
    currency: string;
    channel: string;
    authorization?: PaystackAuthorization;
    customer?: { email: string };
  };
}

// Paystack's authorization.brand/card_type come back lowercase and, for
// card_type specifically, with a trailing space (observed directly:
// `"visa "`) - normalized here so it displays consistently with the rest
// of the app's "Visa"/"Mastercard" casing.
function formatCardBrand(brand: string | undefined) {
  const trimmed = brand?.trim();
  if (!trimmed) return "Card";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

export { toKobo } from "./amount";

// What Paystack actually charged for the order itself. When the merchant
// passes its fee on to the customer, `amount` includes that fee and
// `requested_amount` is what we asked for - compare the latter.
export function paystackChargedAmount(transaction: { amount: number; requested_amount?: number }) {
  return transaction.requested_amount ?? transaction.amount;
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

interface PaystackChargeResponse {
  status: boolean;
  message: string;
  data?: {
    // "success" | "failed" | "send_otp" | "send_pin" | "open_url" | "pay_offline" | ...
    // Not empirically tested against a live OTP-required card (auto mode
    // blocks triggering real charge attempts autonomously) - built from
    // Paystack's documented recurring-charges/OTP flow. If a real
    // OTP-required card behaves differently, this is the first place to
    // check.
    status: string;
    reference: string;
    amount?: number; // kobo
    requested_amount?: number; // kobo
    display_text?: string;
    gateway_response?: string;
  };
}

// Charges a previously-saved, reusable authorization directly - no popup,
// no re-entering card details. Only ever call this with an
// authorization_code + email pulled from PaymentMethod, never anything
// client-supplied, since email must exactly match what the authorization
// was created under or Paystack rejects the charge.
export async function chargePaystackAuthorization(params: {
  authorizationCode: string;
  email: string;
  amountKobo: number;
  reference: string;
}) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured");
  }

  const res = await fetch(`${PAYSTACK_API_BASE}/transaction/charge_authorization`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      authorization_code: params.authorizationCode,
      email: params.email,
      amount: params.amountKobo,
      reference: params.reference,
    }),
  });

  const body = (await res.json()) as PaystackChargeResponse;

  if (!res.ok || !body.status || !body.data) {
    throw new Error(body.message || "Paystack charge request failed");
  }

  return body.data;
}

// Continues a charge that came back with data.status === "send_otp".
export async function submitPaystackOtp(params: { otp: string; reference: string }) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured");
  }

  const res = await fetch(`${PAYSTACK_API_BASE}/charge/submit_otp`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ otp: params.otp, reference: params.reference }),
  });

  const body = (await res.json()) as PaystackChargeResponse;

  if (!res.ok || !body.status || !body.data) {
    throw new Error(body.message || "OTP submission failed");
  }

  return body.data;
}

// Called after any successful Paystack payment (client-verify route and
// webhook both call this - see /api/verify-payment and
// /api/paystack-webhook) to turn a reusable authorization into a real,
// chargeable saved card. Upserts on authorization_code so a customer
// paying with the same card twice doesn't create duplicate rows.
export async function saveOrUpdatePaystackAuthorization(params: {
  userId: string;
  authorization: PaystackAuthorization;
  email: string;
  cardholderName: string;
}) {
  if (!params.authorization.reusable) return;

  const isFirst = (await prisma.paymentMethod.count({
    where: { userId: params.userId },
  })) === 0;

  await prisma.paymentMethod.upsert({
    where: { paystackAuthorizationCode: params.authorization.authorization_code },
    update: {
      last4: params.authorization.last4,
      expiryMonth: Number(params.authorization.exp_month),
      expiryYear: Number(params.authorization.exp_year),
    },
    create: {
      userId: params.userId,
      brand: formatCardBrand(params.authorization.brand ?? params.authorization.card_type),
      last4: params.authorization.last4,
      cardholderName: params.cardholderName,
      expiryMonth: Number(params.authorization.exp_month),
      expiryYear: Number(params.authorization.exp_year),
      isDefault: isFirst,
      paystackAuthorizationCode: params.authorization.authorization_code,
      paystackCustomerEmail: params.email,
    },
  });
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
