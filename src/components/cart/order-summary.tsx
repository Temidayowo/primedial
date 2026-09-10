"use client";

import { useState, useTransition } from "react";
import { applyPromoCode, checkout } from "@/lib/actions/cart.action";
import { TAX_RATE, FLAT_SHIPPING } from "@/lib/cart-constants";
import { formatCurrency } from "@/lib/utils";

export function OrderSummary({ subtotal }: { subtotal: number }) {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<{
    code: string;
    percentOff: number;
  } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isApplying, startApplying] = useTransition();
  const [isCheckingOut, startCheckout] = useTransition();

  const discount = applied ? (subtotal * applied.percentOff) / 100 : 0;
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * TAX_RATE;
  const total = taxableAmount + tax + FLAT_SHIPPING;

  const handleApplyPromo = () => {
    if (!code.trim()) return;
    setPromoError(null);
    startApplying(async () => {
      const result = await applyPromoCode(code);
      if (result.valid) {
        setApplied({ code: result.code, percentOff: result.percentOff });
      } else {
        setApplied(null);
        setPromoError(result.message);
      }
    });
  };

  const handleCheckout = () => {
    startCheckout(async () => {
      await checkout(applied?.code);
    });
  };

  return (
    <div className="h-fit rounded-xl border border-white/10 bg-white/5 p-6">
      <h2 className="font-clash-display text-lg font-bold text-white">
        Order Summary
      </h2>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between text-slate-300">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {applied && (
          <div className="flex justify-between text-green">
            <span>Promo ({applied.code})</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-slate-300">
          <span>Estimated Tax</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Estimated Shipping</span>
          <span>{formatCurrency(FLAT_SHIPPING)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="font-semibold text-white">Total</span>
        <span className="font-clash-display text-xl font-bold text-white">
          {formatCurrency(total)}
        </span>
      </div>

      <div className="mt-5">
        <label
          htmlFor="promo"
          className="text-xs font-medium tracking-wide text-slate-400 uppercase"
        >
          Promo Code
        </label>
        <div className="mt-1.5 flex gap-2">
          <input
            id="promo"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleApplyPromo}
            disabled={isApplying}
            className="shrink-0 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-60"
          >
            {isApplying ? "..." : "Apply"}
          </button>
        </div>
        {promoError && (
          <p className="mt-1.5 text-xs text-red-400">{promoError}</p>
        )}
        {applied && (
          <p className="mt-1.5 text-xs text-green">
            {applied.percentOff}% off applied.
          </p>
        )}
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
