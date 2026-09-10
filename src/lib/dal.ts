import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/enums";
import { isSessionExpired } from "@/lib/session";

export const verifySession = cache(async () => {
  const session = await auth();

  if (!session?.user || isSessionExpired(session)) {
    redirect("/login");
  }

  return session;
});

// Re-checks the role against the database rather than trusting the JWT
// claim, so a demoted admin loses access immediately instead of waiting
// for their existing token to expire.
export const requireAdmin = cache(async () => {
  const session = await auth();

  if (!session?.user || isSessionExpired(session)) {
    redirect("/admin/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== Role.ADMIN) {
    redirect("/");
  }

  return session;
});
