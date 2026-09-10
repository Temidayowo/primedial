"use client";

import { useState, useTransition } from "react";
import { Plus, Star, Trash2 } from "lucide-react";
import { AddressForm } from "@/components/account/address-form";
import {
  deleteAddress,
  setDefaultAddress,
} from "@/lib/actions/addresses.action";

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

export function ManageAddresses({ addresses }: { addresses: Address[] }) {
  const [showForm, setShowForm] = useState(addresses.length === 0);
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <div className="space-y-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-blue">
                  {address.label || "Address"}
                </p>
                {address.isDefault && (
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                    Default
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {address.fullName} &middot; {address.line1}
                {address.line2 ? `, ${address.line2}` : ""}, {address.city}
                {address.state ? `, ${address.state}` : ""}{" "}
                {address.postalCode}, {address.country}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {!address.isDefault && (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    startTransition(() => setDefaultAddress(address.id))
                  }
                  aria-label="Set as default"
                  className="text-slate-400 hover:text-blue-600 disabled:opacity-50"
                >
                  <Star className="size-4" />
                </button>
              )}
              <button
                type="button"
                disabled={isPending}
                onClick={() => startTransition(() => deleteAddress(address.id))}
                aria-label="Delete address"
                className="text-slate-400 hover:text-red-500 disabled:opacity-50"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm ? (
        <div className="mt-6 rounded-xl border border-gray-100 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-blue">
            Add New Address
          </h2>
          <AddressForm onDone={() => setShowForm(false)} />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          <Plus className="size-4" />
          Add New Address
        </button>
      )}
    </div>
  );
}
