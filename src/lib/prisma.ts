import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

// HTTP driver, not the WebSocket Pool - each query is its own fetch, so
// there's no persistent connection that can go stale while this process
// sits idle (a dev server survives many HMR cycles; a serverless
// instance sits idle between invocations). The WS Pool did exactly
// that: queries started hanging indefinitely instead of erroring once
// its connection had gone dead, which froze "Place Order" on a stuck
// spinner. Every $transaction in this codebase is the sequential array
// form, which the HTTP driver supports fine - nothing here needs an
// interactive transaction, which is the one thing this driver can't do.
const adapter = new PrismaNeonHttp(process.env.DATABASE_URL!, {});

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
