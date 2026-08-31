"use client";

import { useState } from "react";
import Link from "next/link";
import { FaCartShopping, FaUser } from "react-icons/fa6";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper function to close menu when a link is clicked
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* ===================================================== 
          DESKTOP HEADER
          ===================================================== */}
      <header className="hidden lg:block border-b border-gray-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-8 lg:px-12">
          <h1 className="text-3xl font-bold font-clash-display text-blue">
            Primedial
          </h1>
          <nav className="space-x-5 font-clash-display font-medium text-blue">
            <Link href="">Home</Link>
            <Link href="">About</Link>
            <Link href="">Shop</Link>
            <Link href="">Projects</Link>
            <Link href="">Contact</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaCartShopping className="text-blue size-5" />
              <div className="absolute -top-2 -right-2 bg-green text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-medium">
                3
              </div>
            </div>
            <FaUser className="text-blue size-5 cursor-pointer" />
          </div>
        </div>
      </header>

      {/* ===================================================== 
          MOBILE HEADER
          ===================================================== */}
      <header className="block lg:hidden border-b border-gray-200 relative bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <h1 className="text-2xl font-bold font-clash-display text-blue">
            Primedial
          </h1>

          {/* Right side: Cart & Hamburger Toggle */}
          <div className="flex items-center space-x-5">
            {/* Mobile Cart */}
            <div className="relative">
              <FaCartShopping className="text-blue size-5" />
              <div className="absolute -top-2 -right-2 bg-green text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-medium">
                3
              </div>
            </div>

            {/* Animated Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative w-10 h-10 flex items-center justify-center focus:outline-none"
              aria-label="Toggle Menu"
            >
              <div className="relative w-6 h-5">
                {/* Top Line */}
                <span
                  className={`absolute left-0 h-0.5 w-full bg-blue transform transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? "top-2 rotate-45" : "top-0"
                  }`}
                ></span>

                {/* Middle Line */}
                <span
                  className={`absolute left-0 top-2 h-0.5 w-full bg-blue transform transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? "opacity-0 translate-x-5" : "opacity-100"
                  }`}
                ></span>

                {/* Bottom Line */}
                <span
                  className={`absolute left-0 h-0.5 w-full bg-blue transform transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? "top-2 -rotate-45" : "top-4"
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl z-50 overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-100 opacity-100" : "max-h-0 opacity-0 border-transparent shadow-none"
          }`}
        >
          <nav className="flex flex-col space-y-4 px-6 py-6 font-clash-display font-medium text-blue">
            <Link href="/" onClick={closeMenu}>
              Home
            </Link>
            <Link href="/about" onClick={closeMenu}>
              About
            </Link>
            <Link href="/shop" onClick={closeMenu}>
              Shop
            </Link>
            <Link href="/projects" onClick={closeMenu}>
              Projects
            </Link>
            <Link href="/contact" onClick={closeMenu}>
              Contact
            </Link>

            <hr className="border-gray-100 my-2" />

            {/* Account / User Link inside the drawer for mobile */}
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