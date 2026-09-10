import { cn } from "@/lib/utils";
import { OrderStatus } from "@/generated/prisma/enums";

const styles: Record<OrderStatus, string> = {
  PROCESSING: "bg-orange-50 text-orange-600",
  SHIPPED: "bg-blue-50 text-blue-600",
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
