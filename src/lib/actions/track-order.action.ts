"use server";

import * as z from "zod";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { normalizeEmail } from "@/lib/email-address";
import { buildTrackingView, type TrackingView } from "@/lib/orders/tracking";
import { getOrderShippingDetails } from "@/lib/shipping-details";

export type TrackOrderState =
  | { ok: true; view: TrackingView }
  | { ok: false; error: string }
  | undefined;

const schema = z.object({
  orderNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^PDS-\d{4}-[0-9A-Z]{5,6}$/, { error: "Enter your order number, e.g. PDS-2026-1A2B3C." }),
  email: z.email({ error: "Enter the email you ordered with." }).transform(normalizeEmail),
});

const NOT_FOUND = "We couldn't find an order with that number and email. Check both and try again.";

// Public order lookup for /track-order. Both the order number and the
// account email must match, and lookups are rate-limited per visitor, so
// this can't be used to discover other people's orders. Returns only
// tracking details - no prices, and the destination as city/state only.
export async function lookupOrderTracking(
  _prevState: TrackOrderState,
  formData: FormData,
): Promise<TrackOrderState> {
  const parsed = schema.safeParse({
    orderNumber: formData.get("orderNumber"),
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? NOT_FOUND };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const allowed = await checkRateLimit(`track-order:${ip}`, 10, 10 * 60 * 1000);
  if (!allowed) {
    return { ok: false, error: "Too many lookups. Please wait a few minutes and try again." };
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber: parsed.data.orderNumber },
    include: {
      user: { select: { email: true } },
      shippingAddress: true,
      items: { include: { product: { select: { name: true } } } },
      events: { orderBy: { occurredAt: "desc" } },
    },
  });

  if (!order || normalizeEmail(order.user.email) !== parsed.data.email) {
    return { ok: false, error: NOT_FOUND };
  }

  return { ok: true, view: buildTrackingView(order, getOrderShippingDetails(order)) };
}
