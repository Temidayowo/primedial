"use client";

import { useActionState, useEffect } from "react";
import { createAddress } from "@/lib/actions/addresses.action";

const inputClasses =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-blue placeholder:text-slate-400 focus:border-blue-500 focus:outline-none";
const labelClasses = "text-xs font-medium tracking-wide text-slate-500 uppercase";

export function AddressForm({ onDone }: { onDone?: () => void }) {
  const [state, formAction, isPending] = useActionState(
    createAddress,
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
        <label className={labelClasses}>Label (optional)</label>
        <input
          name="label"
          placeholder="Home, Office..."
          className={`mt-1.5 ${inputClasses}`}
        />
      </div>

      <div>
        <label className={labelClasses}>Full Name</label>
        <input name="fullName" required className={`mt-1.5 ${inputClasses}`} />
        {state?.errors?.fullName && (
          <p className="mt-1 text-xs text-red-500">{state.errors.fullName[0]}</p>
        )}
      </div>

      <div>
        <label className={labelClasses}>Address Line 1</label>
        <input name="line1" required className={`mt-1.5 ${inputClasses}`} />
        {state?.errors?.line1 && (
          <p className="mt-1 text-xs text-red-500">{state.errors.line1[0]}</p>
        )}
      </div>

      <div>
        <label className={labelClasses}>Address Line 2 (optional)</label>
        <input name="line2" className={`mt-1.5 ${inputClasses}`} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>City</label>
          <input name="city" required className={`mt-1.5 ${inputClasses}`} />
          {state?.errors?.city && (
            <p className="mt-1 text-xs text-red-500">{state.errors.city[0]}</p>
          )}
        </div>
        <div>
          <label className={labelClasses}>State / Region</label>
          <input name="state" className={`mt-1.5 ${inputClasses}`} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Postal Code</label>
          <input
            name="postalCode"
            required
            className={`mt-1.5 ${inputClasses}`}
          />
          {state?.errors?.postalCode && (
            <p className="mt-1 text-xs text-red-500">
              {state.errors.postalCode[0]}
            </p>
          )}
        </div>
        <div>
          <label className={labelClasses}>Country</label>
          <input name="country" required className={`mt-1.5 ${inputClasses}`} />
          {state?.errors?.country && (
            <p className="mt-1 text-xs text-red-500">
              {state.errors.country[0]}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className={labelClasses}>Phone (optional)</label>
        <input name="phone" className={`mt-1.5 ${inputClasses}`} />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-blue-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save Address"}
      </button>
    </form>
  );
}
