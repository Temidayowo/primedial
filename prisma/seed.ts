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
        emailVerified: new Date(),
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

  console.log("Seeding account dashboard demo data...");
  const testUser = await prisma.user.findUniqueOrThrow({
    where: { email: "user@primedialsolutions.com" },
  });

  const homeAddress = await prisma.address.create({
    data: {
      userId: testUser.id,
      label: "Office",
      fullName: "Test User",
      line1: "42 Surveyor's Row",
      city: "Lagos",
      state: "Lagos",
      postalCode: "100001",
      country: "Nigeria",
      phone: "+234 800 000 0000",
      isDefault: true,
    },
  });

  await prisma.paymentMethod.create({
    data: {
      userId: testUser.id,
      brand: "Visa",
      last4: "4242",
      expiryMonth: 11,
      expiryYear: 2028,
      isDefault: true,
    },
  });

  const demoOrders: {
    daysAgo: number;
    status: "DELIVERED" | "SHIPPED" | "PROCESSING";
    productSlugs: string[];
  }[] = [
    { daysAgo: 21, status: "DELIVERED", productSlugs: ["leica-ls15-digital-level"] },
    { daysAgo: 6, status: "SHIPPED", productSlugs: ["trimble-r12i-gnss"] },
    {
      daysAgo: 1,
      status: "PROCESSING",
      productSlugs: ["dji-matrice-350-rtk", "faro-focus-premium"],
    },
  ];

  for (const [index, demoOrder] of demoOrders.entries()) {
    const products = await prisma.product.findMany({
      where: { slug: { in: demoOrder.productSlugs } },
    });

    const total = products.reduce(
      (sum, product) => sum + Number(product.price),
      0,
    );

    const createdAt = new Date(
      Date.now() - demoOrder.daysAgo * 24 * 60 * 60 * 1000,
    );

    await prisma.order.create({
      data: {
        orderNumber: `PDS-${createdAt.getFullYear()}-${String(index + 1).padStart(5, "0")}`,
        status: demoOrder.status,
        total,
        createdAt,
        userId: testUser.id,
        shippingAddressId: homeAddress.id,
        items: {
          create: products.map((product) => ({
            productId: product.id,
            quantity: 1,
            price: product.price,
          })),
        },
      },
    });
  }

  console.log("Seeding cart demo data...");
  const cartProductSlugs: { slug: string; quantity: number }[] = [
    { slug: "leica-ts16-robotic-total-station", quantity: 1 },
    { slug: "heavy-duty-wood-tripod", quantity: 2 },
  ];

  for (const { slug, quantity } of cartProductSlugs) {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) continue;

    await prisma.cartItem.upsert({
      where: { userId_productId: { userId: testUser.id, productId: product.id } },
      update: { quantity },
      create: { userId: testUser.id, productId: product.id, quantity },
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
