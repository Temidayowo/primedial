// Order tracking shared by the customer's order page, the public
// /track-order page and the admin order page. Pure and client-safe: turns
// an order plus its events into a plain, serializable TrackingView.

import type {
  OrderEventSource,
  OrderEventType,
  OrderStatus,
  PaymentStatus,
} from "@/generated/prisma/enums";
import { SHIPPING_METHODS } from "@/lib/cart-constants";

export const ORDER_EVENT_LABELS: Record<OrderEventType, string> = {
  PLACED: "Order placed",
  PAID: "Payment confirmed",
  PROCESSING: "Back to processing",
  SHIPPED: "Shipped",
  IN_TRANSIT: "In transit",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Order cancelled",
  NOTE: "Update",
};

// Suggestions for the admin's courier field; any name can be typed.
export const COURIER_SUGGESTIONS = [
  "GIG Logistics",
  "DHL",
  "Red Star Express",
  "UPS",
  "FedEx",
  "Kwik Delivery",
  "Sendbox",
  "Own dispatch rider",
];

export interface TrackingEventView {
  id: string;
  type: OrderEventType;
  label: string;
  message: string | null;
  location: string | null;
  source: OrderEventSource;
  occurredAt: string;
}

export interface TrackingView {
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  placedAt: string;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  courierName: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  shippingMethodName: string | null;
  estimatedDelivery: { from: string; to: string } | null;
  // City/state only - enough to recognise the parcel, not a full address.
  destination: string | null;
  items: { name: string; quantity: number }[];
  events: TrackingEventView[];
}

interface OrderForTracking {
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  paidAt: Date | null;
  shippedAt: Date | null;
  deliveredAt: Date | null;
  cancelledAt: Date | null;
  courierName: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  shippingMethod: string | null;
  items: { quantity: number; product: { name: string } }[];
  events: {
    id: string;
    type: OrderEventType;
    source: OrderEventSource;
    message: string | null;
    location: string | null;
    occurredAt: Date;
  }[];
}

const iso = (date: Date | null) => (date ? date.toISOString() : null);

export function buildTrackingView(
  order: OrderForTracking,
  destination: { city: string; state: string | null } | null,
): TrackingView {
  const method = SHIPPING_METHODS.find((m) => m.id === order.shippingMethod) ?? null;

  return {
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    placedAt: order.createdAt.toISOString(),
    paidAt: iso(order.paidAt),
    shippedAt: iso(order.shippedAt),
    deliveredAt: iso(order.deliveredAt),
    cancelledAt: iso(order.cancelledAt),
    courierName: order.courierName,
    trackingNumber: order.trackingNumber,
    trackingUrl: order.trackingUrl,
    shippingMethodName: method?.name ?? null,
    estimatedDelivery: estimateDelivery(order, method?.deliveryDays ?? null),
    destination: destination
      ? [destination.city, destination.state].filter(Boolean).join(", ")
      : null,
    items: order.items.map((item) => ({ name: item.product.name, quantity: item.quantity })),
    events: [...order.events]
      .sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())
      .map((event) => ({
        id: event.id,
        type: event.type,
        label: ORDER_EVENT_LABELS[event.type],
        message: event.message,
        location: event.location,
        source: event.source,
        occurredAt: event.occurredAt.toISOString(),
      })),
  };
}

// Business days (Mon-Fri) after `start`.
function addBusinessDays(start: Date, days: number) {
  const date = new Date(start);
  let added = 0;
  while (added < days) {
    date.setUTCDate(date.getUTCDate() + 1);
    const day = date.getUTCDay();
    if (day !== 0 && day !== 6) added++;
  }
  return date;
}

// Only for paid orders that are still on their way. Counts from dispatch
// once shipped; before that, allows one business day to dispatch.
function estimateDelivery(
  order: OrderForTracking,
  days: { min: number; max: number } | null,
): TrackingView["estimatedDelivery"] {
  if (!days || order.paymentStatus !== "PAID") return null;
  if (order.status === "DELIVERED" || order.status === "CANCELLED") return null;

  const start = order.shippedAt ?? order.paidAt;
  if (!start) return null;
  const dispatchDays = order.shippedAt ? 0 : 1;

  return {
    from: addBusinessDays(start, days.min + dispatchDays).toISOString(),
    to: addBusinessDays(start, days.max + dispatchDays).toISOString(),
  };
}

// Dates render in Lagos time everywhere so server and browser agree.
export function formatTrackingDate(value: string, withTime = false) {
  return new Date(value).toLocaleString("en-NG", {
    timeZone: "Africa/Lagos",
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  });
}
