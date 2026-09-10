import type { Metadata } from "next";
import { verifySession } from "@/lib/dal";
import { getAllOrders } from "@/lib/actions/orders.action";
import { OrderCard } from "@/components/account/order-card";

export const metadata: Metadata = {
  title: "Order History",
};

export default async function OrderHistoryPage() {
  const session = await verifySession();
  const orders = await getAllOrders(session.user.id);

  return (
    <div className="max-w-4xl">
      <h1 className="font-clash-display text-2xl font-bold text-blue md:text-3xl">
        Order History
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {orders.length} {orders.length === 1 ? "order" : "orders"} total.
      </p>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-200 p-8 text-center">
          <p className="text-sm text-slate-500">
            You haven&apos;t placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              id={order.id}
              orderNumber={order.orderNumber}
              createdAt={order.createdAt}
              status={order.status}
              total={Number(order.total)}
              itemSummary={order.items
                .map((item) => item.product.name)
                .join(", ")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
