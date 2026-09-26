"use client";

import { startTransition, useActionState, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addTrackingUpdate,
  updateFulfilment,
  type FulfilmentFormState,
} from "@/lib/actions/admin/orders.action";
import type { OrderStatus } from "@/generated/prisma/enums";
import { COURIER_SUGGESTIONS } from "@/lib/orders/tracking";
import { cn } from "@/lib/utils";

const inputClasses =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-blue placeholder:text-slate-400 focus:border-blue focus:outline-none disabled:bg-gray-50";
const labelClasses = "text-xs font-medium tracking-wide text-slate-500 uppercase";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

type Action = (prev: FulfilmentFormState, formData: FormData) => Promise<FulfilmentFormState>;

// Submits through a transition so fields keep their values when the
// server rejects the update, and refreshes the page data on success.
function useAdminForm(action: Action, onSuccess?: () => void) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(async (prev: FulfilmentFormState, fd: FormData) => {
    const result = await action(prev, fd);
    if (result?.ok) {
      onSuccess?.();
      router.refresh();
    }
    return result;
  }, undefined);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

  const errors = state && !state.ok ? state.errors : undefined;
  return { state, errors, isPending, onSubmit };
}

function FieldError({ messages }: { messages?: string[] }) {
  return messages?.[0] ? <p className="mt-1 text-xs text-red-500">{messages[0]}</p> : null;
}

function Status({ state }: { state: FulfilmentFormState }) {
  if (!state?.message) return null;
  return (
    <p role="status" className={cn("text-xs", state.ok ? "text-green" : "text-red-600")}>
      {state.message}
    </p>
  );
}

export function FulfilmentPanel({
  orderId,
  status,
  isPaid,
  courierName,
  trackingNumber,
  trackingUrl,
}: {
  orderId: string;
  status: OrderStatus;
  isPaid: boolean;
  courierName: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
}) {
  const [selected, setSelected] = useState<OrderStatus>(status);
  const updateForm = useRef<HTMLFormElement>(null);
  const noteForm = useRef<HTMLFormElement>(null);
  const update = useAdminForm(updateFulfilment, () => {
    const message = updateForm.current?.elements.namedItem("message");
    if (message instanceof HTMLTextAreaElement) message.value = "";
  });
  const note = useAdminForm(addTrackingUpdate, () => noteForm.current?.reset());

  const locked = status === "CANCELLED";
  const showCourier = selected === "SHIPPED" || selected === "DELIVERED";

  return (
    <div className="space-y-5">
      <form ref={updateForm} onSubmit={update.onSubmit} className="space-y-4 rounded-xl border border-gray-100 bg-white p-5">
        <input type="hidden" name="orderId" value={orderId} />
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-blue">Fulfilment</h2>
          {!isPaid && !locked && (
            <span className="text-xs text-amber-600">Unpaid - can&apos;t be shipped yet</span>
          )}
        </div>

        <div>
          <label htmlFor="fulfilment-status" className={labelClasses}>
            Status
          </label>
          <select
            id="fulfilment-status"
            name="status"
            value={selected}
            disabled={locked}
            onChange={(e) => setSelected(e.target.value as OrderStatus)}
            className={`mt-1.5 sm:max-w-60 ${inputClasses}`}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {locked && (
            <p className="mt-1 text-xs text-slate-400">Cancelled orders can&apos;t be changed.</p>
          )}
        </div>

        {showCourier && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="courierName" className={labelClasses}>
                Courier
              </label>
              <input
                id="courierName"
                name="courierName"
                list="courier-suggestions"
                defaultValue={courierName ?? ""}
                placeholder="e.g. GIG Logistics"
                className={`mt-1.5 ${inputClasses}`}
              />
              <datalist id="courier-suggestions">
                {COURIER_SUGGESTIONS.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
              <FieldError messages={update.errors?.courierName} />
            </div>
            <div>
              <label htmlFor="trackingNumber" className={labelClasses}>
                Tracking number (optional)
              </label>
              <input
                id="trackingNumber"
                name="trackingNumber"
                defaultValue={trackingNumber ?? ""}
                className={`mt-1.5 ${inputClasses}`}
              />
              <FieldError messages={update.errors?.trackingNumber} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="trackingUrl" className={labelClasses}>
                Courier tracking link (optional)
              </label>
              <input
                id="trackingUrl"
                name="trackingUrl"
                type="url"
                defaultValue={trackingUrl ?? ""}
                placeholder="https://..."
                className={`mt-1.5 ${inputClasses}`}
              />
              <FieldError messages={update.errors?.trackingUrl} />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="fulfilment-message" className={labelClasses}>
            Message to the customer (optional)
          </label>
          <textarea
            id="fulfilment-message"
            name="message"
            rows={2}
            disabled={locked}
            placeholder={
              selected === "CANCELLED" ? "e.g. Item is out of stock - you'll be refunded in full." : ""
            }
            className={`mt-1.5 ${inputClasses}`}
          />
          <FieldError messages={update.errors?.message} />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-blue">
            <input type="checkbox" name="notify" defaultChecked disabled={locked} className="size-4" />
            Email the customer
          </label>
          <button
            type="submit"
            disabled={update.isPending || locked}
            className="rounded-lg bg-blue px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-blue/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {update.isPending ? "Saving..." : "Save"}
          </button>
          <Status state={update.state} />
        </div>
      </form>

      {!locked && (
        <form ref={noteForm} onSubmit={note.onSubmit} className="space-y-4 rounded-xl border border-gray-100 bg-white p-5">
          <input type="hidden" name="orderId" value={orderId} />
          <div>
            <h2 className="text-sm font-semibold text-blue">Add a tracking update</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Shows on the customer&apos;s order timeline without changing the status.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="update-type" className={labelClasses}>
                Update
              </label>
              <select id="update-type" name="type" defaultValue="IN_TRANSIT" className={`mt-1.5 ${inputClasses}`}>
                <option value="IN_TRANSIT">In transit</option>
                <option value="OUT_FOR_DELIVERY">Out for delivery</option>
                <option value="NOTE">Other update</option>
              </select>
            </div>
            <div>
              <label htmlFor="update-location" className={labelClasses}>
                Location (optional)
              </label>
              <input
                id="update-location"
                name="location"
                placeholder="e.g. Ibadan hub"
                className={`mt-1.5 ${inputClasses}`}
              />
              <FieldError messages={note.errors?.location} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="update-message" className={labelClasses}>
                Details (required for &quot;Other update&quot;)
              </label>
              <textarea id="update-message" name="message" rows={2} className={`mt-1.5 ${inputClasses}`} />
              <FieldError messages={note.errors?.message} />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-blue">
              <input type="checkbox" name="notify" className="size-4" />
              Email the customer
            </label>
            <button
              type="submit"
              disabled={note.isPending}
              className="rounded-lg border border-blue px-4 py-2 text-sm font-medium text-blue transition-colors duration-300 hover:bg-blue/5 disabled:opacity-50"
            >
              {note.isPending ? "Adding..." : "Add update"}
            </button>
            <Status state={note.state} />
          </div>
        </form>
      )}
    </div>
  );
}
