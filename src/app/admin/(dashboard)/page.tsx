import type { Metadata } from "next";
import Link from "next/link";
import { DollarSign, ShoppingBag, Clock, Package, AlertTriangle } from "lucide-react";
import { getDashboardStats } from "@/lib/actions/admin/dashboard.action";
import { StatusBadge, PaymentStatusBadge } from "@/components/account/status-badge";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

const statCards = [
  {
    key: "totalRevenue" as const,
    label: "Total Revenue",
    icon: DollarSign,
    format: formatCurrency,
  },
  { key: "orderCount" as const, label: "Total Orders", icon: ShoppingBag },
  { key: "pendingCount" as const, label: "Pending Payment", icon: Clock },
  { key: "productCount" as const, label: "Products", icon: Package },
  { key: "outOfStockCount" as const, label: "Out of Stock", icon: AlertTriangle },
];

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="font-clash-display text-2xl font-bold text-blue md:text-3xl">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        An overview of store activity.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {statCards.map(({ key, label, icon: Icon, format }) => (
          <div key={key} className="rounded-xl border border-gray-100 bg-white p-5">
            <Icon className="size-5 text-blue-500" />
            <p className="mt-3 font-clash-display text-xl font-bold text-blue">
              {format ? format(stats[key]) : stats[key]}
            </p>
            <p className="mt-1 text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-gray-100 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-clash-display text-lg font-bold text-blue">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View all
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No orders yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-slate-400 uppercase">
                  <th className="pb-2 font-medium">Order</th>
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Payment</th>
                  <th className="pb-2 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium text-blue hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 text-slate-500">
                      {order.user.name ?? order.user.email}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3">
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="py-3 text-right font-medium text-blue">
                      {formatCurrency(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
