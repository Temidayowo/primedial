import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifyPaystackTransaction, toKobo } from "@/lib/payments/paystack";
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

  const { reference } = (await request.json().catch(() => ({}))) as {
    reference?: string;
  };

  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { paymentReference: reference } });

  if (!order || order.userId !== session.user.id) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.paymentStatus === "PAID") {
    return NextResponse.json({ status: "paid", orderId: order.id });
  }

  try {
    const transaction = await verifyPaystackTransaction(reference);

    if (
      transaction.status !== "success" ||
      transaction.amount !== toKobo(Number(order.total))
    ) {
      return NextResponse.json(
        { status: "failed", error: "Payment not confirmed" },
        { status: 402 },
      );
    }

    const result = await markOrderPaidByReference(reference);

    if (!result.ok) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
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
