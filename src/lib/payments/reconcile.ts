import "server-only";
import { prisma } from "@/lib/prisma";
import { PaymentProvider, PaymentStatus } from "@/generated/prisma/enums";
import {
  paystackChargedAmount,
  saveOrUpdatePaystackAuthorization,
  verifyPaystackTransaction,
} from "@/lib/payments/paystack";
import { queryOpayPaymentStatus } from "@/lib/payments/opay";
import {
  markOrderFailedByReference,
  markOrderPaidByReference,
} from "@/lib/payments/order-status";

export type ProviderSyncResult = "paid" | "failed" | "pending" | "unknown";

// Asks the payment provider what happened to the order's current payment
// reference and records the answer. Used:
//   - before starting a new payment attempt, so replacing the reference
//     can never orphan a payment that actually went through (whichever
//     provider the previous attempt used);
//   - by the OPay webhook, which trusts only this server-to-server answer;
//   - when a customer lands back on their order page after paying.
// Never throws - an unreachable provider is reported as "unknown".
export async function syncOrderPaymentFromProvider(order: {
  id: string;
  userId: string;
  paymentStatus: PaymentStatus;
  paymentProvider: PaymentProvider | null;
  paymentReference: string | null;
}): Promise<ProviderSyncResult> {
  if (order.paymentStatus === PaymentStatus.PAID) return "paid";
  const reference = order.paymentReference;
  if (!reference || !order.paymentProvider) return "unknown";

  try {
    if (order.paymentProvider === PaymentProvider.PAYSTACK) {
      const transaction = await verifyPaystackTransaction(reference);

      if (transaction.status === "success") {
        const result = await markOrderPaidByReference(
          reference,
          paystackChargedAmount(transaction),
        );
        if (!result.ok) return "unknown";

        if (transaction.authorization && transaction.customer) {
          const user = await prisma.user.findUnique({
            where: { id: order.userId },
            select: { name: true },
          });
          await saveOrUpdatePaystackAuthorization({
            userId: order.userId,
            authorization: transaction.authorization,
            email: transaction.customer.email,
            cardholderName: user?.name ?? "Cardholder",
          });
        }
        return "paid";
      }

      if (transaction.status === "failed") {
        await markOrderFailedByReference(reference);
        return "failed";
      }
      return "pending";
    }

    if (order.paymentProvider === PaymentProvider.OPAY) {
      const payment = await queryOpayPaymentStatus(reference);
      if (!payment) return "pending";

      if (payment.status === "SUCCESS") {
        if (payment.currency !== "NGN" || payment.amountKobo === null) {
          console.error(
            `[payment] OPay reference ${reference} succeeded in ${payment.currency} - not marking paid.`,
          );
          return "unknown";
        }
        const result = await markOrderPaidByReference(reference, payment.amountKobo);
        return result.ok ? "paid" : "unknown";
      }

      if (payment.status === "FAIL" || payment.status === "CLOSE") {
        await markOrderFailedByReference(reference);
        return "failed";
      }
      return "pending";
    }
  } catch (error) {
    console.error(`[payment] Could not check reference ${reference} with the provider:`, error);
  }

  return "unknown";
}
