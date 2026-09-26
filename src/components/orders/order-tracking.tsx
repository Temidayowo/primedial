import type { ReactNode } from "react";
import {
  Check,
  CircleDot,
  CreditCard,
  ExternalLink,
  MapPin,
  Package,
  PackageCheck,
  Truck,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type TrackingEventView,
  type TrackingView,
  formatTrackingDate,
} from "@/lib/orders/tracking";

// Order progress, delivery details and the update timeline. Plain markup
// with no hooks, so it renders from server pages (account, admin) and
// from the client-side public /track-order lookup alike.
export function OrderTracking({
  view,
  eventAction,
}: {
  view: TrackingView;
  // Admin only: e.g. a delete button next to each update it added.
  eventAction?: (event: TrackingEventView) => ReactNode;
}) {
  const cancelled = view.status === "CANCELLED";

  return (
    <div className="space-y-5">
      {cancelled ? (
        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          <XCircle className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="font-semibold">This order was cancelled</p>
            {view.cancelledAt && (
              <p className="mt-0.5 text-xs">on {formatTrackingDate(view.cancelledAt)}</p>
            )}
          </div>
        </div>
      ) : (
        <ProgressSteps view={view} />
      )}

      {!cancelled && <DeliveryDetails view={view} />}

      <Timeline events={view.events} eventAction={eventAction} />
    </div>
  );
}

function ProgressSteps({ view }: { view: TrackingView }) {
  const paid = view.paymentStatus === "PAID";
  const shipped = view.status === "SHIPPED" || view.status === "DELIVERED";
  const delivered = view.status === "DELIVERED";

  const steps = [
    { label: "Order placed", icon: Package, done: true, date: view.placedAt },
    { label: "Payment confirmed", icon: CreditCard, done: paid, date: view.paidAt },
    { label: "Shipped", icon: Truck, done: shipped, date: view.shippedAt },
    { label: "Delivered", icon: PackageCheck, done: delivered, date: view.deliveredAt },
  ];
  const currentIndex = steps.findIndex((step) => !step.done);

  return (
    <ol className="grid gap-4 rounded-xl border border-gray-100 bg-white p-5 sm:grid-cols-4 sm:gap-2">
      {steps.map((step, index) => {
        const isCurrent = index === currentIndex;
        const Icon = step.done ? Check : step.icon;
        return (
          <li key={step.label} className="relative flex items-center gap-3 sm:flex-col sm:text-center">
            {index > 0 && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-5 right-1/2 hidden h-0.5 w-full sm:block",
                  step.done ? "bg-green" : "bg-gray-200",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2",
                step.done
                  ? "border-green bg-green text-white"
                  : isCurrent
                    ? "border-blue-500 bg-white text-blue-500"
                    : "border-gray-200 bg-white text-slate-300",
              )}
            >
              <Icon className="size-4" strokeWidth={step.done ? 3 : 2} />
            </span>
            <div>
              <p
                className={cn(
                  "text-sm font-medium",
                  step.done ? "text-blue" : isCurrent ? "text-blue-600" : "text-slate-400",
                )}
              >
                {step.label}
              </p>
              <p className="text-xs text-slate-400">
                {step.done && step.date
                  ? formatTrackingDate(step.date)
                  : isCurrent
                    ? "In progress"
                    : ""}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function DeliveryDetails({ view }: { view: TrackingView }) {
  const rows: { label: string; value: ReactNode }[] = [];

  if (view.courierName) rows.push({ label: "Courier", value: view.courierName });
  if (view.trackingNumber) {
    rows.push({
      label: "Tracking number",
      value: <span className="font-mono tracking-wide">{view.trackingNumber}</span>,
    });
  }
  if (view.shippingMethodName) rows.push({ label: "Shipping", value: view.shippingMethodName });
  if (view.estimatedDelivery) {
    const { from, to } = view.estimatedDelivery;
    rows.push({
      label: "Estimated delivery",
      value:
        formatTrackingDate(from) === formatTrackingDate(to)
          ? formatTrackingDate(from)
          : `${formatTrackingDate(from)} - ${formatTrackingDate(to)}`,
    });
  }
  if (view.deliveredAt) rows.push({ label: "Delivered on", value: formatTrackingDate(view.deliveredAt) });
  if (view.destination) rows.push({ label: "Delivering to", value: view.destination });

  if (rows.length === 0 && !view.trackingUrl) return null;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <h3 className="text-sm font-semibold text-blue">Delivery details</h3>
      <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[10rem_1fr]">
        {rows.map((row) => (
          <div key={row.label} className="contents">
            <dt className="text-slate-400">{row.label}</dt>
            <dd className="text-blue">{row.value}</dd>
          </div>
        ))}
      </dl>
      {view.trackingUrl && (
        <a
          href={view.trackingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-blue-500 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
        >
          Track on the courier&apos;s website <ExternalLink className="size-3.5" />
        </a>
      )}
    </div>
  );
}

function Timeline({
  events,
  eventAction,
}: {
  events: TrackingEventView[];
  eventAction?: (event: TrackingEventView) => ReactNode;
}) {
  if (events.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <h3 className="text-sm font-semibold text-blue">Order updates</h3>
      <ol className="mt-4 space-y-0">
        {events.map((event, index) => (
          <li key={event.id} className="relative flex gap-3 pb-5 last:pb-0">
            {index < events.length - 1 && (
              <span aria-hidden="true" className="absolute top-5 left-[9px] h-full w-px bg-gray-200" />
            )}
            <CircleDot
              className={cn(
                "relative z-10 mt-0.5 size-5 shrink-0 bg-white",
                index === 0 ? "text-blue-500" : "text-slate-300",
              )}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className={cn("text-sm font-medium", index === 0 ? "text-blue" : "text-slate-600")}>
                  {event.label}
                </p>
                <p className="text-xs text-slate-400">{formatTrackingDate(event.occurredAt, true)}</p>
              </div>
              {event.message && <p className="mt-0.5 text-sm text-slate-500">{event.message}</p>}
              {event.location && (
                <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                  <MapPin className="size-3" /> {event.location}
                </p>
              )}
            </div>
            {eventAction && <div className="shrink-0">{eventAction(event)}</div>}
          </li>
        ))}
      </ol>
    </div>
  );
}
