import { NextResponse } from "next/server";
import {
  verifyPaystackWebhookSignature,
  saveOrUpdatePaystackAuthorization,
  type PaystackAuthorization,
} from "@/lib/payments/paystack";
import { markOrderPaidByReference, markOrderFailedByReference } from "@/lib/payments/order-status";
import { prisma } from "@/lib/prisma";

interface PaystackWebhookEvent {
  event: string;
  data: {
    reference: string;
    status: string;
    authorization?: PaystackAuthorization;
    customer?: { email: string };
  };
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
    case "charge.success": {
      const result = await markOrderPaidByReference(event.data.reference);

      if (result.ok && event.data.authorization && event.data.customer) {
        const user = await prisma.user.findUnique({
          where: { id: result.userId },
          select: { name: true },
        });

        await saveOrUpdatePaystackAuthorization({
          userId: result.userId,
          authorization: event.data.authorization,
          email: event.data.customer.email,
          cardholderName: user?.name ?? "Cardholder",
        });
      }
      break;
    }
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
