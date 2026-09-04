import ProductCard from "@/components/shared/product/productCard";
import SortDropdown from "@/components/sortDropdown";

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
  specSheetURl?: string;
  inStock: boolean;
  isFeatured: boolean;
  createdAt: Date;
}

// 2. Interface if your component expects the FULL ARRAY (e.g., a ProductGrid)
export interface ProductGridProps {
  data: Product[];
}

// 3. Interface if your component expects a SINGLE ITEM (e.g., a ProductCard)
export interface ProductCardProps {
  product: Product;
}

const ProductList = ({ data }: ProductGridProps) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          <span className="text-blue">{data.length}</span> products found{" "}
        </p>
        <SortDropdown />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
