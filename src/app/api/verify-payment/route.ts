import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  verifyPaystackTransaction,
  toKobo,
  saveOrUpdatePaystackAuthorization,
} from "@/lib/payments/paystack";
import { markOrderPaidByReference } from "@/lib/payments/order-status";

// Called by the client immediately after the Paystack popup reports
// success, so the order can flip to "paid" (and the UI redirect to the
// order page) without waiting on the webhook. Still fully re-verifies
// against Paystack's API rather than trusting the popup callback - a
// client-side "success" event is not proof a charge actually cleared.
// /api/paystack-webhook is the backup path if this call never happens
// (tab closed right after paying, network drop, etc).
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // This proxies a real call to Paystack's API per request - without a
  // limit, a client could hammer both this endpoint and, through it,
  // Paystack's API.
  const allowed = await checkRateLimit(`verify-payment:${session.user.id}`, 20, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { orderId, reference } = (await request.json().catch(() => ({}))) as {
    orderId?: string;
    reference?: string;
  };

  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  // Looked up by orderId (which the client that just created this order
  // knows reliably) rather than solely by matching paymentReference -
  // Paystack's popup can report back a different reference than the one
  // we asked it to use for this attempt (their docs describe transaction
  // resumption logic that can kick in), which would otherwise 404 here
  // even though it's genuinely this order's payment. Falls back to the
  // old reference-only lookup for callers that don't have an orderId yet.
  const order = orderId
    ? await prisma.order.findFirst({ where: { id: orderId, userId: session.user.id } })
    : await prisma.order.findFirst({ where: { paymentReference: reference, userId: session.user.id } });

  if (!order) {
    console.error(
      `[verify-payment] Order not found for orderId=${orderId ?? "(none)"} reference=${reference} user=${session.user.id}`,
    );
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.paymentStatus === "PAID") {
    return NextResponse.json({ status: "paid", orderId: order.id });
  }

  try {
    const transaction = await verifyPaystackTransaction(reference);

    // Compare against requested_amount, not amount - when the merchant
    // account passes its transaction fee on to the customer (as this one
    // does), Paystack adds that fee on top and `amount` is the
    // fee-inclusive total actually charged, not what we asked for.
    // requested_amount is only absent on very old transactions, so amount
    // is a reasonable fallback rather than failing verification outright.
    const chargedAmount = transaction.requested_amount ?? transaction.amount;

    if (transaction.status !== "success" || chargedAmount !== toKobo(Number(order.total))) {
      console.error(
        `[verify-payment] Not confirmed for order=${order.id} reference=${reference}: status=${transaction.status} chargedAmount=${chargedAmount} expected=${toKobo(Number(order.total))}`,
      );
      return NextResponse.json(
        { status: "failed", error: "Payment not confirmed" },
        { status: 402 },
      );
    }

    // Paystack's actual reference for this transaction may not match what
    // we had stored (see the orderId lookup comment above) - reconcile it
    // here so markOrderPaidByReference's own lookup succeeds regardless.
    if (order.paymentReference !== reference) {
      await prisma.order.update({ where: { id: order.id }, data: { paymentReference: reference } });
    }

    const result = await markOrderPaidByReference(reference);

    if (!result.ok) {
      console.error(`[verify-payment] markOrderPaidByReference failed for reference=${reference}`);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (transaction.authorization && transaction.customer) {
      await saveOrUpdatePaystackAuthorization({
        userId: order.userId,
        authorization: transaction.authorization,
        email: transaction.customer.email,
        cardholderName: session.user.name ?? "Cardholder",
      });
    }

    return NextResponse.json({ status: "paid", orderId: result.orderId });
  } catch (error) {
    console.error("Paystack verification failed", error);
    return NextResponse.json(
      { error: "Could not verify payment with Paystack" },
      { status: 502 },
    );
  }
}
