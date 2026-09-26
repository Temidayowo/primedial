"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  BriefcaseBusiness,
  Handshake,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Package,
  Settings,
  Share2,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Store",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
      { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
    ],
  },
  {
    // Website sections edited as CMS content.
    label: "Content",
    items: [
      { href: "/admin/projects", label: "Projects", icon: BriefcaseBusiness },
      { href: "/admin/team", label: "Team", icon: Users },
      { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { href: "/admin/partners", label: "Partners", icon: Handshake },
      { href: "/admin/socials", label: "Social Links", icon: Share2 },
      { href: "/admin/settings", label: "Contact Details", icon: Settings },
    ],
  },
];

function isActiveHref(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

// The grouped links + log out, shared by the desktop sidebar and the
// mobile menu. onNavigate lets the mobile menu close itself on a tap.
function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {navGroups.map((group, index) => (
        <div key={group.label} className={cn(index > 0 && "mt-4")}>
          <p className="mb-1 px-4 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            {group.label}
          </p>
          <div className="flex flex-col gap-1">
            {group.items.map(({ href, label, icon: Icon }) => {
              const isActive = isActiveHref(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-300",
                    isActive
                      ? "bg-blue text-white"
                      : "text-slate-500 hover:bg-gray-100 hover:text-blue",
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      <div className="my-3 border-t border-gray-100" />

      <button
        type="button"
        onClick={() => signOut({ redirectTo: "/admin/login" })}
        className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium text-slate-500 transition-colors duration-300 hover:bg-gray-100 hover:text-blue"
      >
        <LogOut className="size-4 shrink-0" />
        Log Out
      </button>
    </>
  );
}

// Desktop (lg and up): always-visible sidebar.
export function AdminSidebar() {
  return (
    <nav className="hidden h-full flex-col p-4 lg:flex" aria-label="Admin navigation">
      <NavLinks />
    </nav>
  );
}

// Below lg: hamburger button in the header that opens a slide-in menu.
export function AdminMobileNav({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    menuButtonRef.current?.focus();
  };

  // While open: lock page scroll, close on Escape, and move focus into
  // the menu so keyboard users land on it.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={menuButtonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="admin-mobile-menu"
        className="flex size-9 items-center justify-center rounded-lg text-blue transition-colors duration-300 hover:bg-gray-100"
      >
        <Menu className="size-5" />
      </button>

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={close}
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/40 transition-opacity duration-200",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Slide-in panel. Kept mounted so it can animate; `inert` removes
          it from tab order and screen readers while closed. */}
      <div
        id="admin-mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Admin menu"
        inert={!open}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-white transition-transform duration-200 ease-out",
          open ? "translate-x-0 shadow-xl" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
          <p className="flex items-center gap-2 font-clash-display text-base font-bold text-blue">
            Prime Dial
            <AdminBadge />
          </p>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors duration-300 hover:bg-gray-100 hover:text-blue"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3" aria-label="Admin navigation">
          <NavLinks onNavigate={() => setOpen(false)} />
        </nav>

        <p className="truncate border-t border-gray-100 px-4 py-3 text-xs text-slate-400">
          Signed in as {email}
        </p>
      </div>
    </div>
  );
}

// Small "Admin" label shown next to the brand name.
export function AdminBadge() {
  return (
    <span className="shrink-0 rounded-full bg-blue/10 px-2 py-0.5 font-poppins text-[11px] font-semibold tracking-wide text-blue uppercase">
      Admin
    </span>
  );
}
