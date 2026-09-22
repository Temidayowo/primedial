import {
  initiatePaystackPayment,
  initiateOpayPayment,
} from "@/lib/actions/payments.action";
import { openPaystackPopup } from "@/lib/payments/paystack-client";
import type { PaymentMethodChoice } from "@/lib/payment-method";

interface PayForOrderParams {
  orderId: string;
  paymentMethod: PaymentMethodChoice;
  onSuccess: () => void | Promise<void>;
  onError: (message: string) => void;
  // Card: closing the popup before it reports success genuinely means
  // nothing was charged - safe to just say "cancelled, try again".
  onCardCancelled: () => void;
  // Bank Transfer: the popup shows account details and waits for the
  // transfer to land, which can take minutes to hours for a real bank.
  // Closing the popup is not proof the transfer didn't happen - if the
  // user already sent it, /api/paystack-webhook will still confirm it
  // later. Calling this "cancelled" would be actively misleading.
  onBankTransferCancelled: () => void;
}

// Shared by the checkout page (paying for a brand-new pending order) and
// the "Payment not completed" retry panel on an order's detail page
// (paying for an existing one) - same provider calls, same popup
// wiring, same verify step either way.
export async function payForOrder(params: PayForOrderParams) {
  const { orderId, paymentMethod } = params;

  if (paymentMethod === "opay") {
    const { cashierUrl } = await initiateOpayPayment(orderId);
    window.location.href = cashierUrl;
    return;
  }

  const channel = paymentMethod === "card" ? "card" : "bank_transfer";
  const payment = await initiatePaystackPayment(orderId, channel);

  if (!payment.publicKey) {
    throw new Error("Payments are not configured yet");
  }

  await openPaystackPopup({
    publicKey: payment.publicKey,
    email: payment.email,
    amountKobo: payment.amountKobo,
    reference: payment.reference,
    channels: payment.channels,
    onSuccess: async (transaction) => {
      try {
        const res = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: transaction.reference }),
        });

        if (!res.ok) {
          throw new Error("Payment could not be verified");
        }

        await params.onSuccess();
      } catch {
        params.onError(
          "We received your payment but couldn't confirm it yet - check My Orders in a moment, or contact support.",
        );
      }
    },
    onCancel: () => {
      if (paymentMethod === "bank_transfer") {
        params.onBankTransferCancelled();
      } else {
        params.onCardCancelled();
      }
    },
  });
}
