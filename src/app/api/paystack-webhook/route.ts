import { NextResponse } from "next/server";
import { verifyPaystackWebhookSignature } from "@/lib/payments/paystack";
import { markOrderPaidByReference, markOrderFailedByReference } from "@/lib/payments/order-status";

interface PaystackWebhookEvent {
  event: string;
  data: { reference: string; status: string };
}

// Backup source of truth for Paystack payments, independent of the
// client-side /api/verify-payment call - covers the case where the user
// pays successfully but closes the tab, loses network, or the popup's
// onSuccess never fires. Configure this URL in the Paystack dashboard
// under Settings -> API Keys & Webhooks.
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyPaystackWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: PaystackWebhookEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  switch (event.event) {
    case "charge.success":
      await markOrderPaidByReference(event.data.reference);
      break;
    case "charge.failed":
      await markOrderFailedByReference(event.data.reference);
      break;
    default:
      // Ignore event types we don't act on (transfer events, etc).
      break;
  }

  // Paystack expects a fast 200 regardless of what we did with the event -
  // returning anything else makes it retry the same event repeatedly.
  return NextResponse.json({ received: true });
}
