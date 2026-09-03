import Header from "@/components/header";
import Hero from "@/components/home/hero";
import About from "@/components/home/about";
import TrackRecord from "@/components/home/trackRecord";
import FeaturedProducts from "@/components/home/featuredProducts";
import Category from "@/components/home/category";
import Slider from "@/components/home/partners";
import Testimonials from "@/components/home/testimonials";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <Header theme="light" />
      <Hero />
      <About />
      <TrackRecord />
      <Category />
      <FeaturedProducts />
      <Slider />
      <Testimonials />
    </>
  );
}
