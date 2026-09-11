"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { FaCartShopping, FaUser } from "react-icons/fa6";
import { cn } from "@/lib/utils"; // Adjust this import path to where your cn function lives
import { isSessionExpired } from "@/lib/session";
import { getCartCount } from "@/lib/actions/cart.action";
import { Role } from "@/generated/prisma/enums";

function CartBadge({ iconClassName }: { iconClassName: string }) {
  const { status } = useSession();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (status !== "authenticated") {
        setCount(0);
        return;
      }
      try {
        const next = await getCartCount();
        if (!cancelled) setCount(next);
      } catch {
        // A background badge refresh failing (stale action reference
        // after a dev-server restart, a network blip, etc.) shouldn't
        // crash the page - just leave the last known count showing.
      }
    }

    load();
    window.addEventListener("cart-updated", load);
    return () => {
      cancelled = true;
      window.removeEventListener("cart-updated", load);
    };
  }, [status]);

  return (
    <Link href="/cart" className="relative" aria-label="View cart">
      <FaCartShopping className={iconClassName} />
      {count > 0 && (
        <div className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-green text-[10px] font-light text-white font-poppins">
          {count > 9 ? "9+" : count}
        </div>
      )}
    </Link>
  );
}

function Avatar({
  name,
  image,
  size = 32,
}: {
  name?: string | null;
  image?: string | null;
  size?: number;
}) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name ?? "Account"}
        width={size}
        height={size}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  const initials =
    name
      ?.trim()
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-blue font-semibold text-white"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
}

