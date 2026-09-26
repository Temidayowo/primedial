"use client";

import Link from "next/link";
import { TAX_RATE, FLAT_SHIPPING } from "@/lib/cart-constants";
import { formatCurrency } from "@/lib/utils";

export function OrderSummary({
  subtotal,
  hasUnavailableItems = false,
}: {
  subtotal: number;
  hasUnavailableItems?: boolean;
}) {
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + FLAT_SHIPPING;

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

      {hasUnavailableItems ? (
        <>
          <span
            aria-disabled="true"
            className="mt-6 block w-full cursor-not-allowed rounded-lg bg-slate-200 py-3 text-center text-sm font-semibold text-slate-500"
          >
            Proceed to Checkout
          </span>
          <p className="mt-2 text-center text-[11px] text-red-600">
            Remove the items marked unavailable to continue.
          </p>
        </>
      ) : (
        <Link
          href="/checkout"
          className="mt-6 block w-full rounded-lg bg-green py-3 text-center text-sm font-semibold text-white transition-colors duration-300 hover:bg-blue"
        >
          Proceed to Checkout
        </Link>
      )}
      <p className="mt-2 text-center text-[11px] text-slate-500">
        Choose your shipping address, delivery method, and payment on the
        next step.
      </p>
    </div>
  );
}
