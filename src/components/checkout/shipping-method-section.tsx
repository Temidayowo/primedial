"use client";

import { Truck } from "lucide-react";
import { SHIPPING_METHODS, type ShippingMethodId } from "@/lib/cart-constants";
import { cn, formatCurrency } from "@/lib/utils";

export function ShippingMethodSection({
  selectedId,
  onSelect,
}: {
  selectedId: ShippingMethodId;
  onSelect: (id: ShippingMethodId) => void;
}) {
  return (
    <div className="space-y-3">
      {SHIPPING_METHODS.map((method) => {
        const isSelected = method.id === selectedId;
        return (
          <label
            key={method.id}
            className={cn(
              "flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 transition-colors duration-300",
              isSelected
                ? "border-blue bg-blue/5 ring-1 ring-blue"
                : "border-gray-200 hover:border-slate-300",
            )}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="shipping-method"
                checked={isSelected}
                onChange={() => onSelect(method.id)}
                className="size-4 accent-blue"
              />
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <Truck className="size-4 text-slate-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue">{method.name}</p>
                <p className="text-xs text-slate-400">{method.description}</p>
              </div>
            </div>
            <p className="shrink-0 text-sm font-semibold text-blue">
              {formatCurrency(method.cost)}
            </p>
          </label>
        );
      })}
    </div>
  );
}
