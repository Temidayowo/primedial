import { getFeaturedProducts } from "@/lib/actions/products.action";
import FeaturedProductsClient from "./featuredProductsClient";

const FeaturedProducts = async () => {
  const featuredProducts = await getFeaturedProducts();
  return <FeaturedProductsClient products={featuredProducts} />;
};

export default FeaturedProducts;