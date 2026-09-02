"use client";

import { Fragment } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface PageHeroProps {
  heading: string;
  subheading: string;
  breadcrumb: string;
  backgroundImage?: string;
}

function renderHeading(text: string) {
  // Supports {highlight}text{/highlight} syntax for gradient-colored text
  const parts = text.split(/\{highlight\}|\{\/highlight\}/);
  if (parts.length === 1) return <>{text}</>;

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span
            key={i}
            className="bg-linear-to-r from-electric to-cyan bg-clip-text text-transparent"
          >
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

export function PageHero({
  heading,
  subheading,
  breadcrumb,
  backgroundImage,
}: PageHeroProps) {
  return (
    <section
      className={`relative overflow-hidden py-20 md:py-16 text-center ${!backgroundImage ? "page-hero" : ""}`}
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
            /* Removed the style/filter prop entirely */
          />
          {/* Replaced the old bg-midnight div with your exact hex and a blend mode */}
          <div className="absolute inset-0 bg-blue mix-blend-multiply opacity-80" />
        </>
      )}
      <div className="relative container-custom">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-poppins font-medium text-white text-xs uppercase tracking-widest text-electric mb-1"
        >
          {breadcrumb}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto max-w-3xl font-clash-display text-3xl font-bold text-white sm:text-4xl md:text-5xl"
        >
          {renderHeading(heading)}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto font-poppins text-gray-300 mt-4 max-w-2xl text-navy-200"
        >
          {subheading}
        </motion.p>
      </div>
    </section>
  );
}