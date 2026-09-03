import ProductCard from "./productCard";

export interface FeaturedProduct {
  id: string;
  name: string;
  brand: string;
  slug: string;
  category: string;
  images: string[];
  description: string;
  inStock: boolean;
  features: string[];
  price: number;
  isFeatured: boolean;
  createdAt: Date;
}

const ProductList = ({
  data,
  limit,
}: {
  data: FeaturedProduct[];
  limit?: number;
}) => {
  const featuredProducts = limit ? data.slice(0, limit) : data;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
      {featuredProducts.length > 0 ? (
        featuredProducts.map((product) => (
          // Added the key prop here
          <ProductCard key={product.slug} product={product} />
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
