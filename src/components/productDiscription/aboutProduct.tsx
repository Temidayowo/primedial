"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { FaFileArrowDown } from "react-icons/fa6";
import { Check } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { Product } from "@/app/(site)/shop/productList";
import QuantitySelector from "../counter";
import { AddToCartButton } from "@/components/shared/product/add-to-cart-button";
import { formatCurrency, cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const AboutProduct = ({
  product,
}: {
  product: Pick<
    Product,
    | "id"
    | "name"
    | "images"
    | "category"
    | "price"
    | "description"
    | "features"
    | "specSheetUrl"
    | "inStock"
  >;
}) => {
  const [quantity, setQuantity] = useState(1);
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const images = product.images.length > 0 ? product.images : [];
  const features = (product.features ?? []).filter((f) => f.trim() !== "");

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  const handleThumbnailClick = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <section className="bg-gray-50">
      <div className="section-container grid grid-cols-1 gap-16 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Carousel
            setApi={setApi}
            opts={{ loop: true }}
            plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]}
            className="group"
          >
            <CarouselContent className="ml-0">
              {images.map((image, index) => (
                <CarouselItem key={image + index} className="pl-0">
                  <div className="bg-gray-100 relative aspect-square border-[0.1px] border-gray-300 rounded-xl overflow-hidden">
                    <Image
                      src={image}
                      alt={`${product.name} image ${index + 1}`}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 1 && (
              <>
                <CarouselPrevious className="left-4 z-10 h-10 w-10 bg-white/90 backdrop-blur hover:bg-white border shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
                <CarouselNext className="right-4 z-10 h-10 w-10 bg-white/90 backdrop-blur hover:bg-white border shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            )}
          </Carousel>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((image, index) => (
                <button
                  key={image + index}
                  type="button"
                  onClick={() => handleThumbnailClick(index)}
                  aria-label={`View image ${index + 1}`}
                  aria-current={selectedIndex === index}
                  className={cn(
                    "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                    selectedIndex === index
                      ? "border-blue"
                      : "border-transparent hover:border-gray-300"
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="uppercase text-green font-semibold font-clash-display ">
            {product.category}
          </h3>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-blue font-bold font-clash-display">
            {product.name}
          </h1>
          <h2 className="text-xl md:text-2xl lg:3xl font-semibold font-poppins">
            {formatCurrency(product.price)}
          </h2>
          <p className="text-gray-600">{product.description}</p>
          {features.length > 0 && (
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold font-clash-display text-lg text-blue">
                Key Features
              </h4>
              <ul className="flex flex-col gap-2">
                {features.map((feature, index) => (
                  <li
                    key={feature + index}
                    className="flex items-start gap-2.5 text-gray-600"
                  >
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-green/10 text-green">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex gap-6 items-center">
            {product.inStock && (
              <QuantitySelector value={quantity} onChange={setQuantity} />
            )}
            <AddToCartButton
              productId={product.id}
              inStock={product.inStock}
              quantity={quantity}
              className="flex-1 py-4 text-base rounded-2xl"
            />
          </div>
          {product.specSheetUrl && (
            <a
              href={product.specSheetUrl}
              // Browsers ignore `download` for other sites' files, so
              // external spec sheets open in a new tab instead.
              {...(product.specSheetUrl.startsWith("/")
                ? { download: true }
                : { target: "_blank", rel: "noopener noreferrer" })}
              className="inline-flex gap-1.5 py-4 items-center justify-center rounded-lg bg-transparent text-sm font-medium text-blue border border-blue duration-300 transition-colors hover:bg-blue/90 hover:text-white"
            >
              <FaFileArrowDown className="text-lg"></FaFileArrowDown>
              {product.specSheetUrl.startsWith("/") ? "Download Spec Sheet" : "View Spec Sheet"}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutProduct;
