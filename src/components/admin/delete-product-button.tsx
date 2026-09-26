"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/lib/actions/admin/products.action";

export function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    if (!confirm("Delete this product? This can't be undone.")) return;

    startTransition(async () => {
      const result = await deleteProduct(productId);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="inline-flex flex-col items-end">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        aria-label="Delete product"
        className="text-slate-400 transition-colors duration-300 hover:text-red-500 disabled:opacity-50"
      >
        <Trash2 className="size-4" />
      </button>
      {error && <p className="mt-1 max-w-48 text-right text-[11px] text-red-600">{error}</p>}
    </div>
  );
}
