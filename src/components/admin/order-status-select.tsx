"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/lib/actions/admin/orders.action";
import { OrderStatus } from "@/generated/prisma/enums";

const options: { value: OrderStatus; label: string }[] = [
  { value: OrderStatus.PROCESSING, label: "Processing" },
  { value: OrderStatus.SHIPPED, label: "Shipped" },
  { value: OrderStatus.DELIVERED, label: "Delivered" },
  { value: OrderStatus.CANCELLED, label: "Cancelled" },
];

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [value, setValue] = useState(status);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(false);
    startTransition(async () => {
      await updateOrderStatus(orderId, value);
      setSaved(true);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        onChange={(e) => {
          setValue(e.target.value as OrderStatus);
          setSaved(false);
        }}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-blue focus:border-blue-500 focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleSave}
        disabled={isPending || value === status}
        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Update Status"}
      </button>
      {saved && <span className="text-xs text-green">Saved.</span>}
    </div>
  );
}
