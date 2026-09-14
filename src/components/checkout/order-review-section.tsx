import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface ReviewItem {
  id: string;
  name: string;
  image?: string;
  unitPrice: number;
  quantity: number;
}

export function OrderReviewSection({ items }: { items: ReviewItem[] }) {
  return (
    <div>
      <div className="divide-y divide-gray-100 rounded-lg border border-gray-100">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-medium text-blue">
                {item.name}
              </p>
              <p className="text-xs text-slate-400">
                Qty {item.quantity} &middot; {formatCurrency(item.unitPrice)}{" "}
                each
              </p>
            </div>
            <p className="shrink-0 text-sm font-semibold text-blue">
              {formatCurrency(item.unitPrice * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <Link
        href="/cart"
        className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-500"
      >
        Edit cart
      </Link>
    </div>
  );
}
