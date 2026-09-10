import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { verifySession } from "@/lib/dal";
import { getOrderById } from "@/lib/actions/orders.action";
import { StatusBadge } from "@/components/account/status-badge";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order Details",
};

export default async function OrderDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const session = await verifySession();
  const order = await getOrderById(session.user.id, id);

  if (!order) notFound();

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
        <StatusBadge status={order.status} />
      </div>

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
                <p className="text-xs text-slate-400">Qty {item.quantity}</p>
              </div>
              <p className="text-sm font-medium text-blue">
                {formatCurrency(Number(item.price))}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 p-4">
          <p className="text-sm font-medium text-slate-500">Total</p>
          <p className="font-clash-display text-lg font-bold text-blue">
            {formatCurrency(Number(order.total))}
          </p>
        </div>
      </div>

      {order.shippingAddress && (
        <div className="mt-6 rounded-xl border border-gray-100 bg-white p-4">
          <h2 className="text-sm font-semibold text-blue">
            Shipping Address
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {order.shippingAddress.fullName}
            <br />
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 && (
              <>
                <br />
                {order.shippingAddress.line2}
              </>
            )}
            <br />
            {order.shippingAddress.city}
            {order.shippingAddress.state
              ? `, ${order.shippingAddress.state}`
              : ""}{" "}
            {order.shippingAddress.postalCode}
            <br />
            {order.shippingAddress.country}
          </p>
        </div>
      )}
    </div>
  );
}
