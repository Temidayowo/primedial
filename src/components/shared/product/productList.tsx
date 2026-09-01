import { SurveyingProduct } from "@/data/products";
import ProductCard from "./productCard";

const ProductList = ({ data, limit }: { data: SurveyingProduct[]; limit?: number }) => {
  // Filter for featured products, then grab only the first 4
  const featuredProducts = data
    .filter((product) => product.isFeatured)
    .slice(0, limit || 4); // Default limit to 4 if not provided

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
      {featuredProducts.length > 0 ? (
        featuredProducts.map((product) => (
          // Added the key prop here
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">
          No featured products available.
        </p>
      )}
    </div>
  );
};

export default ProductList;