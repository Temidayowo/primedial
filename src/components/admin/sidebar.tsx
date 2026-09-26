"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  BriefcaseBusiness,
  Handshake,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Package,
  Settings,
  Share2,
  ShoppingBag,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const storeItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
];

// Website sections edited as CMS content.
const contentItems = [
  { href: "/admin/projects", label: "Projects", icon: BriefcaseBusiness },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/partners", label: "Partners", icon: Handshake },
  { href: "/admin/socials", label: "Social Links", icon: Share2 },
  { href: "/admin/settings", label: "Contact Details", icon: Settings },
];

const navItems = [...storeItems, ...contentItems];

function isActiveHref(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile / tablet: horizontal scrollable tab bar */}
      <nav
        className="flex items-center gap-2 overflow-x-auto px-4 py-3 [-ms-overflow-style:none] scrollbar-none lg:hidden [&::-webkit-scrollbar]:hidden"
        aria-label="Admin navigation"
      >
        {navItems.map(({ href, label, icon: Icon }) => {
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
              {label}
            </Link>
          );
        })}

        <button
          onClick={() => signOut({ redirectTo: "/admin/login" })}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-gray-100 bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-slate-500 transition-colors hover:bg-gray-100 hover:text-blue"
        >
          <LogOut className="size-4 shrink-0" />
          Log Out
        </button>
      </nav>

      {/* Desktop: vertical sidebar */}
      <nav
        className="hidden h-full flex-col gap-1 p-4 lg:flex"
        aria-label="Admin navigation"
      >
        {storeItems.map(({ href, label, icon: Icon }) => {
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

        <p className="mt-4 mb-1 px-4 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Content
        </p>
        {contentItems.map(({ href, label, icon: Icon }) => {
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
          onClick={() => signOut({ redirectTo: "/admin/login" })}
          className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium text-slate-500 transition-colors hover:bg-gray-100 hover:text-blue"
        >
          <LogOut className="size-4 shrink-0" />
          Log Out
        </button>
      </nav>
    </>
  );
}
