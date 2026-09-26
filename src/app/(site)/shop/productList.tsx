import Link from "next/link";
import ProductCard from "@/components/shared/product/productCard";
import SortDropdown from "@/components/sortDropdown";
import {
  AnimateOnScroll,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/MotionWrapper";

// 1. The Core Product Interface
export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  images: string[];
  features: string[];
  specSheetUrl?: string;
  inStock: boolean;
  isFeatured: boolean;
  createdAt: Date;
}

// 2. Interface if your component expects the FULL ARRAY (e.g., a ProductGrid)
export interface ProductGridProps {
  data: Product[];
  // All products matching the filters, across every page.
  total: number;
  // 1-based position of the first product on this page.
  firstIndex: number;
}

// 3. Interface if your component expects a SINGLE ITEM (e.g., a ProductCard)
export interface ProductCardProps {
  product: Product;
}

const ProductList = ({ data, total, firstIndex }: ProductGridProps) => {
  const lastIndex = firstIndex + data.length - 1;

  return (
    <div>
      <div className="flex justify-between items-center gap-4">
        <p className="text-sm text-gray-500">
          {total > data.length ? (
            <>
              Showing <span className="text-blue">{firstIndex}–{lastIndex}</span> of{" "}
              <span className="text-blue">{total}</span> products
            </>
          ) : (
            <>
              <span className="text-blue">{total}</span> {total === 1 ? "product" : "products"} found
            </>
          )}
        </p>
        <SortDropdown />
      </div>
      <StaggerContainer className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((product) => (
          <StaggerItem key={product.id}>
            <ProductCard product={product} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
};

// Shown under the product grid and its page controls.
export const ServiceCenterBanner = () => (
  <AnimateOnScroll>
    <Link
      href="/services#request-service"
      className="mt-10 flex flex-col items-center gap-1 rounded-xl border-[0.1px] border-gray-300 bg-white px-6 py-6 text-center transition-colors duration-300 hover:border-blue"
    >
      <p className="font-clash-display text-sm font-semibold text-blue">
        Need a repair or calibration instead?
      </p>
      <p className="text-xs font-medium text-gray-500">Visit the Service Center →</p>
    </Link>
  </AnimateOnScroll>
);

export default ProductList;
