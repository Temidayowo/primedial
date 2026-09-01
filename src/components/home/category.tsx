import Link from "next/link";
import { productCategories } from "@/data/products";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Category = () => {
  return (
    // Added 'w-full overflow-hidden' here to stop the horizontal bleed
    <section className="mx-auto lg:mx-10 w-full max-w-7xl overflow-hidden px-6 py-12 md:px-12 md:py-16 lg:px-20 lg:py-20">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h3 className="font-clash-display text-2xl md:text-3xl lg:text-4xl text-blue font-bold">
          Shop by Category
        </h3>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full relative py-4"
      >
        <CarouselContent className="-ml-4">
          {productCategories.map((category, index) => {
            const categorySlug = category.toLowerCase().replace(/\s+/g, '-');

            return (
              <CarouselItem 
                key={index} 
                className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 ring-0 my-4"
              >
                <Link href={`/categories/${categorySlug}`} className="block h-full">
                  <Card className="bg-[#F8FAFC] ring-0 shadow-sm hover:shadow-md transition-shadow h-full">
                    <CardContent className="flex flex-col items-center justify-center p-6 h-28 md:h-32">
                      <h4 className="font-clash-display text-base md:text-lg font-semibold text-blue text-center">
                        {category}
                      </h4>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        
        <CarouselPrevious className="left-2 lg:left-4 z-10 h-8 w-8 md:h-10 md:w-10 bg-white/90 backdrop-blur hover:bg-white border shadow-md" />
        <CarouselNext className="right-2 lg:right-4 z-10 h-8 w-8 md:h-10 md:w-10 bg-white/90 backdrop-blur hover:bg-white border shadow-md" />
      </Carousel>
    </section>
  );
};

export default Category;