import { NextResponse } from "next/server";
import { verifyPaystackWebhookSignature } from "@/lib/payments/paystack";
import {
  markOrderFailedByReference,
  orderNumberFromReference,
} from "@/lib/payments/order-status";
import { syncOrderPaymentFromProvider } from "@/lib/payments/reconcile";
import { prisma } from "@/lib/prisma";
import { PaymentProvider } from "@/generated/prisma/enums";

interface PaystackWebhookEvent {
  event: string;
  data: { reference?: string };
}

// Backup source of truth for Paystack payments, independent of the
// client-side /api/verify-payment call - covers the case where the user
// pays but closes the tab, loses network, or the popup's onSuccess never
// fires. Configure this URL in the Paystack dashboard under
// Settings -> API Keys & Webhooks.
//
// A signed event only tells us "something happened to this reference".
// What gets recorded comes from Paystack's verify API, including the
// amount: the popup amount is set in the browser, so a successful charge
// can be for less than the order total, and must not mark it paid.
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

  const reference = event.data?.reference;
  if (!reference) return NextResponse.json({ received: true });

  switch (event.event) {
    case "charge.success": {
      const order = await findOrderForWebhook(reference);
      if (order) {
        // Check this exact reference (it may be an earlier attempt's).
        await syncOrderPaymentFromProvider({
          ...order,
          paymentProvider: PaymentProvider.PAYSTACK,
          paymentReference: reference,
        });
      }
      break;
    }
    case "charge.failed":
      await markOrderFailedByReference(reference);
      break;
    default:
      // Ignore event types we don't act on (transfer events, etc).
      break;
  }

  // Paystack expects a fast 200 regardless of what we did with the event -
  // returning anything else makes it retry the same event repeatedly.
  return NextResponse.json({ received: true });
}

// The order this reference belongs to: its current reference, or an
// earlier attempt's (references start with the order number).
async function findOrderForWebhook(reference: string) {
  const select = { id: true, userId: true, paymentStatus: true } as const;
  const current = await prisma.order.findUnique({
    where: { paymentReference: reference },
    select,
  });
  if (current) return current;

  const orderNumber = orderNumberFromReference(reference);
  return orderNumber ? prisma.order.findUnique({ where: { orderNumber }, select }) : null;
}
