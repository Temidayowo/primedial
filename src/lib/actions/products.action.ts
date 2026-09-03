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
      brand: true,
      category: true,
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
    brand: product.brand ?? "Unknown brand",
    price: Number(product.price),
  }));
}
