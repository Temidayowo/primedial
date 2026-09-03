import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import {
  productBrands,
  productCategories,
  surveyingProducts,
} from "@/data/products";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Clearing existing products...");
  await prisma.product.deleteMany();

  console.log("Seeding categories...");
  for (const category of productCategories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log("Seeding brands...");
  for (const brand of productBrands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: brand,
    });
  }

  console.log("Seeding products...");
  for (const product of surveyingProducts) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: product.category },
    });
    const brand = await prisma.brand.findUniqueOrThrow({
      where: { slug: product.brand },
    });

    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        images: product.images,
        features: product.features,
        inStock: product.inStock,
        isFeatured: product.isFeatured ?? false,
        categoryId: category.id,
        brandId: brand.id,
      },
    });
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
