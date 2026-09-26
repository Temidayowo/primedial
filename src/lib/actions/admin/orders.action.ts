"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";
import { OrderEventType, OrderStatus, PaymentStatus } from "@/generated/prisma/enums";
import { isUuid } from "@/lib/uuid";
import { recordOrderEvent } from "@/lib/orders/events";
import { type OrderEmailKind, sendOrderUpdateEmail } from "@/lib/email/order-emails";

export async function getAllOrdersAdmin() {
  await requireAdmin();

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { name: true } } } },
    },
  });

  return orders.map((order) => ({ ...order, total: Number(order.total) }));
}

export async function getOrderByIdAdmin(id: string) {
  await requireAdmin();
  if (!isUuid(id)) return null;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      shippingAddress: true,
      items: { include: { product: { select: { name: true, images: true, slug: true } } } },
      events: { orderBy: { occurredAt: "desc" } },
    },
  });

  if (!order) return null;

  return {
    ...order,
    total: Number(order.total),
    items: order.items.map((item) => ({ ...item, price: Number(item.price) })),
  };
}

export type FulfilmentFormState =
  | { ok: true; message: string }
  | { ok: false; message?: string; errors?: Record<string, string[] | undefined> }
  | undefined;

const blankToNull = (value: unknown) =>
  typeof value === "string" && value.trim() !== "" ? value.trim() : null;

const optionalText = (max: number) =>
  z.preprocess(blankToNull, z.string().max(max, { error: "This is too long." }).nullable());

const fulfilmentSchema = z.object({
  orderId: z.uuid(),
  status: z.enum(OrderStatus),
  courierName: optionalText(80),
  trackingNumber: optionalText(80),
  trackingUrl: z.preprocess(
    blankToNull,
    z.url({ protocol: /^https?$/, error: "Enter a full link starting with https://" }).nullable(),
  ),
  message: optionalText(1000),
  notify: z.boolean(),
});

function revalidateOrder(orderId: string) {
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath(`/account/orders/${orderId}`);
  revalidatePath("/account/orders");
}

const STATUS_EVENT: Record<OrderStatus, OrderEventType> = {
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

// Moves an order through fulfilment and keeps its tracking details:
// records the change on the timeline, stamps the first shipped /
// delivered / cancelled time, and (optionally) emails the customer.
// The order id is a form field, not a bound argument - see the note on
// authenticate() in src/lib/actions/auth.action.ts.
export async function updateFulfilment(
  _prevState: FulfilmentFormState,
  formData: FormData,
): Promise<FulfilmentFormState> {
  await requireAdmin();

  const parsed = fulfilmentSchema.safeParse({
    orderId: formData.get("orderId"),
    status: formData.get("status"),
    courierName: formData.get("courierName"),
    trackingNumber: formData.get("trackingNumber"),
    trackingUrl: formData.get("trackingUrl"),
    message: formData.get("message"),
    notify: formData.get("notify") === "on",
  });
  if (!parsed.success) {
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  }
  const input = parsed.data;

  const order = await prisma.order.findUnique({ where: { id: input.orderId } });
  if (!order) return { ok: false, message: "Order not found." };

  const statusChanged = input.status !== order.status;

  if (order.status === "CANCELLED" && statusChanged) {
    return { ok: false, message: "Cancelled orders can't be reopened." };
  }
  if (order.status === "DELIVERED" && input.status === "CANCELLED") {
    return { ok: false, message: "A delivered order can't be cancelled." };
  }
  if (
    (input.status === "SHIPPED" || input.status === "DELIVERED") &&
    order.paymentStatus !== PaymentStatus.PAID
  ) {
    return { ok: false, message: "This order hasn't been paid yet, so it can't be shipped." };
  }
  if (input.status === "SHIPPED" && !input.courierName) {
    return { ok: false, errors: { courierName: ["Enter the courier shipping this order."] } };
  }

  // Courier details only apply once an order is on its way.
  const carriesTracking = input.status === "SHIPPED" || input.status === "DELIVERED";
  const courierName = carriesTracking ? input.courierName ?? order.courierName : order.courierName;
  const trackingNumber = carriesTracking ? input.trackingNumber : order.trackingNumber;
  const trackingUrl = carriesTracking ? input.trackingUrl : order.trackingUrl;
  const trackingChanged =
    carriesTracking &&
    (courierName !== order.courierName ||
      trackingNumber !== order.trackingNumber ||
      trackingUrl !== order.trackingUrl);

  if (!statusChanged && !trackingChanged && !input.message) {
    return { ok: false, message: "Nothing has changed." };
  }

  const now = new Date();
  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: input.status,
      courierName,
      trackingNumber,
      trackingUrl,
      shippedAt:
        input.status === "SHIPPED" || input.status === "DELIVERED"
          ? (order.shippedAt ?? (input.status === "SHIPPED" ? now : null))
          : input.status === "PROCESSING"
            ? null
            : order.shippedAt,
      deliveredAt: input.status === "DELIVERED" ? (order.deliveredAt ?? now) : null,
      cancelledAt: input.status === "CANCELLED" ? (order.cancelledAt ?? now) : null,
    },
  });

  // Timeline entry describing what happened.
  let eventType: OrderEventType;
  let eventMessage: string | null = input.message;
  if (statusChanged) {
    eventType = STATUS_EVENT[input.status];
    if (!eventMessage && input.status === "SHIPPED") {
      eventMessage = `Shipped with ${courierName}${trackingNumber ? ` (tracking number ${trackingNumber})` : ""}`;
    }
  } else {
    eventType = "NOTE";
    if (!eventMessage) {
      eventMessage = `Tracking details updated: ${courierName ?? "courier"}${trackingNumber ? `, tracking number ${trackingNumber}` : ""}`;
    }
  }
  await recordOrderEvent(order.id, eventType, { source: "ADMIN", message: eventMessage });

  let emailed = false;
  if (input.notify) {
    const kind: OrderEmailKind =
      statusChanged && input.status === "SHIPPED"
        ? "shipped"
        : statusChanged && input.status === "DELIVERED"
          ? "delivered"
          : statusChanged && input.status === "CANCELLED"
            ? "cancelled"
            : "update";
    await sendOrderUpdateEmail(order.id, kind, input.message);
    emailed = true;
  }

  revalidateOrder(order.id);
  return {
    ok: true,
    message: `Order updated${emailed ? " and the customer has been emailed" : ""}.`,
  };
}

