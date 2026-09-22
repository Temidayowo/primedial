import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

// OPay's hosted "Cashier" checkout API.
//
// CONFIRMED against the real sandbox (2026-09-22) with live merchant
// credentials, resolving what used to be the biggest open question here:
//   - Base URL and `/api/v1/international/cashier/create` path are correct.
//   - Auth is `Authorization: Bearer <OPAY_PUBLIC_KEY>` - a plain bearer
//     token, NOT an HMAC signature of the request body. The secret key is
//     not used anywhere in this call at all.
//   - `payMethod` values are per-country and case-sensitive (see
//     createOpayCashierCheckout below for Nigeria's exact value). Omitting
//     it shows every method the merchant account supports instead.
//     Sending it as an array breaks request parsing entirely; an invalid
//     or wrong-country string silently returns "payMethod not supported"
//     instead of an error that points at the field.
//
// #############################################################################
// # STILL UNVERIFIED: verifyOpayWebhookSignature below and the webhook      #
// # payload shape in /api/opay-webhook. The create-call test above proved  #
// # the secret key isn't involved in signing *requests*, but OPay webhooks #
// # are a separate, incoming direction - there's no way to confirm their   #
// # payload/signature scheme without an actual webhook firing. Log the raw #
// # body the first time one arrives in sandbox (complete an OPay test      #
// # payment via the cashierUrl this file returns) and adjust                #
// # verifyOpayWebhookSignature and the /api/opay-webhook route to match.   #
// #############################################################################

const OPAY_LIVE_BASE = "https://liveapi.opaycheckout.com";
const OPAY_SANDBOX_BASE = "https://sandboxapi.opaycheckout.com";

function opayBaseUrl() {
  return process.env.NODE_ENV === "production" ? OPAY_LIVE_BASE : OPAY_SANDBOX_BASE;
}

function opayEnv() {
  const publicKey = process.env.OPAY_PUBLIC_KEY;
  const secretKey = process.env.OPAY_SECRET_KEY;
  const merchantId = process.env.OPAY_MERCHANT_ID;

  if (!publicKey || !secretKey || !merchantId) {
    throw new Error(
      "OPAY_PUBLIC_KEY, OPAY_SECRET_KEY, and OPAY_MERCHANT_ID must all be configured",
    );
  }

  return { publicKey, secretKey, merchantId };
}

interface CreateCashierParams {
  reference: string;
  amountKobo: number;
  currency?: string;
  description: string;
  userEmail: string;
  returnUrl: string;
  callbackUrl: string;
  cancelUrl: string;
}

interface OpayCashierCreateResponse {
  code: string;
  message: string;
  data?: {
    reference: string;
    orderNo: string;
    cashierUrl: string;
    status: string;
  };
}

export async function createOpayCashierCheckout(params: CreateCashierParams) {
  const { publicKey, merchantId } = opayEnv();

  const body = {
    country: "NG",
    reference: params.reference,
    amount: {
      total: params.amountKobo,
      currency: params.currency ?? "NGN",
    },
    returnUrl: params.returnUrl,
    callbackUrl: params.callbackUrl,
    cancelUrl: params.cancelUrl,
    expireAt: 30, // minutes
    // Restricts the hosted cashier page to OPay Wallet only, instead of
    // showing a method-selection screen (card/bank transfer/USSD/wallet) -
    // this app already presents Card and Bank Transfer as their own
    // separate options via Paystack, so "OPay" as a choice should mean
    // wallet payment specifically, not another menu. Confirmed against
    // the sandbox: this exact string, from OPay's Nigeria payMethod list
    // (documentation.opaycheckout.com/regional-payment-methods) - it's
    // case-sensitive and country-specific (e.g. Egypt uses different
    // values entirely), so don't guess at this one if it ever needs
    // revisiting.
    payMethod: "OpayWalletNg",
    productList: [
      {
        productId: params.reference,
        name: params.description,
        description: params.description,
        price: params.amountKobo,
      },
    ],
    userInfo: {
      userEmail: params.userEmail,
    },
  };

  const res = await fetch(`${opayBaseUrl()}/api/v1/international/cashier/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${publicKey}`,
      MerchantId: merchantId,
    },
    body: JSON.stringify(body),
  });

  const json = (await res.json()) as OpayCashierCreateResponse;

  if (!res.ok || json.code !== "00000" || !json.data) {
    throw new Error(json.message || "OPay cashier/create request failed");
  }

  return json.data;
}

// See the "STILL UNVERIFIED" block above - shape/algorithm needs
// confirming against a real webhook delivery. Implemented as HMAC-SHA512
// of the raw JSON body using the secret key (the one place it's actually
// used), compared against a `sha512`/`signature` field OPay is expected
// to send either as a header or inside the payload itself.
export function verifyOpayWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
) {
  const secretKey = process.env.OPAY_SECRET_KEY;
  if (!secretKey || !signatureHeader) return false;

  const expected = createHmac("sha512", secretKey).update(rawBody).digest("hex");

  const expectedBuf = Buffer.from(expected, "utf8");
  const actualBuf = Buffer.from(signatureHeader, "utf8");

  return (
    expectedBuf.length === actualBuf.length &&
    timingSafeEqual(expectedBuf, actualBuf)
  );
}
