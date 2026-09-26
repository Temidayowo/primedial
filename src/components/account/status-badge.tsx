import { cn } from "@/lib/utils";
import { OrderStatus, PaymentStatus } from "@/generated/prisma/enums";

const styles: Record<OrderStatus, string> = {
  PROCESSING: "bg-orange-50 text-orange-600",
  SHIPPED: "bg-blue/10 text-blue",
  DELIVERED: "bg-green/10 text-green",
  CANCELLED: "bg-red-50 text-red-600",
};

const labels: Record<OrderStatus, string> = {
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        styles[status],
      )}
    >
      {labels[status]}
    </span>
  );
}

// Separate from StatusBadge (OrderStatus) on purpose - fulfillment and
// payment are different axes (an order is created PENDING/PROCESSING
// immediately, before any money has moved), and both need to be visible:
// an unpaid order otherwise looks identical to a paid one everywhere in
// the account UI.
const paymentStyles: Record<PaymentStatus, string> = {
  PENDING: "bg-amber-50 text-amber-600",
  PAID: "bg-green/10 text-green",
  FAILED: "bg-red-50 text-red-600",
};

const paymentLabels: Record<PaymentStatus, string> = {
  PENDING: "Payment Pending",
  PAID: "Paid",
  FAILED: "Payment Failed",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        paymentStyles[status],
      )}
    >
      {paymentLabels[status]}
    </span>
  );
}
