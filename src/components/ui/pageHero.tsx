"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Import your cn utility here

interface PageHeroProps {
  heading: string;
  subheading: string;
  breadcrumb: string;
  backgroundImage?: string;
  className?: string; // Allows custom padding, margins, or background overrides
  align?: "left" | "center" | "right"; // Controls text alignment and auto-margins
}

export function PageHero({
  heading,
  subheading,
  breadcrumb,
  backgroundImage,
  className,
  align = "center", // Defaults to center if not provided
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden py-32", // Default padding
        align === "center" && "text-center",
        align === "left" && "text-left",
        align === "right" && "text-right",
        !backgroundImage && "page-hero",
        className // User-passed styles merge and override defaults here
      )}
    >
      {backgroundImage && (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-blue mix-blend-multiply opacity-80" />
        </>
      )}
      <div className="relative container-custom">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "font-poppins font-medium text-white text-xs uppercase tracking-widest mb-1",
            align === "center" && "mx-auto",
            align === "right" && "ml-auto"
          )}
        >
          {breadcrumb}
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "max-w-3xl font-clash-display text-3xl font-bold text-white sm:text-4xl md:text-5xl",
            align === "center" && "mx-auto",
            align === "right" && "ml-auto"
          )}
        >
          {heading}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "font-poppins text-gray-400 mt-4 max-w-2xl",
            align === "center" && "mx-auto",
            align === "right" && "ml-auto"
          )}
        >
          {subheading}
        </motion.p>
      </div>
    </section>
  );
}