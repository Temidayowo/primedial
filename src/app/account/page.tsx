import type { Metadata } from "next";
import Link from "next/link";
import { Package, Wallet, Truck } from "lucide-react";
import { verifySession } from "@/lib/dal";
import { getOrderStats, getRecentOrders } from "@/lib/actions/orders.action";
import { OrderCard } from "@/components/account/order-card";

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
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50">
              <Package className="size-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Orders</p>
              <p className="font-clash-display text-xl font-bold text-blue">
                {stats.totalOrders}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-orange-50">
              <Wallet className="size-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Spent</p>
              <p className="font-clash-display text-xl font-bold text-blue">
                {stats.totalSpent.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
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
          className="flex items-center justify-between rounded-xl border border-blue-500 bg-blue-500 p-5 transition-colors hover:bg-blue-600"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-white/15">
              <Truck className="size-5 text-white" />
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
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-200 p-8 text-center">
            <p className="text-sm text-slate-500">
              You haven&apos;t placed any orders yet.
            </p>
            <Link
              href="/shop"
              className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-500"
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
