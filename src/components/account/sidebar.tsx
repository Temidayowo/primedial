"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/account",
    label: "Dashboard Overview",
    shortLabel: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/account/orders",
    label: "Order History",
    shortLabel: "Orders",
    icon: Package,
  },
  {
    href: "/account/addresses",
    label: "Saved Addresses",
    shortLabel: "Addresses",
    icon: MapPin,
  },
  {
    href: "/account/payment-methods",
    label: "Payment Methods",
    shortLabel: "Payment",
    icon: CreditCard,
  },
  {
    href: "/account/settings",
    label: "Profile Settings",
    shortLabel: "Settings",
    icon: Settings,
  },
];

function isActiveHref(pathname: string, href: string) {
  return href === "/account" ? pathname === href : pathname.startsWith(href);
}

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile / tablet: horizontal scrollable tab bar */}
      <nav
        className="flex items-center gap-2 overflow-x-auto px-4 py-3 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
        aria-label="Account navigation"
      >
        {navItems.map(({ href, shortLabel, icon: Icon }) => {
          const isActive = isActiveHref(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                isActive
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-gray-100 bg-white text-slate-500 hover:bg-gray-100 hover:text-blue",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {shortLabel}
            </Link>
          );
        })}

        <button
          onClick={() => signOut({ redirectTo: "/" })}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-gray-100 bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-slate-500 transition-colors hover:bg-gray-100 hover:text-blue"
        >
          <LogOut className="size-4 shrink-0" />
          Log Out
        </button>
      </nav>

      {/* Desktop: vertical sidebar */}
      <nav
        className="hidden h-full flex-col gap-1 p-4 lg:flex"
        aria-label="Account navigation"
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = isActiveHref(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-slate-500 hover:bg-gray-100 hover:text-blue",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          );
        })}

        <div className="my-2 border-t border-gray-100" />

        <button
          onClick={() => signOut({ redirectTo: "/" })}
          className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium text-slate-500 transition-colors hover:bg-gray-100 hover:text-blue"
        >
          <LogOut className="size-4 shrink-0" />
          Log Out
        </button>
      </nav>
    </>
  );
}
