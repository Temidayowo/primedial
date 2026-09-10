"use client";

import { useState, useTransition } from "react";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { PaymentMethodForm } from "@/components/account/payment-method-form";
import { deletePaymentMethod } from "@/lib/actions/payment-methods.action";

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export function ManagePaymentMethods({
  paymentMethods,
}: {
  paymentMethods: PaymentMethod[];
}) {
  const [showForm, setShowForm] = useState(paymentMethods.length === 0);
  const [isPending, startTransition] = useTransition();

  return (
    <div>
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
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                      Default
                    </span>
                  )}
                </div>
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
                startTransition(() => deletePaymentMethod(method.id))
              }
              aria-label="Remove payment method"
              className="text-slate-400 hover:text-red-500 disabled:opacity-50"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>

      {showForm ? (
        <div className="mt-6 rounded-xl border border-gray-100 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-blue">
            Add Payment Method
          </h2>
          <PaymentMethodForm onDone={() => setShowForm(false)} />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          <Plus className="size-4" />
          Add Payment Method
        </button>
      )}
    </div>
  );
}
