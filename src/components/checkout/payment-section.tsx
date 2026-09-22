"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Check, CreditCard, Plus, Smartphone } from "lucide-react";
import { PaymentMethodForm } from "@/components/account/payment-method-form";
import { PaymentSchemeIcons } from "./payment-icons";
import { cn } from "@/lib/utils";
import type { PaymentMethodChoice } from "@/lib/payment-method";

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

const METHODS: {
  id: PaymentMethodChoice;
  label: string;
  description: string;
  icon: typeof CreditCard;
}[] = [
  {
    id: "card",
    label: "Card",
    description: "Pay with a debit or credit card",
    icon: CreditCard,
  },
  {
    id: "bank_transfer",
    label: "Bank Transfer",
    description: "Pay by transferring from your bank",
    icon: Building2,
  },
  {
    id: "opay",
    label: "OPay",
    description: "Pay with your OPay wallet",
    icon: Smartphone,
  },
];

export function PaymentSection({
  paymentMethods,
  selectedMethod,
  onSelectMethod,
  selectedCardId,
  onSelectCard,
}: {
  paymentMethods: PaymentMethod[];
  selectedMethod: PaymentMethodChoice;
  onSelectMethod: (method: PaymentMethodChoice) => void;
  selectedCardId: string | null;
  onSelectCard: (id: string) => void;
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(paymentMethods.length === 0);

  return (
    <div>
      <div role="radiogroup" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {METHODS.map(({ id, label, description, icon: Icon }) => {
          const isSelected = selectedMethod === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectMethod(id)}
              className={cn(
                "relative rounded-xl border p-4 text-left transition-colors",
                isSelected
                  ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500"
                  : "border-gray-200 hover:border-slate-300",
              )}
            >
              {isSelected && (
                <span className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-blue-500 text-white">
                  <Check className="size-3" />
                </span>
              )}
              <div className="flex items-center gap-2">
                <Icon
                  className={cn(
                    "size-4",
                    isSelected ? "text-blue-600" : "text-slate-400",
                  )}
                />
                <p
                  className={cn(
                    "text-sm font-semibold",
                    isSelected ? "text-blue" : "text-slate-500",
                  )}
                >
                  {label}
                </p>
              </div>
              <p className="mt-2 text-xs text-slate-400">{description}</p>
              {id === "card" && (
                <PaymentSchemeIcons className="mt-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Saved cards on file - reference only, not tied to a live vault */}
      {selectedMethod === "card" && paymentMethods.length > 0 && (
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

      {selectedMethod === "card" &&
        (showForm ? (
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
        ))}

      <p className="mt-4 text-xs text-slate-400">
        {selectedMethod === "opay"
          ? "You'll be redirected to OPay to complete this payment securely."
          : "Your payment is processed securely - Prime Dial Solutions never sees or stores your full card or account number."}
      </p>
    </div>
  );
}
