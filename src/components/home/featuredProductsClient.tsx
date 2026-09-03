"use client";

import ProductList from "../shared/product/productList";
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
  return (
    <section className="section-container overflow-hidden">
      <StaggerContainer staggerDelay={0.2}>
        {/* Animated Title */}
        <StaggerItem>
          <h2 className="font-clash-display text-2xl md:text-3xl lg:text-3xl text-blue font-bold mb-6 md:mb-8">
            <TextReveal text="Featured Products" />
          </h2>
        </StaggerItem>

        {/* Animated Product List */}
        <StaggerItem>
          <ProductList data={products} limit={4} />
        </StaggerItem>
      </StaggerContainer>
    </section>
  );
};

export default FeaturedProductsClient;
