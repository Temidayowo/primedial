"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CreditCard, Plus, ShieldCheck } from "lucide-react";
import { PaymentMethodForm } from "@/components/account/payment-method-form";
import { PaymentSchemeIcons, PaystackWordmark } from "./payment-icons";
import { cn } from "@/lib/utils";

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export function PaymentSection({
  paymentMethods,
  selectedCardId,
  onSelectCard,
}: {
  paymentMethods: PaymentMethod[];
  selectedCardId: string | null;
  onSelectCard: (id: string) => void;
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(paymentMethods.length === 0);

  return (
    <div>
      {/* Gateway selection */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="relative rounded-xl border border-blue-500 bg-blue-50/50 p-4 ring-1 ring-blue-500">
          <span className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-blue-500 text-white">
            <Check className="size-3" />
          </span>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-blue-600" />
            <p className="text-sm font-semibold text-blue">
              Card / Bank Transfer
            </p>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <PaystackWordmark />
            <PaymentSchemeIcons />
          </div>
        </div>

        <div
          className="relative cursor-not-allowed rounded-xl border border-gray-200 p-4 opacity-60"
          aria-disabled="true"
        >
          <span className="absolute top-3 right-3 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
            Coming soon
          </span>
          <div className="flex items-center gap-2">
            <div className="flex size-4 items-center justify-center rounded-full bg-slate-300" />
            <p className="text-sm font-semibold text-slate-400">OPay</p>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Wallet &amp; transfer checkout
          </p>
        </div>
      </div>

      {/* Saved cards on file (Paystack is the processor - see note below) */}
      {paymentMethods.length > 0 && (
        <div className="mt-5 space-y-3">
          {paymentMethods.map((method) => {
            const isSelected = method.id === selectedCardId;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => onSelectCard(method.id)}
                className={cn(
                  "flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition-colors",
                  isSelected
                    ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500"
                    : "border-gray-200 hover:border-slate-300",
                )}
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
                {isSelected && (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                    <Check className="size-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {showForm ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-200 p-5">
          <h3 className="mb-4 text-sm font-semibold text-blue">
            Add New Card
          </h3>
          <PaymentMethodForm
            onDone={() => {
              setShowForm(false);
              router.refresh();
            }}
          />
          {paymentMethods.length > 0 && (
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="mt-3 text-xs font-medium text-slate-500 hover:text-blue"
            >
              Cancel
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          <Plus className="size-4" />
          Add new card
        </button>
      )}

      <p className="mt-4 text-xs text-slate-400">
        Your card is charged securely by Paystack at checkout - Prime Dial
        Solutions never sees or stores your full card number. Cards saved
        above are kept for your reference only.
      </p>
    </div>
  );
}
