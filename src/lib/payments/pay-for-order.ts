import {
  initiatePaystackPayment,
  initiateOpayPayment,
  payWithSavedCard,
  submitSavedCardOtp,
} from "@/lib/actions/payments.action";
import { openPaystackPopup } from "@/lib/payments/paystack-client";
import type { PaymentMethodChoice } from "@/lib/payment-method";

interface PayForOrderParams {
  orderId: string;
  paymentMethod: PaymentMethodChoice;
  // Only meaningful when paymentMethod is "card" - charges this saved
  // card's Paystack authorization directly instead of opening the popup.
  savedCardId?: string | null;
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
  // A saved-card charge came back needing an OTP - Paystack has no
  // hosted UI for this step (unlike the popup), so the caller has to
  // show its own prompt. Call `submit` with what the customer enters;
  // it resolves onSuccess itself on a correct OTP, or throws on a wrong
  // one so the caller can show the OTP field again.
  onOtpRequired?: (params: {
    displayText: string;
    submit: (otp: string) => Promise<void>;
  }) => void;
}

// Shared by the checkout page (paying for a brand-new pending order) and
// the "Payment not completed" retry panel on an order's detail page
// (paying for an existing one) - same provider calls, same popup
// wiring, same verify step either way.
export async function payForOrder(params: PayForOrderParams) {
  const { orderId, paymentMethod, savedCardId } = params;

  if (paymentMethod === "opay") {
    const { cashierUrl } = await initiateOpayPayment(orderId);
    window.location.href = cashierUrl;
    return;
  }

  if (paymentMethod === "card" && savedCardId) {
    const charge = await payWithSavedCard(orderId, savedCardId);

    if (charge.status === "paid") {
      await params.onSuccess();
      return;
    }

    if (!params.onOtpRequired) {
      throw new Error("This card needs extra verification - use a new card instead");
    }

    params.onOtpRequired({
      displayText: charge.displayText,
      submit: async (otp: string) => {
        await submitSavedCardOtp(orderId, charge.reference, otp);
        await params.onSuccess();
      },
    });
    return;
  }

  const channel = paymentMethod === "card" ? "card" : "bank_transfer";
  const payment = await initiatePaystackPayment(orderId, channel);

  // Reconciled against an existing reference from a prior attempt that
  // turned out to have already succeeded (see reconcileIfAlreadyPaid in
  // payments.action.ts) - no new charge needed.
  if (payment.alreadyPaid) {
    await params.onSuccess();
    return;
  }

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
      const verifyOnce = async () => {
        const res = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, reference: transaction.reference }),
        });

        if (!res.ok) {
          throw new Error("Payment could not be verified");
        }
      };

      try {
        try {
          await verifyOnce();
        } catch {
          // One retry after a short delay - this call goes to our own
          // server on the same machine, so a first failure is most likely
          // a transient blip rather than something that needs a human.
          await new Promise((resolve) => setTimeout(resolve, 1500));
          await verifyOnce();
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
