"use client";

import { useActionState, useEffect } from "react";
import { createPaymentMethod } from "@/lib/actions/payment-methods.action";

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none";
const labelClasses = "text-xs font-medium tracking-wide text-slate-400 uppercase";

export function PaymentMethodForm({ onDone }: { onDone?: () => void }) {
  const [state, formAction, isPending] = useActionState(
    createPaymentMethod,
    undefined,
  );

  useEffect(() => {
    if (state?.message && !state.errors) {
      onDone?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className={labelClasses}>Card Brand</label>
        <input
          name="brand"
          placeholder="Visa, Mastercard..."
          required
          className={`mt-1.5 ${inputClasses}`}
        />
        {state?.errors?.brand && (
          <p className="mt-1 text-xs text-red-400">{state.errors.brand[0]}</p>
        )}
      </div>

      <div>
        <label className={labelClasses}>Last 4 Digits</label>
        <input
          name="last4"
          maxLength={4}
          placeholder="4242"
          required
          className={`mt-1.5 ${inputClasses}`}
        />
        {state?.errors?.last4 && (
          <p className="mt-1 text-xs text-red-400">{state.errors.last4[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Expiry Month</label>
          <input
            name="expiryMonth"
            type="number"
            min={1}
            max={12}
            placeholder="MM"
            required
            className={`mt-1.5 ${inputClasses}`}
          />
        </div>
        <div>
          <label className={labelClasses}>Expiry Year</label>
          <input
            name="expiryYear"
            type="number"
            min={new Date().getFullYear()}
            placeholder="YYYY"
            required
            className={`mt-1.5 ${inputClasses}`}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-blue-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save Payment Method"}
      </button>
    </form>
  );
}
