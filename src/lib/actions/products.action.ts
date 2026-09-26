"use server";

import { prisma } from "@/lib/prisma";
import { PRODUCTS_PER_PAGE } from "@/lib/pagination";

// Get Featured Products
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: {
      isFeatured: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      brand: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          slug: true,
        },
      },
      images: true,
      description: true,
      inStock: true,
      features: true,
      specSheetUrl: true,
      price: true,
      isFeatured: true,
      createdAt: true,
    },
  });
  return data.map((product) => ({
    ...product,
    brand: product.brand.name,
    category: product.category.slug,
    specSheetUrl: product.specSheetUrl ?? undefined,
    price: Number(product.price),
  }));
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });
}

export async function getBrands() {
  return prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });
}

// One page of the shop, filtered and sorted. `page` is clamped to the
// last page, so a stale or hand-edited ?page= still shows products.
export async function getProducts(
  categories?: string[],
  brands?: string[],
  sort?: string,
  page = 1,
) {
  const where = {
    ...(categories &&
      categories.length > 0 && {
        category: { slug: { in: categories } },
      }),
    ...(brands &&
      brands.length > 0 && {
        brand: { slug: { in: brands } },
      }),
  };

  const total = await prisma.product.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE));
  const currentPage = Math.min(Math.max(1, Math.trunc(page) || 1), pageCount);

  const products = await prisma.product.findMany({
    where,
    // The id tie-breaker keeps the order stable between pages - without
    // it, products with the same price (or created in the same instant)
    // could repeat on one page and be skipped on the next.
    orderBy: [
      sort === "price-asc"
        ? { price: "asc" as const }
        : sort === "price-desc"
          ? { price: "desc" as const }
          : { createdAt: "desc" as const },
      { id: "asc" as const },
    ],
    skip: (currentPage - 1) * PRODUCTS_PER_PAGE,
    take: PRODUCTS_PER_PAGE,
    select: {
      id: true,
      name: true,
      slug: true,
      brand: { select: { name: true } },
      category: { select: { slug: true } },
      images: true,
      description: true,
      inStock: true,
      features: true,
      specSheetUrl: true,
      price: true,
      isFeatured: true,
      createdAt: true,
    },
  });

  return {
    products: products.map((product) => ({
      ...product,
      brand: product.brand.name,
      category: product.category.slug,
      specSheetUrl: product.specSheetUrl ?? undefined,
      price: Number(product.price),
    })),
    total,
    page: currentPage,
    pageCount,
    pageSize: PRODUCTS_PER_PAGE,
  };
}

export async function getProductsBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug: slug },
    select: {
      id: true,
      name: true,
      slug: true,
      brand: { select: { name: true } },
      category: { select: { slug: true } },
      images: true,
      description: true,
      inStock: true,
      features: true,
      specSheetUrl: true,
      price: true,
      isFeatured: true,
      createdAt: true,
    },
  });

  if (!product) return null;

  return {
    ...product,
    brand: product.brand.name,
    category: product.category.slug,
    specSheetUrl: product.specSheetUrl ?? undefined,
    price: Number(product.price),
  };
}
