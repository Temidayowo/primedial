"use client";

import { useTransition } from "react";
import { checkout } from "@/lib/actions/cart.action";
import { TAX_RATE, FLAT_SHIPPING } from "@/lib/cart-constants";
import { formatCurrency } from "@/lib/utils";

export function OrderSummary({ subtotal }: { subtotal: number }) {
  const [isCheckingOut, startCheckout] = useTransition();

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + FLAT_SHIPPING;

  const handleCheckout = () => {
    startCheckout(async () => {
      await checkout();
    });
  };

  return (
    <div className="h-fit rounded-xl border border-gray-100 bg-white p-6">
      <h2 className="font-clash-display text-lg font-bold text-blue">
        Order Summary
      </h2>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between text-slate-500">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Estimated Tax</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Estimated Shipping</span>
          <span>{formatCurrency(FLAT_SHIPPING)}</span>
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
        onClick={handleCheckout}
        disabled={isCheckingOut}
        className="mt-6 w-full rounded-lg bg-blue-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
      >
        {isCheckingOut ? "Placing Order..." : "Proceed to Checkout"}
      </button>
      <p className="mt-2 text-center text-[11px] text-slate-500">
        No online payment is set up yet - checkout places your order for
        follow-up, using your default saved address.
      </p>
    </div>
  );
}
