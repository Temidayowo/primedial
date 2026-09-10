"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  updateCartItemQuantity,
  removeCartItem,
} from "@/lib/actions/cart.action";
import { notifyCartUpdated } from "@/components/shared/product/add-to-cart-button";
import { formatCurrency } from "@/lib/utils";

interface CartItemRowProps {
  id: string;
  productSlug: string;
  productName: string;
  productImage: string | undefined;
  unitPrice: number;
  quantity: number;
}

export function CartItemRow({
  id,
  productSlug,
  productName,
  productImage,
  unitPrice,
  quantity,
}: CartItemRowProps) {
  const [isPending, startTransition] = useTransition();

  const setQuantity = (next: number) => {
    startTransition(async () => {
      await updateCartItemQuantity(id, next);
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
    <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4">
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
          className="line-clamp-2 text-sm font-medium text-blue hover:text-blue-600 sm:text-base"
        >
          {productName}
        </Link>
        <p className="mt-1 text-xs text-slate-400 sm:hidden">
          {formatCurrency(unitPrice)} each
        </p>
      </div>

      <p className="hidden w-28 shrink-0 text-sm text-slate-500 sm:block">
        {formatCurrency(unitPrice)}
      </p>

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
          disabled={isPending}
          aria-label="Increase quantity"
          className="text-slate-400 hover:text-blue disabled:opacity-50"
        >
          <Plus className="size-3.5" />
        </button>
      </div>

      <p className="w-24 shrink-0 text-right text-sm font-semibold text-blue sm:w-28">
        {formatCurrency(unitPrice * quantity)}
      </p>

      <button
        type="button"
        onClick={remove}
        disabled={isPending}
        aria-label="Remove item"
        className="shrink-0 text-slate-400 hover:text-red-500 disabled:opacity-50"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
