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
  { href: "/account", label: "Dashboard Overview", icon: LayoutDashboard },
  { href: "/account/orders", label: "Order History", icon: Package },
  { href: "/account/addresses", label: "Saved Addresses", icon: MapPin },
  { href: "/account/payment-methods", label: "Payment Methods", icon: CreditCard },
  { href: "/account/settings", label: "Profile Settings", icon: Settings },
];

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col gap-1 p-4">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === "/account" ? pathname === href : pathname.startsWith(href);

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
  );
}
