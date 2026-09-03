"use server";

import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

// Get Featured Products
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: {
      isFeatured: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
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
      price: true,
      isFeatured: true,
      createdAt: true,
    },
  });
  return data.map((product) => ({
    ...product,
    brand: product.brand.name,
    category: product.category.slug,
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

export async function getProducts(
  categories?: string[],
  brands?: string[],
  sort?: string,
) {
  const products = await prisma.product.findMany({
    where: {
      ...(categories &&
        categories.length > 0 && {
          category: { slug: { in: categories } },
        }),
      ...(brands &&
        brands.length > 0 && {
          brand: { slug: { in: brands } },
        }),
    },
    orderBy:
      sort === "price-asc"
        ? { price: "asc" }
        : sort === "price-desc"
          ? { price: "desc" }
          : { createdAt: "desc" },
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
      price: true,
      isFeatured: true,
      createdAt: true,
    },
  });

  return products.map((product) => ({
    ...product,
    brand: product.brand.name,
    category: product.category.slug,
    price: Number(product.price),
  }));
}
