import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { Role } from "@/generated/prisma/enums";
import { isSessionExpired } from "@/lib/session";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth && !isSessionExpired(req.auth);
  const isAdmin = req.auth?.user?.role === Role.ADMIN;

  if (pathname === "/admin/login") {
    if (isLoggedIn && isAdmin) {
      return NextResponse.redirect(new URL("/admin", req.nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }

  if (!isAdmin) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
});

// This only covers optimistic, cookie-based checks - the /admin pages
// themselves still call requireAdmin() (see src/lib/dal.ts) for a
// secure, database-backed check close to the data.
export const config = {
  matcher: ["/admin/:path*"],
};
