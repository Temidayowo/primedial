import "server-only";
import { prisma } from "@/lib/prisma";
import { EMAIL_FROM, getResendClient, isEmailConfigured } from "@/lib/resend";
import { getBaseUrl } from "@/lib/url";
import { getContactDetails } from "@/lib/site-settings";
import { buildTrackingView, formatTrackingDate } from "@/lib/orders/tracking";

export type OrderEmailKind = "shipped" | "delivered" | "cancelled" | "update";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// Tells the customer their order moved on. Best-effort: logs and returns
// on failure, never throws into the admin action that triggered it.
export async function sendOrderUpdateEmail(
  orderId: string,
  kind: OrderEmailKind,
  note?: string | null,
) {
  try {
    if (!isEmailConfigured()) {
      console.log(`[order email] Skipped "${kind}" for order ${orderId} (Resend not configured)`);
      return;
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { email: true, name: true } },
        items: { include: { product: { select: { name: true } } } },
        events: true,
      },
    });
    if (!order) return;

    const view = buildTrackingView(order, null);
    const [baseUrl, contact] = await Promise.all([getBaseUrl(), getContactDetails()]);
    const orderUrl = `${baseUrl}/account/orders/${order.id}`;
    const firstName = order.user.name?.split(" ")[0];
    const greeting = firstName ? `Hi ${escapeHtml(firstName)},` : "Hi,";
    const number = escapeHtml(order.orderNumber);

    const content: Record<OrderEmailKind, { subject: string; heading: string; intro: string }> = {
      shipped: {
        subject: `Your order ${order.orderNumber} is on its way`,
        heading: "Your order is on its way",
        intro: `Good news - order <strong>${number}</strong> has been shipped.`,
      },
      delivered: {
        subject: `Your order ${order.orderNumber} has been delivered`,
        heading: "Your order has been delivered",
        intro: `Order <strong>${number}</strong> has been delivered. We hope everything arrived in perfect condition.`,
      },
      cancelled: {
        subject: `Your order ${order.orderNumber} has been cancelled`,
        heading: "Your order has been cancelled",
        intro:
          `Order <strong>${number}</strong> has been cancelled.` +
          (order.paymentStatus === "PAID"
            ? " Our team will contact you about your refund."
            : " You have not been charged."),
      },
      update: {
        subject: `Update on your order ${order.orderNumber}`,
        heading: "An update on your order",
        intro: `There's a new update on order <strong>${number}</strong>.`,
      },
    };
    const { subject, heading, intro } = content[kind];

    const rows: [string, string][] = [];
    if (view.courierName) rows.push(["Courier", view.courierName]);
    if (view.trackingNumber) rows.push(["Tracking number", view.trackingNumber]);
    if (view.estimatedDelivery && kind !== "delivered" && kind !== "cancelled") {
      const { from, to } = view.estimatedDelivery;
      rows.push([
        "Estimated delivery",
        from === to ? formatTrackingDate(from) : `${formatTrackingDate(from)} - ${formatTrackingDate(to)}`,
      ]);
    }
    const showTracking = kind === "shipped" || kind === "update";
    const detailsHtml =
      showTracking && rows.length > 0
        ? `<table style="border-collapse:collapse;margin:16px 0;">${rows
            .map(
              ([label, value]) =>
                `<tr><td style="padding:4px 16px 4px 0;color:#64748b;font-size:14px;">${label}</td><td style="padding:4px 0;color:#0f172a;font-size:14px;font-weight:600;">${escapeHtml(value)}</td></tr>`,
            )
            .join("")}</table>`
        : "";
    const courierLink =
      showTracking && view.trackingUrl
        ? `<p style="margin:0 0 16px;"><a href="${escapeHtml(view.trackingUrl)}" style="color:#2563eb;font-size:14px;">Track on the courier's website</a></p>`
        : "";
    const noteHtml = note
      ? `<p style="white-space:pre-wrap;color:#334155;font-size:14px;line-height:1.6;background:#f8fafc;border-radius:8px;padding:12px;">${escapeHtml(note)}</p>`
      : "";

    const { error } = await getResendClient().emails.send({
      from: EMAIL_FROM,
      to: order.user.email,
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h1 style="color:#0f172a;font-size:20px;">${heading}</h1>
          <p style="color:#475569;font-size:14px;line-height:1.6;">${greeting}</p>
          <p style="color:#475569;font-size:14px;line-height:1.6;">${intro}</p>
          ${noteHtml}
          ${detailsHtml}
          ${courierLink}
          <a href="${orderUrl}" style="display:inline-block;margin-top:8px;padding:10px 20px;background-color:#3b82f6;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;">View your order</a>
          <p style="color:#94a3b8;font-size:12px;margin-top:24px;line-height:1.6;">
            Questions? Email ${escapeHtml(contact.email)}${contact.phones[0] ? ` or call ${escapeHtml(contact.phones[0])}` : ""}.
          </p>
        </div>
      `,
    });

    if (error) console.error(`[order email] Resend failed for order ${orderId}:`, error);
  } catch (error) {
    console.error(`[order email] Failed to send "${kind}" for order ${orderId}:`, error);
  }
}
