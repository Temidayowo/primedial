"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Building2, CreditCard, Smartphone } from "lucide-react";
import { payForOrder } from "@/lib/payments/pay-for-order";
import { isNextRedirectError } from "@/lib/next-redirect";
import { cn } from "@/lib/utils";
import type { PaymentMethodChoice } from "@/lib/payment-method";

const METHODS: { id: PaymentMethodChoice; label: string; icon: typeof CreditCard }[] = [
  { id: "card", label: "Card", icon: CreditCard },
  { id: "bank_transfer", label: "Bank Transfer", icon: Building2 },
  { id: "opay", label: "OPay", icon: Smartphone },
];

// Shown on an order's detail page whenever it hasn't been paid for -
// lets a customer finish a payment they abandoned or that failed,
// instead of the only path forward being to re-add everything to their
// cart and check out again as a brand-new order.
export function RetryPayment({
  orderId,
  paymentStatus,
}: {
  orderId: string;
  paymentStatus: "PENDING" | "FAILED";
}) {
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethodChoice>("card");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handlePay = () => {
    setError(null);
    setInfo(null);

    startTransition(async () => {
      try {
        await payForOrder({
          orderId,
          paymentMethod: method,
          onSuccess: () => router.refresh(),
          onError: setError,
          onCardCancelled: () => setError("Payment was cancelled - you can try again."),
          onBankTransferCancelled: () =>
            setInfo(
              "If you already sent the transfer, we'll confirm it automatically once it clears. Otherwise you can try again.",
            ),
        });
      } catch (err) {
        if (isNextRedirectError(err)) throw err;
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  };

  return (
    <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-center gap-2">
        <AlertTriangle className="size-4 text-amber-600" />
        <p className="text-sm font-semibold text-amber-800">
          {paymentStatus === "FAILED" ? "Payment failed" : "Payment not completed"}
        </p>
      </div>
      <p className="mt-1 text-xs text-amber-700">
        This order won&apos;t be processed until it&apos;s paid for. Choose a
        payment method to finish it.
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {METHODS.map(({ id, label, icon: Icon }) => {
          const isSelected = method === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setMethod(id)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg border p-3 text-xs font-medium transition-colors",
                isSelected
                  ? "border-blue-500 bg-blue-50 text-blue"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300",
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handlePay}
        disabled={isPending}
        className="mt-4 w-full rounded-lg bg-blue-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Processing..." : "Pay Now"}
      </button>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      {info && <p className="mt-2 text-xs text-amber-700">{info}</p>}
    </div>
  );
}
