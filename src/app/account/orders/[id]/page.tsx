import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { verifySession } from "@/lib/dal";
import { getOrderById } from "@/lib/queries/orders";
import { getPaymentMethods } from "@/lib/queries/payment-methods";
import { StatusBadge, PaymentStatusBadge } from "@/components/account/status-badge";
import { RetryPayment } from "@/components/account/retry-payment";
import { formatCurrency } from "@/lib/utils";
import { getOrderShippingDetails } from "@/lib/shipping-details";
import { syncOrderPaymentFromProvider } from "@/lib/payments/reconcile";
import { SHIPPING_METHODS } from "@/lib/cart-constants";
import { buildTrackingView } from "@/lib/orders/tracking";
import { OrderTracking } from "@/components/orders/order-tracking";

export const metadata: Metadata = {
  title: "Order Details",
};

export default async function OrderDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const session = await verifySession();
  const [found, paymentMethods] = await Promise.all([
    getOrderById(session.user.id, id),
    getPaymentMethods(session.user.id),
  ]);

  if (!found) notFound();

  // OPay sends the customer back here after paying. Ask OPay what happened
  // so the page shows the real status straight away rather than waiting
  // for its callback to arrive.
  let order = found;
  if (order.paymentStatus !== "PAID" && order.paymentProvider === "OPAY") {
    const synced = await syncOrderPaymentFromProvider(order);
    if (synced === "paid" || synced === "failed") {
      order = (await getOrderById(session.user.id, id)) ?? order;
    }
  }

  const shipping = getOrderShippingDetails(order);
  const isCancelled = order.status === "CANCELLED";
  const shippingMethod = SHIPPING_METHODS.find((m) => m.id === order.shippingMethod);

  return (
    <div className="max-w-3xl">
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue"
      >
        <ArrowLeft className="size-4" />
        Back to orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-clash-display text-2xl font-bold text-blue">
            {order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Placed on{" "}
            {order.createdAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PaymentStatusBadge status={order.paymentStatus} />
          <StatusBadge status={order.status} />
        </div>
      </div>

      {!isCancelled && order.paymentStatus !== "PAID" && (
        <RetryPayment
          orderId={order.id}
          paymentStatus={order.paymentStatus === "FAILED" ? "FAILED" : "PENDING"}
          paymentMethods={paymentMethods}
        />
      )}

      <section className="mt-6" aria-label="Order tracking">
        <OrderTracking view={buildTrackingView(order, shipping)} />
      </section>

      <div className="mt-8 rounded-xl border border-gray-100 bg-white">
        <div className="divide-y divide-gray-100">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4">
              <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                {item.product.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="size-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-blue">
                  {item.product.name}
                </p>
                <p className="text-xs text-slate-400">
                  Qty {item.quantity} &times; {formatCurrency(Number(item.price))}
                </p>
              </div>
              <p className="text-sm font-medium text-blue">
                {formatCurrency(Number(item.price) * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        {order.subtotal !== null && (
          <div className="space-y-1.5 border-t border-gray-100 p-4 text-sm text-slate-500">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(Number(order.subtotal))}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatCurrency(Number(order.tax ?? 0))}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping{shippingMethod ? ` (${shippingMethod.name})` : ""}</span>
              <span>{formatCurrency(Number(order.shippingCost ?? 0))}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-100 p-4">
          <p className="text-sm font-medium text-slate-500">Total</p>
          <p className="font-clash-display text-lg font-bold text-blue">
            {formatCurrency(Number(order.total))}
          </p>
        </div>
      </div>

      {shipping && (
        <div className="mt-6 rounded-xl border border-gray-100 bg-white p-4">
          <h2 className="text-sm font-semibold text-blue">
            Shipping Address
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {shipping.fullName}
            <br />
            {shipping.line1}
            {shipping.line2 && (
              <>
                <br />
                {shipping.line2}
              </>
            )}
            <br />
            {shipping.city}
            {shipping.state
              ? `, ${shipping.state}`
              : ""}{" "}
            {shipping.postalCode}
            <br />
            {shipping.country}
          </p>
        </div>
      )}
    </div>
  );
}
