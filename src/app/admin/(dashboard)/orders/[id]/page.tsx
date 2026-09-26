import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { deleteOrderEvent, getOrderByIdAdmin } from "@/lib/actions/admin/orders.action";
import { StatusBadge, PaymentStatusBadge } from "@/components/account/status-badge";
import { FulfilmentPanel } from "@/components/admin/fulfilment-panel";
import { DeleteContentButton } from "@/components/admin/content/delete-content-button";
import { OrderTracking } from "@/components/orders/order-tracking";
import { buildTrackingView } from "@/lib/orders/tracking";
import { formatCurrency } from "@/lib/utils";
import { getOrderShippingDetails } from "@/lib/shipping-details";

export const metadata: Metadata = {
  title: "Order Details",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderByIdAdmin(id);

  if (!order) notFound();

  // The copy saved with the order - still there if the customer has
  // since deleted this address from their account.
  const shipping = getOrderShippingDetails(order);
  const tracking = buildTrackingView(order, shipping);

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/orders"
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
            })}{" "}
            by {order.user.name ?? order.user.email}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PaymentStatusBadge status={order.paymentStatus} />
          <StatusBadge status={order.status} />
        </div>
      </div>

      <div className="mt-6">
        <FulfilmentPanel
          orderId={order.id}
          status={order.status}
          isPaid={order.paymentStatus === "PAID"}
          courierName={order.courierName}
          trackingNumber={order.trackingNumber}
          trackingUrl={order.trackingUrl}
        />
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-blue">What the customer sees</h2>
        <OrderTracking
          view={tracking}
          eventAction={(event) =>
            event.source === "ADMIN" ? (
              <DeleteContentButton
                action={deleteOrderEvent.bind(null, event.id)}
                itemName={`the "${event.label}" update`}
              />
            ) : null
          }
        />
      </div>

      <div className="mt-6 rounded-xl border border-gray-100 bg-white p-4">
        <h2 className="text-sm font-semibold text-blue">Payment</h2>
        <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-slate-400">Provider</dt>
          <dd className="text-slate-600">{order.paymentProvider ?? "-"}</dd>
          <dt className="text-slate-400">Reference</dt>
          <dd className="text-slate-600">{order.paymentReference ?? "-"}</dd>
          <dt className="text-slate-400">Paid At</dt>
          <dd className="text-slate-600">
            {order.paidAt
              ? order.paidAt.toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })
              : "-"}
          </dd>
        </dl>
      </div>

      <div className="mt-6 rounded-xl border border-gray-100 bg-white">
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
                <p className="text-xs text-slate-400">Qty {item.quantity}</p>
              </div>
              <p className="text-sm font-medium text-blue">
                {formatCurrency(item.price)}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 p-4">
          <p className="text-sm font-medium text-slate-500">Total</p>
          <p className="font-clash-display text-lg font-bold text-blue">
            {formatCurrency(order.total)}
          </p>
        </div>
      </div>

      {shipping && (
        <div className="mt-6 rounded-xl border border-gray-100 bg-white p-4">
          <h2 className="text-sm font-semibold text-blue">Shipping Address</h2>
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
            {shipping.state ? `, ${shipping.state}` : ""}{" "}
            {shipping.postalCode}
            <br />
            {shipping.country}
            {shipping.phone && (
              <>
                <br />
                {shipping.phone}
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
