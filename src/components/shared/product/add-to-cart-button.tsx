"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { addToCart } from "@/lib/actions/cart.action";
import { cn } from "@/lib/utils";

// Fires so the header's cart badge (which has no other way to know a
// mutation just happened) can refetch without a full page navigation.
export function notifyCartUpdated() {
  window.dispatchEvent(new Event("cart-updated"));
}

export function AddToCartButton({
  productId,
  inStock,
  quantity = 1,
  className,
}: {
  productId: string;
  inStock: boolean;
  quantity?: number;
  className?: string;
}) {
  const { status } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  if (!inStock) {
    return (
      <button
        type="button"
        disabled
        className={cn(
          "rounded-full bg-slate-200 px-4 py-2 text-sm font-medium text-slate-500",
          className,
        )}
      >
        Out of Stock
      </button>
    );
  }

  const handleClick = () => {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    startTransition(async () => {
      await addToCart(productId, quantity);
      notifyCartUpdated();
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "rounded-full bg-green px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-blue disabled:opacity-60",
        className,
      )}
    >
      {isPending ? "Adding..." : added ? "Added!" : "Add to Cart"}
    </button>
  );
}
