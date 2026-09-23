"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Check,
  ChevronDown,
  CreditCard,
  Plus,
  Smartphone,
  Trash2,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { deletePaymentMethod } from "@/lib/actions/payment-methods.action";
import { PaymentSchemeIcons } from "./payment-icons";
import { cn } from "@/lib/utils";
import type { PaymentMethodChoice } from "@/lib/payment-method";

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  cardholderName: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  paystackAuthorizationCode: string | null;
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
  selectedSavedCardId,
  onSelectSavedCard,
}: {
  paymentMethods: PaymentMethod[];
  selectedMethod: PaymentMethodChoice;
  onSelectMethod: (method: PaymentMethodChoice) => void;
  selectedSavedCardId: string | null;
  onSelectSavedCard: (id: string | null) => void;
}) {
  const router = useRouter();
  const [isCardPickerOpen, setIsCardPickerOpen] = useState(false);
  const [isDeleting, startDelete] = useTransition();

  // Only cards with a real Paystack authorization can actually be
  // charged - a pre-existing manually-entered row (from before this
  // feature existed) has no authorization_code and is display-only.
  const chargeableCards = paymentMethods.filter((m) => m.paystackAuthorizationCode);
  const activeCard = chargeableCards.find((m) => m.id === selectedSavedCardId) ?? null;

  const handleDelete = (id: string) => {
    startDelete(async () => {
      await deletePaymentMethod(id);
      router.refresh();
    });
  };

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
              {id === "card" && <PaymentSchemeIcons className="mt-2" />}
            </button>
          );
        })}
      </div>

      {selectedMethod === "card" && chargeableCards.length > 0 && (
        <button
          type="button"
          onClick={() => setIsCardPickerOpen(true)}
          className="mt-4 flex w-full items-center justify-between gap-3 rounded-xl border border-gray-200 p-4 text-left transition-colors hover:border-slate-300"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-gray-100">
              {activeCard ? (
                <CreditCard className="size-5 text-slate-500" />
              ) : (
                <Plus className="size-5 text-slate-500" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-blue">
                {activeCard
                  ? `${activeCard.brand} •••• ${activeCard.last4}`
                  : "Use a new card"}
              </p>
              <p className="text-xs text-slate-400">
                {activeCard
                  ? `Charged directly - expires ${String(activeCard.expiryMonth).padStart(2, "0")}/${activeCard.expiryYear}`
                  : "Enter card details securely via the payment popup"}
              </p>
            </div>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-blue-600">
            Change
            <ChevronDown className="size-3.5" />
          </span>
        </button>
      )}

      <Modal
        open={isCardPickerOpen}
        onClose={() => setIsCardPickerOpen(false)}
        title="Choose a Card"
        description="Pick which card gets charged, or add a new one at payment."
      >
        <div role="radiogroup" className="space-y-2">
          {chargeableCards.map((method) => {
            const isSelected = selectedSavedCardId === method.id;
            return (
              <div
                key={method.id}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => {
                  onSelectSavedCard(method.id);
                  setIsCardPickerOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onSelectSavedCard(method.id);
                    setIsCardPickerOpen(false);
                  }
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 text-left transition-colors",
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
                <div className="flex shrink-0 items-center gap-3">
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(method.id);
                    }}
                    aria-label="Remove card"
                    className="text-slate-400 hover:text-red-500 disabled:opacity-50"
                  >
                    <Trash2 className="size-4" />
                  </button>
                  {isSelected && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-blue-500 text-white">
                      <Check className="size-3" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          <div
            role="radio"
            aria-checked={selectedSavedCardId === null}
            tabIndex={0}
            onClick={() => {
              onSelectSavedCard(null);
              setIsCardPickerOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onSelectSavedCard(null);
                setIsCardPickerOpen(false);
              }
            }}
            className={cn(
              "flex w-full cursor-pointer items-center gap-3 rounded-xl border p-4 text-left transition-colors",
              selectedSavedCardId === null
                ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500"
                : "border-dashed border-gray-200 hover:border-slate-300",
            )}
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-gray-100">
              <Plus className="size-5 text-slate-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue">Use a new card</p>
              <p className="text-xs text-slate-400">
                Enter card details securely via the payment popup
              </p>
            </div>
            {selectedSavedCardId === null && (
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                <Check className="size-3" />
              </span>
            )}
          </div>
        </div>
      </Modal>

      <p className="mt-4 text-xs text-slate-400">
        {selectedMethod === "opay"
          ? "You'll be redirected to OPay to complete this payment securely."
          : selectedMethod === "card" && activeCard
            ? "This card is charged directly - no need to re-enter its details."
            : "Your payment is processed securely - Prime Dial Solutions never sees or stores your full card or account number."}
      </p>
    </div>
  );
}
