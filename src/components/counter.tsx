"use client";

import { Minus, Plus } from "lucide-react";
import { MAX_CART_QUANTITY } from "@/lib/product-availability";

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = MAX_CART_QUANTITY,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  return (
    <div className="flex items-center justify-between w-36 px-4 py-3 border-[0.1px] border-gray-400 rounded-2xl">
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="text-slate-600 hover:text-blue disabled:opacity-50 disabled:hover:text-slate-400 transition-colors focus:outline-none"
      >
        <Minus size={20} strokeWidth={2} />
      </button>

      <span className="text-blue font-semibold text-lg select-none">
        {value}
      </span>

      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="text-slate-600 hover:text-blue disabled:opacity-50 disabled:hover:text-slate-400 transition-colors focus:outline-none"
      >
        <Plus size={20} strokeWidth={2} />
      </button>
    </div>
  );
}
