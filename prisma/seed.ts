import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import {
  productBrands,
  productCategories,
  surveyingProducts,
} from "@/data/products";

const seedUsers = [
  {
    name: "Admin",
    email: "admin@primedialsolutions.com",
    password: "Admin123!",
    role: "ADMIN" as const,
  },
  {
    name: "Test User",
    email: "user@primedialsolutions.com",
    password: "User123!",
    role: "USER" as const,
  },
];

async function main() {
  console.log("Deleting Users...");
  await prisma.user.deleteMany();

  console.log("Seeding users...");
  for (const user of seedUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
      },
    });
  }

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
        specSheetUrl: product.specSheetUrl,
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
