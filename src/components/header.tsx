"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaCartShopping, FaUser } from "react-icons/fa6";
import { cn } from "@/lib/utils"; // Adjust this import path to where your cn function lives

interface HeaderProps {
  theme: "light" | "dark";
  className?: string; // Used to pass bg and position for Desktop
  mobileClassName?: string; // Used to pass bg and position for Mobile
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
          "hidden lg:block w-full z-[100] top-0 left-0 bg-transparent absolute",
          className,
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-8 lg:px-12">
          <Link href="/">
            <Image
              src="/images/logo/primedial-logo.png"
              alt="Primedial Logo"
              width={300}
              height={90}
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
            <div className="relative">
              <FaCartShopping className={`${textColorClass} size-5`} />
              <div className="absolute -top-2 -right-2 bg-green text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-light font-poppins">
                3
              </div>
            </div>
            <FaUser className={`${textColorClass} size-5 cursor-pointer`} />
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
              width={200}
              height={60}
              className="w-auto h-10 sm:h-12"
              priority
              fetchPriority="high"
            />
          </Link>

          <div className="flex items-center space-x-5">
            <div className="relative">
              <FaCartShopping
                className={cn(
                  "size-5 transition-colors duration-300",
                  isMobileMenuOpen ? "text-blue" : textColorClass,
                )}
              />
              <div className="absolute -top-2 -right-2 bg-green text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-medium">
                3
              </div>
            </div>

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
            <button
              onClick={closeMenu}
              className="flex items-center space-x-3 pt-2 text-blue text-left"
            >
              <FaUser className="size-5" />
              <span>My Account</span>
            </button>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