function AccountMenu({ textColorClass }: { textColorClass: string }) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  if (status === "loading") {
    return <FaUser className={`${textColorClass} size-5`} />;
  }

  if (!session?.user || isSessionExpired(session)) {
    return (
      <Link href="/login" aria-label="Log in">
        <FaUser className={`${textColorClass} size-5 cursor-pointer`} />
      </Link>
    );
  }

  const firstName = session.user.name?.split(" ")[0] ?? "Account";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        className={`flex items-center gap-2 ${textColorClass}`}
      >
        <Avatar name={session.user.name} image={session.user.image} size={28} />
        <span className="text-sm font-medium">{firstName}</span>
      </button>

      {open && (
        <>
          <button
            aria-label="Close menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-full right-0 z-50 mt-3 w-56 rounded-lg border border-gray-100 bg-white py-2 text-blue shadow-xl">
            <p className="truncate px-4 py-2 text-xs text-slate-400">
              Signed in as {session.user.email}
            </p>
            <hr className="my-1 border-gray-100" />
            {session.user.role !== Role.ADMIN && (
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm hover:bg-gray-50"
              >
                My Account
              </Link>
            )}
            {session.user.role === Role.ADMIN && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm hover:bg-gray-50"
              >
                Admin Dashboard
              </Link>
            )}
            <button
              onClick={() => {
                setOpen(false);
                signOut({ redirectTo: "/" });
              }}
              className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
            >
              Log out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function MobileAccountLink({ closeMenu }: { closeMenu: () => void }) {
  const { data: session, status } = useSession();

  if (status !== "authenticated" || !session.user || isSessionExpired(session)) {
    return (
      <Link
        href="/login"
        onClick={closeMenu}
        className="flex items-center space-x-3 pt-2 text-left text-blue"
      >
        <FaUser className="size-5" />
        <span>Log In</span>
      </Link>
    );
  }

  return (
    <div className="pt-2">
      <div className="flex items-center gap-3">
        <Avatar name={session.user.name} image={session.user.image} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-blue">
            {session.user.name ?? "Account"}
          </p>
          <p className="truncate text-xs text-slate-400">
            {session.user.email}
          </p>
        </div>
      </div>
      {session.user.role !== Role.ADMIN && (
        <Link
          href="/account"
          onClick={closeMenu}
          className="mt-3 flex items-center space-x-3 text-left text-blue"
        >
          <span>My Account</span>
        </Link>
      )}
      {session.user.role === Role.ADMIN && (
        <Link
          href="/admin"
          onClick={closeMenu}
          className="mt-3 flex items-center space-x-3 text-left text-blue"
        >
          <span>Admin Dashboard</span>
        </Link>
      )}
      <button
        onClick={() => {
          closeMenu();
          signOut({ redirectTo: "/" });
        }}
        className="mt-3 flex items-center space-x-3 text-left text-blue"
      >
        <FaUser className="size-5" />
        <span>Log out</span>
      </button>
    </div>
  );
}

interface HeaderProps {
  theme: "light" | "dark";
  className?: string;
  mobileClassName?: string; 
}

const Header = ({ theme, className, mobileClassName }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const isDark = theme === "dark";
  const textColorClass = isDark ? "text-white" : "text-blue";
  const iconBackgroundClass = isDark ? "bg-white" : "bg-blue";
  const textHoverClass = isDark ? "hover:text-white/80" : "hover:text-blue/80";
  const underlineClass = isDark ? "after:bg-white" : "after:bg-blue";

  const animatedLinkClasses = `relative inline-block pb-1 ${textColorClass} transition-colors ${textHoverClass} after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 ${underlineClass} after:transition-all after:duration-300 after:content-[''] hover:after:w-full`;
  const mobileLinkClasses =
    "relative inline-block pb-1 text-blue transition-colors hover:text-blue/80 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue after:transition-all after:duration-300 after:content-[''] hover:after:w-full";

  return (
    <>
      {/* ===================================================== 
          DESKTOP HEADER
          ===================================================== */}
      {/* 
        We pass the base classes as the first argument to cn(). 
        The `className` prop comes second, meaning any bg or position 
        classes passed in will override 'bg-transparent' and 'absolute'. 
      */}
      <header
        className={cn(
          "hidden lg:block w-full z-100 top-0 left-0 bg-transparent absolute",
          className,
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-8 lg:px-12">
          <Link href="/">
            <Image
              src="/images/logo/primedial-logo.png"
              alt="Primedial Logo"
              width={359}
              height={247}
              className="w-auto h-10 xl:h-14"
              fetchPriority="high"
              priority
            />
          </Link>

          <nav className="space-x-5 font-clash-display font-medium">
            <Link href="/" className={animatedLinkClasses}>
              Home
            </Link>
            <Link href="/about" className={animatedLinkClasses}>
              About
            </Link>
            <Link href="/shop" className={animatedLinkClasses}>
              Shop
            </Link>
            <Link href="/services" className={animatedLinkClasses}>
              Services
            </Link>
            <Link href="/contact" className={animatedLinkClasses}>
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <CartBadge iconClassName={`${textColorClass} size-5`} />
            <AccountMenu textColorClass={textColorClass} />
          </div>
        </div>
      </header>

      {/* ===================================================== 
          MOBILE HEADER
          ===================================================== */}
      <header
        className={cn(
          "block lg:hidden border-b border-gray-200 bg-white relative z-[100]",
          mobileClassName,
          isMobileMenuOpen && "bg-white",
        )}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/">
            <Image
              src="/images/logo/primedial-logo.png"
              alt="Primedial Logo"
              width={359}
              height={247}
              className="w-auto h-10 sm:h-12"
              priority
              fetchPriority="high"
            />
          </Link>

          <div className="flex items-center space-x-5">
            <CartBadge
              iconClassName={cn(
                "size-5 transition-colors duration-300",
                isMobileMenuOpen ? "text-blue" : textColorClass,
              )}
            />

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative w-10 h-10 flex items-center justify-center focus:outline-none"
              aria-label="Toggle Menu"
            >
              <div className="relative w-6 h-5">
                <span
                  className={`absolute left-0 h-0.5 w-full transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "bg-blue top-2 rotate-45" : `${iconBackgroundClass} top-0`}`}
                ></span>
                <span
                  className={`absolute left-0 top-2 h-0.5 w-full transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "bg-blue opacity-0 translate-x-5" : `${iconBackgroundClass} opacity-100`}`}
                ></span>
                <span
                  className={`absolute left-0 h-0.5 w-full transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "bg-blue top-2 -rotate-45" : `${iconBackgroundClass} top-4`}`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        <div
          className={`absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl z-50 overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-100 opacity-100"
              : "max-h-0 opacity-0 border-transparent shadow-none"
          }`}
        >
          <nav className="flex flex-col space-y-4 px-6 py-6 font-clash-display font-medium text-blue">
            <Link href="/" onClick={closeMenu} className={mobileLinkClasses}>
              Home
            </Link>
            <Link
              href="/about"
              onClick={closeMenu}
              className={mobileLinkClasses}
            >
              About
            </Link>
            <Link
              href="/shop"
              onClick={closeMenu}
              className={mobileLinkClasses}
            >
              Shop
            </Link>
            <Link
              href="/services"
              onClick={closeMenu}
              className={mobileLinkClasses}
            >
              Services
            </Link>
            <Link
              href="/contact"
              onClick={closeMenu}
              className={mobileLinkClasses}
            >
              Contact
            </Link>
            <hr className="border-gray-100 my-2" />
            <MobileAccountLink closeMenu={closeMenu} />
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
