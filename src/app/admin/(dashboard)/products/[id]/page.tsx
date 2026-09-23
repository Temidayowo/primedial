import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getBrands } from "@/lib/actions/products.action";
import { getProductByIdAdmin, updateProduct } from "@/lib/actions/admin/products.action";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = {
  title: "Edit Product",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories, brands] = await Promise.all([
    getProductByIdAdmin(id),
    getCategories(),
    getBrands(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-clash-display text-2xl font-bold text-blue md:text-3xl">
        Edit Product
      </h1>
      <div className="mt-6">
        <ProductForm
          action={updateProduct.bind(null, id)}
          product={product}
          categories={categories}
          brands={brands}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
