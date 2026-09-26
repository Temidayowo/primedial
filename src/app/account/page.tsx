import type { Metadata } from "next";
import Link from "next/link";
import { Package, Wallet, Truck } from "lucide-react";
import { verifySession } from "@/lib/dal";
import { getOrderStats, getRecentOrders } from "@/lib/queries/orders";
import { OrderCard } from "@/components/account/order-card";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My Account",
};

export default async function AccountDashboardPage() {
  const session = await verifySession();
  const firstName = session.user.name?.split(" ")[0] ?? "there";

  const [stats, recentOrders] = await Promise.all([
    getOrderStats(session.user.id),
    getRecentOrders(session.user.id, 3),
  ]);

  const mostRecentOrder = recentOrders[0];

  return (
    <div className="max-w-4xl">
      <h1 className="font-clash-display text-2xl font-bold text-blue md:text-3xl">
        Welcome back, {firstName}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Here&apos;s what&apos;s happening with your account.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-green/10">
              <Package className="size-5 text-green" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Orders</p>
              <p className="font-clash-display text-xl font-bold text-blue">
                {stats.totalOrders}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue/10">
              <Wallet className="size-5 text-blue" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Spent</p>
              <p className="font-clash-display text-xl font-bold text-blue">
                {formatCurrency(stats.totalSpent)}
              </p>
            </div>
          </div>
        </div>

        <Link
          href={
            mostRecentOrder
              ? `/account/orders/${mostRecentOrder.id}`
              : "/account/orders"
          }
          className="flex items-center justify-between rounded-xl border border-blue bg-blue p-5 transition-colors duration-300 hover:bg-blue/90"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-white/15">
              <Truck className="size-5 text-green" />
            </div>
            <div>
              <p className="text-xs text-white/80">Quick Action</p>
              <p className="font-clash-display text-sm font-bold text-white">
                Track Order
              </p>
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-clash-display text-lg font-bold text-blue">
            Recent Orders
          </h2>
          <Link
            href="/account/orders"
            className="text-sm font-medium text-blue hover:text-blue/70"
          >
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-gray-100 p-8 text-center">
            <p className="text-sm text-slate-500">
              You haven&apos;t placed any orders yet.
            </p>
            <Link
              href="/shop"
              className="mt-3 inline-block text-sm font-medium text-blue hover:text-blue/70"
            >
              Browse equipment
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {recentOrders.map((order) => (
              <OrderCard
                key={order.id}
                id={order.id}
                orderNumber={order.orderNumber}
                createdAt={order.createdAt}
                status={order.status}
                paymentStatus={order.paymentStatus}
                total={Number(order.total)}
                itemSummary={order.items
                  .map((item) => item.product.name)
                  .join(", ")}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
