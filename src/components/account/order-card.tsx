import Link from "next/link";
import { StatusBadge, PaymentStatusBadge } from "@/components/account/status-badge";
import { OrderStatus, PaymentStatus } from "@/generated/prisma/enums";
import { formatCurrency } from "@/lib/utils";

interface OrderCardProps {
  id: string;
  orderNumber: string;
  createdAt: Date;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
  itemSummary: string;
}

export function OrderCard({
  id,
  orderNumber,
  createdAt,
  status,
  paymentStatus,
  total,
  itemSummary,
}: OrderCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-clash-display font-semibold text-blue">
            {orderNumber}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {createdAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {paymentStatus !== "PAID" && <PaymentStatusBadge status={paymentStatus} />}
          <StatusBadge status={status} />
        </div>
      </div>

      <p className="mt-3 truncate text-sm text-slate-500">{itemSummary}</p>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
        <p className="text-sm font-medium text-blue">
          {formatCurrency(total)}
        </p>
        <Link
          href={`/account/orders/${id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
