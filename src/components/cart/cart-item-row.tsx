"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  updateCartItemQuantity,
  removeCartItem,
} from "@/lib/actions/cart.action";
import { notifyCartUpdated } from "@/components/shared/product/add-to-cart-button";
import { formatCurrency } from "@/lib/utils";
import { MAX_CART_QUANTITY } from "@/lib/product-availability";

interface CartItemRowProps {
  id: string;
  productSlug: string;
  productName: string;
  productImage: string | undefined;
  unitPrice: number;
  quantity: number;
  // Set when the product has gone out of stock - checkout refuses the
  // cart until it's removed.
  unavailableReason?: string;
}

export function CartItemRow({
  id,
  productSlug,
  productName,
  productImage,
  unitPrice,
  quantity,
  unavailableReason,
}: CartItemRowProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const setQuantity = (next: number) => {
    setError(null);
    startTransition(async () => {
      const result = await updateCartItemQuantity(id, next);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      notifyCartUpdated();
    });
  };

  const remove = () => {
    startTransition(async () => {
      await removeCartItem(id);
      notifyCartUpdated();
    });
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex items-center gap-4 sm:min-w-0 sm:flex-1">
        <Link
          href={`/shop/${productSlug}`}
          className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:size-20"
        >
          {productImage && (
            <Image
              src={productImage}
              alt={productName}
              fill
              sizes="80px"
              className="object-cover"
            />
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            href={`/shop/${productSlug}`}
            className="line-clamp-2 text-sm font-medium text-blue hover:text-blue/70 sm:text-base"
          >
            {productName}
          </Link>
          <p className="mt-1 text-xs text-slate-400 sm:hidden">
            {formatCurrency(unitPrice)} each
          </p>
          {unavailableReason && (
            <p className="mt-1 text-xs font-medium text-red-600">{unavailableReason}</p>
          )}
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>

        <button
          type="button"
          onClick={remove}
          disabled={isPending}
          aria-label="Remove item"
          className="shrink-0 self-start text-slate-400 hover:text-red-500 disabled:opacity-50 sm:hidden"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <p className="hidden w-28 shrink-0 whitespace-nowrap text-sm text-slate-500 sm:block">
        {formatCurrency(unitPrice)}
      </p>

      <div className="flex items-center justify-between gap-4 sm:contents">
        <div className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-2 py-1">
          <button
            type="button"
            onClick={() => setQuantity(quantity - 1)}
            disabled={isPending || quantity <= 1}
            aria-label="Decrease quantity"
            className="text-slate-400 hover:text-blue disabled:opacity-50"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="w-5 text-center text-sm text-blue">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            disabled={isPending || quantity >= MAX_CART_QUANTITY || Boolean(unavailableReason)}
            aria-label="Increase quantity"
            className="text-slate-400 hover:text-blue disabled:opacity-50"
          >
            <Plus className="size-3.5" />
          </button>
        </div>

        <p className="shrink-0 whitespace-nowrap text-right text-sm font-semibold text-blue">
          {formatCurrency(unitPrice * quantity)}
        </p>
      </div>

      <button
        type="button"
        onClick={remove}
        disabled={isPending}
        aria-label="Remove item"
        className="hidden shrink-0 text-slate-400 hover:text-red-500 disabled:opacity-50 sm:block"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
