import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { getAllProductsAdmin } from "@/lib/actions/admin/products.action";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { formatCurrency, cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Products",
};

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-clash-display text-2xl font-bold text-blue md:text-3xl">
            Products
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {products.length} {products.length === 1 ? "product" : "products"} total.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 rounded-lg bg-blue px-4 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-blue/90"
        >
          <Plus className="size-4" /> Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-gray-200 p-8 text-center">
          <p className="text-sm text-slate-500">No products yet.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-100 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-slate-400 uppercase">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Brand</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {product.images[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <span className="font-medium text-blue">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{product.category.name}</td>
                  <td className="px-4 py-3 text-slate-500">{product.brand.name}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                        product.inStock
                          ? "bg-green/10 text-green"
                          : "bg-red-50 text-red-600",
                      )}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/products/${product.id}`}
                        aria-label="Edit product"
                        className="text-slate-400 transition-colors duration-300 hover:text-blue"
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
