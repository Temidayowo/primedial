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
      <Header
        theme="light"
        className="bg-transparent absolute"
        mobileClassName="absolute top-0 left-0 z-50 w-full bg-transparent border-b-0"
      />
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
