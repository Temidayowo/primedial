"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { createPaymentMethod } from "@/lib/actions/payment-methods.action";

const inputClasses =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-blue placeholder:text-slate-400 focus:border-blue-500 focus:outline-none";
const labelClasses = "text-xs font-medium tracking-wide text-slate-500 uppercase";

// Best-effort BIN-range brand detection for display purposes only (the
// chip shown next to the input, and the `brand` value saved below) - it's
// never used for anything security-sensitive, so an unrecognized or
// slightly-off range just falls back to a generic "Card" label.
function detectCardBrand(digits: string): string {
  if (/^4/.test(digits)) return "Visa";
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]\d|720))/.test(digits)) return "Mastercard";
  if (/^(506099|5061\d{2}|5079[0-6]\d|6500(0[2-9]|[12]\d))/.test(digits)) return "Verve";
  return "Card";
}

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length <= 2 ? digits : `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function PaymentMethodForm({ onDone }: { onDone?: () => void }) {
  const [state, formAction, isPending] = useActionState(
    createPaymentMethod,
    undefined,
  );
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");

  useEffect(() => {
    if (state?.message && !state.errors) {
      onDone?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const digits = cardNumber.replace(/\D/g, "");
  const brand = useMemo(
    () => (digits.length >= 6 ? detectCardBrand(digits) : ""),
    [digits],
  );
  const last4 = digits.slice(-4);
  const [expiryMonth, expiryYearShort] = expiry.split("/");
  const expiryYear = expiryYearShort ? `20${expiryYearShort}` : "";

  const canSubmit =
    digits.length >= 12 && last4.length === 4 && Boolean(expiryMonth) && Boolean(expiryYear);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className={labelClasses}>Cardholder Name</label>
        <input
          name="cardholderName"
          autoComplete="cc-name"
          placeholder="As it appears on the card"
          required
          className={`mt-1.5 ${inputClasses}`}
        />
        {state?.errors?.cardholderName && (
          <p className="mt-1 text-xs text-red-500">
            {state.errors.cardholderName[0]}
          </p>
        )}
      </div>

      <div>
        <label className={labelClasses}>Card Number</label>
        <div className="relative mt-1.5">
          <input
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="4084 0840 8408 4081"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            required
            className={`${inputClasses} pr-20`}
          />
          {brand && (
            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-semibold text-slate-400">
              {brand}
            </span>
          )}
        </div>
        {state?.errors?.last4 && (
          <p className="mt-1 text-xs text-red-500">{state.errors.last4[0]}</p>
        )}
        {state?.errors?.brand && (
          <p className="mt-1 text-xs text-red-500">{state.errors.brand[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Expiry (MM/YY)</label>
          <input
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="09/27"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            required
            className={`mt-1.5 ${inputClasses}`}
          />
          {(state?.errors?.expiryMonth || state?.errors?.expiryYear) && (
            <p className="mt-1 text-xs text-red-500">Enter a valid expiry date.</p>
          )}
        </div>
      </div>

      {/* Only these derived, display-safe fields are actually submitted -
          the full card number typed above never leaves the browser. */}
      <input type="hidden" name="brand" value={brand} />
      <input type="hidden" name="last4" value={last4} />
      <input type="hidden" name="expiryMonth" value={expiryMonth ?? ""} />
      <input type="hidden" name="expiryYear" value={expiryYear} />

      <button
        type="submit"
        disabled={isPending || !canSubmit}
        className="w-full rounded-lg bg-blue-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save Payment Method"}
      </button>

      <p className="text-[11px] text-slate-400">
        We only save your cardholder name, card brand, last 4 digits, and
        expiry for your reference - never the full card number, and never
        a CVV.
      </p>
    </form>
  );
}
