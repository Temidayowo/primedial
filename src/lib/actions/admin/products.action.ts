"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";
import { isUuid } from "@/lib/uuid";

export async function getAllProductsAdmin() {
  await requireAdmin();

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      brand: { select: { name: true } },
      _count: { select: { orderItems: true } },
    },
  });

  return products.map((product) => ({
    ...product,
    price: Number(product.price),
  }));
}

export async function getProductByIdAdmin(id: string) {
  await requireAdmin();
  if (!isUuid(id)) return null;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return null;

  return { ...product, price: Number(product.price) };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Blank input -> null (so an admin can clear a value), otherwise a positive number.
const optionalDimension = (label: string) =>
  z.preprocess(
    (v) => (v === null || v === undefined || String(v).trim() === "" ? null : v),
    z.coerce.number().positive({ error: `${label} must be greater than 0.` }).nullable(),
  );

const productSchema = z.object({
  name: z.string().min(2, { error: "Name is required." }).trim(),
  description: z.string().min(10, { error: "Description is required." }).trim(),
  price: z.coerce.number().positive({ error: "Price must be greater than 0." }),
  categoryId: z.string().min(1, { error: "Category is required." }),
  brandId: z.string().min(1, { error: "Brand is required." }),
  images: z
    .array(z.string().trim().min(1))
    .min(1, { error: "At least one image is required." }),
  features: z.array(z.string().trim().min(1)).default([]),
  specSheetUrl: z.string().trim().optional(),
  weightKg: optionalDimension("Weight"),
  lengthCm: optionalDimension("Length"),
  widthCm: optionalDimension("Width"),
  heightCm: optionalDimension("Height"),
  inStock: z.coerce.boolean().default(true),
  isFeatured: z.coerce.boolean().default(false),
});

export type ProductFormState =
  | { errors?: Record<string, string[]>; message?: string }
  | undefined;

function parseProductFormData(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    categoryId: formData.get("categoryId"),
    brandId: formData.get("brandId"),
    images: formData.getAll("images").filter((v) => String(v).trim().length > 0),
    features: formData.getAll("features").filter((v) => String(v).trim().length > 0),
    specSheetUrl: formData.get("specSheetUrl") || undefined,
    weightKg: formData.get("weightKg"),
    lengthCm: formData.get("lengthCm"),
    widthCm: formData.get("widthCm"),
    heightCm: formData.get("heightCm"),
    inStock: formData.get("inStock") === "on",
    isFeatured: formData.get("isFeatured") === "on",
  });
}

export async function createProduct(
  prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const validated = parseProductFormData(formData);
  if (!validated.success) {
    return { errors: z.flattenError(validated.error).fieldErrors };
  }

  const baseSlug = slugify(validated.data.name);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++suffix}`;
  }

  await prisma.product.create({
    data: { ...validated.data, slug },
  });

  revalidateProductPages();
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const validated = parseProductFormData(formData);
  if (!validated.success) {
    return { errors: z.flattenError(validated.error).fieldErrors };
  }

  await prisma.product.update({
    where: { id },
    data: validated.data,
  });

  revalidateProductPages();
  revalidatePath(`/admin/products/${id}`);
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();

  const orderItemCount = await prisma.orderItem.count({ where: { productId: id } });
  if (orderItemCount > 0) {
    return {
      error:
        "This product is part of an existing order and can't be deleted - mark it out of stock instead.",
    };
  }

  await prisma.product.delete({ where: { id } });
  revalidateProductPages();
  return { error: null };
}

// The home page is prerendered and shows featured products, so it has to
// be refreshed whenever a product changes. /shop and product pages render
// on each request and pick changes up by themselves.
function revalidateProductPages() {
  revalidatePath("/admin/products");
  revalidatePath("/");
}
