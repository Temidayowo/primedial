import "server-only";
import { prisma } from "@/lib/prisma";
import type { OrderEventSource, OrderEventType } from "@/generated/prisma/enums";

// Appends to an order's tracking timeline. The one write path for
// events - checkout, payment confirmation, the admin, and (later) the
// courier API integration all go through here.
export async function recordOrderEvent(
  orderId: string,
  type: OrderEventType,
  options: {
    source?: OrderEventSource;
    message?: string | null;
    location?: string | null;
    occurredAt?: Date;
  } = {},
) {
  return prisma.orderEvent.create({
    data: {
      orderId,
      type,
      source: options.source ?? "SYSTEM",
      message: options.message ?? null,
      location: options.location ?? null,
      occurredAt: options.occurredAt ?? new Date(),
    },
  });
}

// For timeline entries recorded as a side effect of something more
// important (placing an order, confirming a payment): a failure is logged
// and never undoes or blocks the main action.
export async function recordOrderEventSafely(
  ...args: Parameters<typeof recordOrderEvent>
) {
  try {
    await recordOrderEvent(...args);
  } catch (error) {
    console.error(`[order events] Could not record ${args[1]} for order ${args[0]}:`, error);
  }
}
