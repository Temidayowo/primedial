import { surveyingProducts } from "@/data/products";
import ProductList from "../shared/product/productList";

const FeaturedProducts = () => {
  return (
    <section className="mx-auto lg:mx-12 max-w-7xl px-6 py-12 md:px-12 md:py-16 lg:px-20 lg:py-20">
      <h2 className="font-clash-display text-2xl md:text-3xl lg:text-3xl text-blue font-bold">
        Featured Products
      </h2>
      <ProductList data={surveyingProducts} limit={4} />
    </section>
  );
};

export default FeaturedProducts;