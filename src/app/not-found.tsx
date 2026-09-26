import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowRight, FaHouse } from "react-icons/fa6";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist or has moved.",
};

const popularLinks = [
  { href: "/shop", label: "Shop Equipment" },
  { href: "/services", label: "Our Services" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <>
      <Header
        theme="light"
        className="relative border-b border-gray-100 bg-white"
        mobileClassName="bg-white"
      />
      <section className="section-container flex min-h-[70vh] flex-col items-center justify-center text-center">
        {/* <div className="flex size-20 items-center justify-center rounded-full bg-green/10">
          <FaCompassDrafting className="size-9 text-green" />
        </div> */}

        <h1 className="mt-8 font-clash-display text-7xl font-bold text-blue md:text-8xl">
          404
        </h1>
        <h2 className="mt-4 font-clash-display text-2xl font-semibold text-blue md:text-3xl">
          Looks like you&apos;ve gone off the map
        </h2>
        <p className="mt-3 max-w-md text-sm text-gray-500 md:text-base">
          We couldn&apos;t find the page you were looking for. It may have
          been moved, renamed, or never existed.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/"
            className="group flex items-center justify-center gap-2 rounded-4xl bg-blue/95 px-8 py-3 text-sm font-semibold uppercase text-white transition-colors duration-300 hover:bg-blue"
          >
            <FaHouse className="size-3.5" />
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="group flex items-center justify-center gap-2 rounded-4xl border border-blue bg-transparent px-8 py-3 text-sm font-semibold uppercase text-blue transition-colors duration-300 hover:bg-blue hover:text-white"
          >
            Browse Shop
            <FaArrowRight className="size-3 transition-transform duration-300 ease-out group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {popularLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative inline-block pb-1 text-sm font-medium text-gray-500 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue after:transition-all after:duration-300 after:content-[''] hover:text-blue hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
