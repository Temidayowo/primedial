"use client";

import { startTransition, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { lookupOrderTracking } from "@/lib/actions/track-order.action";
import { OrderTracking } from "@/components/orders/order-tracking";
import { StatusBadge } from "@/components/account/status-badge";

const inputClasses =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-blue placeholder:text-slate-400 focus:border-blue focus:outline-none";
const labelClasses = "text-xs font-medium tracking-wide text-blue uppercase";

// Order confirmation emails and account pages can link here with the
// order number filled in: /track-order?order=PDS-2026-1A2B3C
export function TrackOrderFromUrl() {
  const order = useSearchParams().get("order")?.slice(0, 40) ?? "";
  return <TrackOrderForm defaultOrderNumber={order} />;
}

export function TrackOrderForm({ defaultOrderNumber = "" }: { defaultOrderNumber?: string }) {
  const [state, formAction, isPending] = useActionState(lookupOrderTracking, undefined);

  // Submitted through a transition so the fields keep their values.
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={onSubmit}
        className="grid gap-4 rounded-xl border-[0.1px] border-gray-300 bg-gray-100 p-5 md:grid-cols-[1fr_1fr_auto] md:items-end md:p-6"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="track-order-number" className={labelClasses}>
            Order number
          </label>
          <input
            key={defaultOrderNumber}
            id="track-order-number"
            name="orderNumber"
            required
            defaultValue={defaultOrderNumber}
            placeholder="PDS-2026-1A2B3C"
            autoCapitalize="characters"
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="track-email" className={labelClasses}>
            Email used for the order
          </label>
          <input
            id="track-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className={inputClasses}
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-2 rounded-lg bg-green px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-blue disabled:opacity-60"
        >
          <Search className="size-4" />
          {isPending ? "Looking up..." : "Track"}
        </button>
        {state && !state.ok && (
          <p role="alert" className="text-sm text-red-600 md:col-span-3">
            {state.error}
          </p>
        )}
      </form>

      {state?.ok && (
        <section aria-live="polite" className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-clash-display text-xl font-bold text-blue">
                {state.view.orderNumber}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {state.view.items
                  .map((item) => `${item.name}${item.quantity > 1 ? ` x${item.quantity}` : ""}`)
                  .join(", ")}
              </p>
            </div>
            <StatusBadge status={state.view.status} />
          </div>
          {state.view.paymentStatus !== "PAID" && state.view.status !== "CANCELLED" && (
            <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
              This order hasn&apos;t been paid for yet. Sign in to your account to complete payment.
            </p>
          )}
          <OrderTracking view={state.view} />
        </section>
      )}
    </div>
  );
}
