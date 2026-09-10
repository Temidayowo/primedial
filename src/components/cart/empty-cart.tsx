import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-white/5">
        <ShoppingCart className="size-6 text-slate-400" />
      </div>
      <h2 className="mt-4 font-clash-display text-xl font-bold text-white">
        Your cart is empty
      </h2>
      <p className="mt-1 text-sm text-slate-400">
        Add some equipment to get started.
      </p>
      <Link
        href="/shop"
        className="mt-6 rounded-full bg-blue-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
