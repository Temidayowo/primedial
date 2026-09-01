import Header from "@/components/header";
import Hero from "@/components/home/hero";
import About from "@/components/home/about";
import TrackRecord from "@/components/home/trackRecord";
import FeaturedProducts from "@/components/home/featuredProducts";
import Category from "@/components/home/category";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <TrackRecord />
      <Category />
      <FeaturedProducts />
    </>
  );
}
