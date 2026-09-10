import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/enums";
import { isSessionExpired } from "@/lib/session";

// Re-checks that the user still exists in the database, not just that
// the JWT is validly signed and unexpired - a session can outlive its
// user (e.g. the row was deleted, or this database got reseeded, which
// wipes and recreates every user with fresh ids). Every mutation that
// trusts session.user.id as a foreign key (cart, addresses, payment
// methods, profile) goes through this, so this is the one place that
// needs to catch it instead of each of those throwing an unhandled
// foreign-key-constraint crash.
export const verifySession = cache(async () => {
  const session = await auth();

  if (!session?.user || isSessionExpired(session)) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true },
  });

  if (!user) {
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
