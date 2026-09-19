"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { FaArrowRight } from "react-icons/fa6";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { formatCurrency } from "@/lib/utils";
import type { FeaturedProduct } from "../shared/product/productList";
import {
  StaggerContainer,
  StaggerItem,
  TextReveal,
} from "@/components/ui/MotionWrapper";

const FeaturedProductsClient = ({
  products,
}: {
  products: FeaturedProduct[];
}) => {
  // Lazily created via useState (not useRef) so it isn't read during render -
  // the React Compiler forbids accessing ref.current at render time.
  const [plugin] = useState(() =>
    Autoplay({ delay: 3000, stopOnInteraction: true }),
  );

  if (products.length === 0) return null;

  return (
    <section className="w-full bg-gray-50 py-12 md:py-16 overflow-hidden">
      <StaggerContainer staggerDelay={0.2}>
        {/* Animated Title */}
        <StaggerItem>
          <h2 className="font-clash-display text-2xl md:text-3xl lg:text-3xl text-blue font-bold mb-6 px-6 md:px-8 lg:px-32">
            <TextReveal text="Featured Products" />
          </h2>
        </StaggerItem>

        {/* Never-ending autoplaying product slideshow */}
        <StaggerItem>
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[plugin]}
            className="w-full"
          >
            <CarouselContent>
              {products.map((product) => (
                <CarouselItem key={product.id}>
                  <div className="grid h-full grid-cols-1 items-center gap-8 p-6 md:grid-cols-2 md:gap-12 md:p-10 lg:px-32">
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 md:aspect-4/3">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(min-width: 768px) 45vw, 100vw"
                        className="object-cover object-center"
                        priority
                      />
                    </div>

                    <div className="flex flex-col items-start">
                      <span className="rounded-full bg-green/10 px-3 py-1 font-poppins text-xs font-semibold uppercase tracking-wide text-green">
                        {product.brand}
                      </span>
                      <h3 className="mt-4 font-clash-display text-2xl font-bold text-blue md:text-3xl">
                        {product.name}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm text-gray-600 md:text-base">
                        {product.description}
                      </p>
                      <p className="mt-4 font-poppins text-xl font-bold text-blue">
                        {formatCurrency(product.price)}
                      </p>
                      <Link
                        href={`/shop/${product.slug}`}
                        className="group mt-6 flex items-center gap-2 rounded-4xl bg-blue/95 px-8 py-3 text-sm font-semibold uppercase text-white transition-colors hover:bg-blue"
                      >
                        View Product
                        <FaArrowRight className="size-3 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {products.length > 1 && (
              <>
                <CarouselPrevious className="hidden lg:inline-flex left-8 z-10 h-10 w-10 bg-white/90 backdrop-blur hover:bg-white border shadow-md" />
                <CarouselNext className="hidden lg:inline-flex right-8 z-10 h-10 w-10 bg-white/90 backdrop-blur hover:bg-white border shadow-md" />
              </>
            )}
          </Carousel>
        </StaggerItem>

        <StaggerItem>
          <div className="mt-10 flex justify-center">
            <Link
              href="/shop"
              className="group flex items-center gap-2 rounded-4xl border border-blue bg-transparent px-8 py-3 text-sm font-semibold uppercase text-blue transition-colors hover:bg-blue hover:text-white"
            >
              Shop All Products
              <FaArrowRight className="size-3 transition-transform duration-300 ease-out group-hover:translate-x-1" />
            </Link>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </section>
  );
};

export default FeaturedProductsClient;
