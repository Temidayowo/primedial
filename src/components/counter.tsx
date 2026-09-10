"use client";

import { Minus, Plus } from "lucide-react";

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
}) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(value + 1);

  return (
    <div className="flex items-center justify-between w-36 px-4 py-3 border-[0.1px] border-gray-400 rounded-2xl">
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
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
        className="text-slate-600 hover:text-blue transition-colors focus:outline-none"
      >
        <Plus size={20} strokeWidth={2} />
      </button>
    </div>
  );
}
