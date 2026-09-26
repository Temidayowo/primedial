"use client";

import { useTransition } from "react";
import { CreditCard, Trash2 } from "lucide-react";
import { deletePaymentMethod } from "@/lib/actions/payment-methods.action";

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  cardholderName: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

// No "add card" form here - a real, chargeable card can only come from a
// successful Paystack payment (that's where its authorization_code comes
// from, see saveOrUpdatePaystackAuthorization in
// src/lib/payments/paystack.ts), never from typing numbers into a form.
export function ManagePaymentMethods({
  paymentMethods,
  onChange,
}: {
  paymentMethods: PaymentMethod[];
  // Optional - the account page relies on revalidatePath("/account/...")
  // inside deletePaymentMethod and doesn't need this, but a caller
  // rendering this somewhere else (e.g. inside a checkout modal) has no
  // path to revalidate and needs its own way to know when to refetch.
  onChange?: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  if (paymentMethods.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No cards saved yet - cards are saved automatically the first time
        you pay with them.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {paymentMethods.map((method) => (
        <div
          key={method.id}
          className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-gray-100">
              <CreditCard className="size-5 text-slate-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-blue">
                  {method.brand} &bull;&bull;&bull;&bull; {method.last4}
                </p>
                {method.isDefault && (
                  <span className="rounded-full bg-blue/10 px-2 py-0.5 text-[10px] font-medium text-blue">
                    Default
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">{method.cardholderName}</p>
              <p className="text-xs text-slate-400">
                Expires {String(method.expiryMonth).padStart(2, "0")}/
                {method.expiryYear}
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await deletePaymentMethod(method.id);
                onChange?.();
              })
            }
            aria-label="Remove payment method"
            className="text-slate-400 hover:text-red-500 disabled:opacity-50"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
