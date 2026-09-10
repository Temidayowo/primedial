import "server-only";
import { prisma } from "@/lib/prisma";

export class RateLimitError extends Error {
  constructor(message = "Too many attempts. Please try again later.") {
    super(message);
    this.name = "RateLimitError";
  }
}

/**
 * Fixed-window rate limiter backed by Postgres (see the RateLimitAttempt
 * model) so it works correctly across serverless instances, unlike an
 * in-memory counter. Uses a single atomic upsert (ON CONFLICT DO UPDATE)
 * to avoid a read-then-write race between concurrent requests.
 *
 * Returns true if the call is allowed, false if the limit was hit.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
) {
  const newResetAt = new Date(Date.now() + windowMs);

  const rows = await prisma.$queryRaw<{ count: number }[]>`
    INSERT INTO "RateLimitAttempt" ("key", "count", "resetAt")
    VALUES (${key}, 1, ${newResetAt})
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE
        WHEN "RateLimitAttempt"."resetAt" < now() THEN 1
        ELSE "RateLimitAttempt"."count" + 1
      END,
      "resetAt" = CASE
        WHEN "RateLimitAttempt"."resetAt" < now() THEN ${newResetAt}
        ELSE "RateLimitAttempt"."resetAt"
      END
    RETURNING "count"
  `;

  const count = rows[0]?.count ?? 1;
  return count <= limit;
}

// Throws RateLimitError instead of returning a boolean, for call sites
// that want to short-circuit with a plain `await` rather than an `if`.
export async function assertRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  message?: string,
) {
  const allowed = await checkRateLimit(key, limit, windowMs);
  if (!allowed) {
    throw new RateLimitError(message);
  }
}
