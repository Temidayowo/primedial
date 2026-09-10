import type { Session } from "next-auth";

// Kept dependency-free (no prisma, no "server-only") so it can be
// imported from src/proxy.ts (Edge runtime), src/lib/dal.ts (Node
// runtime), AND client components (e.g. the header's account menu)
// without pulling any of them into the wrong bundle.
export function isSessionExpired(session: Session | null | undefined) {
  if (!session?.rememberUntil) {
    return false;
  }
  return Date.now() > session.rememberUntil;
}
