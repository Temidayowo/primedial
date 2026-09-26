import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentProvider } from "@/generated/prisma/enums";
import { syncOrderPaymentFromProvider } from "@/lib/payments/reconcile";

// OPay's callbackUrl. Its signature scheme has never been observed from a
// real delivery, so the body is NOT trusted: it's only used to find which
// order to check, and the payment's status and amount come from OPay's
// status API (queryOpayPaymentStatus), which is authenticated with our
// secret key. A forged callback can at most trigger that check.
//
// OPay's redirect flow means the customer may never come back to the site
// after paying, so this is the main way OPay orders get confirmed; the
// order page also checks when the customer does return.
interface OpayCallbackBody {
  payload?: { reference?: unknown };
  reference?: unknown;
}

export async function POST(request: Request) {
  let body: OpayCallbackBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const reference = body.payload?.reference ?? body.reference;
  if (typeof reference !== "string" || reference.length > 100) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { paymentReference: reference },
    select: {
      id: true,
      userId: true,
      paymentStatus: true,
      paymentProvider: true,
      paymentReference: true,
    },
  });

  if (order?.paymentProvider === PaymentProvider.OPAY) {
    await syncOrderPaymentFromProvider(order);
  }

  return NextResponse.json({ received: true });
}
