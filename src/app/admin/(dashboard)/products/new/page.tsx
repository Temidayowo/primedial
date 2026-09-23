import type { Metadata } from "next";
import { getCategories, getBrands } from "@/lib/actions/products.action";
import { createProduct } from "@/lib/actions/admin/products.action";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = {
  title: "Add Product",
};

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([getCategories(), getBrands()]);

  return (
    <div>
      <h1 className="font-clash-display text-2xl font-bold text-blue md:text-3xl">
        Add Product
      </h1>
      <div className="mt-6">
        <ProductForm
          action={createProduct}
          categories={categories}
          brands={brands}
          submitLabel="Create Product"
        />
      </div>
    </div>
  );
}
