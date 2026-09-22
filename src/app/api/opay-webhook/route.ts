import { NextResponse } from "next/server";
import { verifyOpayWebhookSignature } from "@/lib/payments/opay";
import { markOrderPaidByReference, markOrderFailedByReference } from "@/lib/payments/order-status";

// ⚠️ FLAG FOR REVIEW: the payload shape assumed below (a `payload` object
// carrying `reference`/`status`, alongside a top-level `sha512` signature)
// is OPay's commonly-documented webhook shape, but has not been confirmed
// against this merchant account's actual current docs/sandbox - see the
// larger flag comment in src/lib/payments/opay.ts. Log the raw body the
// first time a real OPay webhook arrives in sandbox and adjust this parsing
// to match before relying on it.
interface OpayWebhookBody {
  payload?: { reference?: string; status?: string };
  sha512?: string;
}

// Backup source of truth for OPay payments - the redirect flow means the
// user's browser may never come back to this app at all (they could close
// the OPay tab after paying), so unlike Paystack's popup flow, this
// webhook is effectively the *primary* way OPay orders get confirmed, not
// just a fallback. Configure this URL as the callbackUrl / webhook
// endpoint in the OPay merchant dashboard.
export async function POST(request: Request) {
  const rawBody = await request.text();

  let body: OpayWebhookBody;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Signature may arrive as a header (checked first) or embedded in the
  // body as `sha512` - see the flag above, confirm which one OPay actually
  // sends for this account before trusting either path.
  const headerSignature = request.headers.get("x-opay-signature");
  const signature = headerSignature ?? body.sha512 ?? null;
  const signedContent = headerSignature ? rawBody : JSON.stringify(body.payload ?? {});

  if (!verifyOpayWebhookSignature(signedContent, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const reference = body.payload?.reference;
  const status = body.payload?.status;

  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  if (status === "SUCCESS") {
    await markOrderPaidByReference(reference);
  } else if (status === "FAIL" || status === "FAILED" || status === "CLOSE") {
    await markOrderFailedByReference(reference);
  }

  return NextResponse.json({ received: true });
}
