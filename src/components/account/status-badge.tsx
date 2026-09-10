import { cn } from "@/lib/utils";
import { OrderStatus } from "@/generated/prisma/enums";

const styles: Record<OrderStatus, string> = {
  PROCESSING: "bg-orange-500/15 text-orange-400",
  SHIPPED: "bg-blue-500/15 text-blue-400",
  DELIVERED: "bg-green/15 text-green",
  CANCELLED: "bg-red-500/15 text-red-400",
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
