import "server-only";
import { prisma } from "@/lib/prisma";

// Server-only (not a "use server" action): anything exported from an
// action file can be called from a browser with any arguments, and this
// takes a userId.
export async function getCart(userId: string) {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: { product: true },
  });

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  return { items, subtotal };
}