const trackingUpdateSchema = z.object({
  orderId: z.uuid(),
  type: z.enum(["IN_TRANSIT", "OUT_FOR_DELIVERY", "NOTE"]),
  location: optionalText(120),
  message: optionalText(1000),
  notify: z.boolean(),
});

// Adds an in-transit / out-for-delivery / free-text update to the
// timeline without changing the order's status.
export async function addTrackingUpdate(
  _prevState: FulfilmentFormState,
  formData: FormData,
): Promise<FulfilmentFormState> {
  await requireAdmin();

  const parsed = trackingUpdateSchema.safeParse({
    orderId: formData.get("orderId"),
    type: formData.get("type"),
    location: formData.get("location"),
    message: formData.get("message"),
    notify: formData.get("notify") === "on",
  });
  if (!parsed.success) {
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  }
  const input = parsed.data;

  if (input.type === "NOTE" && !input.message) {
    return { ok: false, errors: { message: ["Write the update for the customer."] } };
  }

  const order = await prisma.order.findUnique({
    where: { id: input.orderId },
    select: { id: true, status: true },
  });
  if (!order) return { ok: false, message: "Order not found." };
  if (order.status === "CANCELLED") {
    return { ok: false, message: "This order was cancelled." };
  }

  await recordOrderEvent(order.id, input.type, {
    source: "ADMIN",
    message: input.message,
    location: input.location,
  });

  if (input.notify) await sendOrderUpdateEmail(order.id, "update", input.message);

  revalidateOrder(order.id);
  return {
    ok: true,
    message: `Update added${input.notify ? " and the customer has been emailed" : ""}.`,
  };
}

// Removes an update an admin added by mistake. System events (placed,
// paid) and courier events are the record of what happened and stay.
export async function deleteOrderEvent(eventId: string) {
  await requireAdmin();
  if (!isUuid(eventId)) return { error: "Update not found." };

  const event = await prisma.orderEvent.findUnique({ where: { id: eventId } });
  if (!event) return { error: null };
  if (event.source !== "ADMIN") {
    return { error: "Only updates added by an admin can be removed." };
  }

  await prisma.orderEvent.delete({ where: { id: eventId } });
  revalidateOrder(event.orderId);
  return { error: null };
}
