"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

// Login (and the admin login) run through a Server Action that calls
// Auth.js's server-side signIn({ redirectTo }) - it sets the session
// cookie and does a soft RSC navigation back to "/" (or "/admin"), not a
// full page reload. next-auth/react's SessionProvider only refetches on
// mount, on window focus/visibility change, or when its own client-side
// signIn()/signOut() broadcast a change - a server-action sign-in does
// none of those, so useSession() (e.g. in Header) kept showing the
// stale "logged out" state until something else (a reload, a tab
// switch) happened to trigger a refetch.
//
// Every sign-in flow physically passes through one of these three pages
// right before landing the user somewhere else, so only refetch when
// *leaving* one of them - not on every navigation in the app. That keeps
// the fix to one extra (cheap: JWT decode, no DB query) request per sign-in
// instead of one per page view, which matters once real traffic shows up.
const AUTH_PAGES = new Set(["/login", "/admin/login", "/auth/post-signin"]);

export function SessionSync() {
  const pathname = usePathname();
  const { update } = useSession();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    const previous = previousPathname.current;
    previousPathname.current = pathname;
    if (previous !== pathname && AUTH_PAGES.has(previous)) {
      update();
    }
  }, [pathname, update]);

  return null;
}
