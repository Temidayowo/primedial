import { EMAIL_FROM, getResendClient, isEmailConfigured } from "@/lib/resend";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

// Called from markOrderPaidByReference (src/lib/payments/order-status.ts)
// right after an order flips PENDING -> PAID, regardless of which of the
// three payment paths (client verify call, Paystack webhook, OPay
// webhook) noticed it first - that caller already guards against sending
// this more than once per order.
export async function sendOrderConfirmationEmail(orderId: string) {
  if (!isEmailConfigured()) {
    console.log(`[order confirmation email] Skipped for order ${orderId} (Resend not configured)`);
    return;
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { email: true, name: true } },
      items: { include: { product: { select: { name: true } } } },
    },
  });

  if (!order) return;

  const itemsHtml = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 6px 0; color: #334155; font-size: 14px;">
            ${item.product.name} &times; ${item.quantity}
          </td>
          <td style="padding: 6px 0; text-align: right; color: #334155; font-size: 14px;">
            ${formatCurrency(Number(item.price) * item.quantity)}
          </td>
        </tr>
      `,
    )
    .join("");

  const { error } = await getResendClient().emails.send({
    from: EMAIL_FROM,
    to: order.user.email,
    subject: `Order confirmed - ${order.orderNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="color: #0f172a; font-size: 20px;">
          Thanks for your order${order.user.name ? `, ${order.user.name.split(" ")[0]}` : ""}!
        </h1>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">
          We've received payment for order <strong>${order.orderNumber}</strong>.
          Here's what's in it:
        </p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          ${itemsHtml}
        </table>
        <p style="border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 14px; font-weight: 600; color: #0f172a;">
          Total: ${formatCurrency(Number(order.total))}
        </p>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">
          You can track this order any time from your account.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error(`[order confirmation email] Resend failed for order ${orderId}:`, error);
  }
}
