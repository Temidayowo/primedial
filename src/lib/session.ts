import type { Session } from "next-auth";

// Kept dependency-free (no prisma, no "server-only") so it can be
// imported from both src/proxy.ts (Edge runtime) and src/lib/dal.ts
// (Node runtime) without pulling either into the wrong bundle.
export function isSessionExpired(session: Session | null | undefined) {
  if (!session?.rememberUntil) {
    return false;
  }
  return Date.now() > session.rememberUntil;
}
