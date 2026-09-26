import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

// HTTP driver, not the WebSocket Pool - each query is its own fetch, so
// there's no persistent connection that can go stale while this process
// sits idle (a dev server survives many HMR cycles; a serverless
// instance sits idle between invocations). The WS Pool did exactly
// that: queries started hanging indefinitely instead of erroring once
// its connection had gone dead, which froze "Place Order" on a stuck
// spinner.
//
// Trade-off: this driver can't run transactions AT ALL - not
// interactive ones, not the $transaction([...]) array form, and not the
// implicit transaction Prisma uses for nested writes like
// `items: { create: [...] }`. All fail with "Transactions are not
// supported in HTTP mode". Write multi-step changes as separate queries
// (see createPendingOrder and markOrderPaidByReference for the patterns).
const adapter = new PrismaNeonHttp(process.env.DATABASE_URL!, {});

// In dev the client is cached on globalThis so hot reloads don't create a
// new one each time. The PrismaClient class it came from is cached too:
// running `prisma generate` (e.g. after a migration adds a model) reloads
// the generated module with a new class, and a client built from the old
// class wouldn't have the new models - every query on them would crash
// with "Cannot read properties of undefined (reading 'findMany')" until
// the dev server was restarted. Comparing classes swaps the client instead.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaClientClass?: typeof PrismaClient;
};

const cachedClient =
  globalForPrisma.prismaClientClass === PrismaClient ? globalForPrisma.prisma : undefined;

export const prisma = cachedClient ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaClientClass = PrismaClient;
}
