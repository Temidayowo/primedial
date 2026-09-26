"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus } from "lucide-react";
import { AddressForm } from "@/components/account/address-form";
import { cn } from "@/lib/utils";

interface Address {
  id: string;
  label: string | null;
  fullName: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export function AddressSection({
  addresses,
  selectedId,
  onSelect,
}: {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(addresses.length === 0);

  return (
    <div>
      {addresses.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {addresses.map((address) => {
            const isSelected = address.id === selectedId;
            return (
              <button
                key={address.id}
                type="button"
                onClick={() => onSelect(address.id)}
                className={cn(
                  "relative rounded-xl border p-4 text-left transition-colors duration-300",
                  isSelected
                    ? "border-blue bg-blue/5 ring-1 ring-blue"
                    : "border-gray-200 hover:border-slate-300",
                )}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-blue text-white">
                    <Check className="size-3" />
                  </span>
                )}
                <div className="flex items-center gap-2 pr-6">
                  <p className="text-sm font-semibold text-blue">
                    {address.label || "Address"}
                  </p>
                  {address.isDefault && (
                    <span className="rounded-full bg-blue/10 px-2 py-0.5 text-[10px] font-medium text-blue">
                      Default
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {address.fullName}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}, {address.city}
                  {address.state ? `, ${address.state}` : ""}{" "}
                  {address.postalCode}, {address.country}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {showForm ? (
        <div
          className={cn(
            "rounded-xl border border-dashed border-slate-200 p-5",
            addresses.length > 0 && "mt-4",
          )}
        >
          <h3 className="mb-4 text-sm font-semibold text-blue">
            Add New Address
          </h3>
          <AddressForm
            onDone={() => {
              setShowForm(false);
              router.refresh();
            }}
          />
          {addresses.length > 0 && (
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
          className="mt-4 flex items-center gap-2 text-sm font-medium text-blue hover:text-blue/70"
        >
          <Plus className="size-4" />
          Add new address
        </button>
      )}
    </div>
  );
}
