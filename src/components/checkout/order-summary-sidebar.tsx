"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock } from "lucide-react";
import { createPendingOrder } from "@/lib/actions/cart.action";
import { payForOrder } from "@/lib/payments/pay-for-order";
import { isNextRedirectError } from "@/lib/next-redirect";
import { OtpModal } from "@/components/ui/otp-modal";
import { TAX_RATE } from "@/lib/cart-constants";
import { formatCurrency } from "@/lib/utils";
import type { PaymentMethodChoice } from "@/lib/payment-method";

interface SummaryItem {
  id: string;
  name: string;
  image?: string;
  unitPrice: number;
  quantity: number;
}

export function OrderSummarySidebar({
  items,
  subtotal,
  shippingCost,
  shippingMethodId,
  selectedAddressId,
  paymentMethod,
  selectedSavedCardId,
}: {
  items: SummaryItem[];
  subtotal: number;
  shippingCost: number;
  shippingMethodId: string;
  selectedAddressId: string | null;
  paymentMethod: PaymentMethodChoice;
  selectedSavedCardId: string | null;
}) {
  const router = useRouter();
  const [isPlacingOrder, startPlaceOrder] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [otpRequest, setOtpRequest] = useState<{
    displayText: string;
    submit: (otp: string) => Promise<void>;
  } | null>(null);

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + shippingCost;

  const handlePlaceOrder = () => {
    if (!selectedAddressId) return;
    setError(null);

    startPlaceOrder(async () => {
      try {
        // Only the choices go to the server - it prices the order itself.
        const order = await createPendingOrder({
          addressId: selectedAddressId,
          shippingMethodId,
        });

        if (!order.ok) {
          setError(order.error);
          return;
        }

        await payForOrder({
          orderId: order.orderId,
          paymentMethod,
          savedCardId: selectedSavedCardId,
          onSuccess: () => router.push(`/account/orders/${order.orderId}`),
          onError: setError,
          onCardCancelled: () =>
            setError("Payment was cancelled. Your order is saved - you can try again."),
          onBankTransferCancelled: () =>
            setError(
              "If you already sent the transfer, we'll confirm it automatically once it clears. Otherwise your order is saved - you can try again below.",
            ),
          onOtpRequired: setOtpRequest,
        });
      } catch (err) {
        if (isNextRedirectError(err)) throw err;
        setError(
          err instanceof Error ? err.message : "Something went wrong placing your order",
        );
      }
    });
  };

  return (
    <div className="h-fit space-y-4 lg:sticky lg:top-6">
      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <h2 className="font-clash-display text-lg font-bold text-blue">
          Order Summary
        </h2>

        <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="flex size-4 items-center justify-center rounded-full bg-blue text-[10px] font-medium text-white">
                  {item.quantity}
                </span>
                <div className="relative size-12 overflow-hidden rounded-lg bg-gray-100">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  )}
                </div>
              </div>
              <p className="line-clamp-2 min-w-0 flex-1 text-xs text-slate-600">
                {item.name}
              </p>
              <p className="shrink-0 text-xs font-medium text-blue">
                {formatCurrency(item.unitPrice * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Estimated Tax</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Shipping</span>
            <span>{formatCurrency(shippingCost)}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="font-semibold text-blue">Total</span>
          <span className="font-clash-display text-xl font-bold text-blue">
            {formatCurrency(total)}
          </span>
        </div>

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder || !selectedAddressId}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-green py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-blue disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Lock className="size-4" />
          {isPlacingOrder ? "Placing Order..." : "Place Order"}
        </button>

        {!selectedAddressId && (
          <p className="mt-2 text-center text-[11px] text-amber-600">
            Add a shipping address to continue.
          </p>
        )}
        {error && (
          <p className="mt-2 text-center text-[11px] text-red-600">{error}</p>
        )}
        <p className="mt-2 text-center text-[11px] text-slate-500">
          By placing your order, you agree to our Terms of Service.
        </p>
      </div>

      <OtpModal
        open={otpRequest !== null}
        displayText={otpRequest?.displayText ?? ""}
        onSubmit={async (otp) => {
          await otpRequest?.submit(otp);
          setOtpRequest(null);
        }}
        onClose={() => setOtpRequest(null)}
      />
    </div>
  );
}
