import { Marquee } from "@/components/shadcn-space/animations/marquee";

type BrandList = {
  image: string;
  lightimg: string;
  name: string;
};

export default function MarqueeBrandsDemo() {
  const brandList: BrandList[] = [
    {
      image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-1.svg",
      lightimg:
        "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-1.svg",
      name: "Brand 1",
    },
    {
      image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-2.svg",
      lightimg:
        "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-2.svg",
      name: "Brand 2",
    },
    {
      image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-3.svg",
      lightimg:
        "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-3.svg",
      name: "Brand 3",
    },
    {
      image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-4.svg",
      lightimg:
        "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-4.svg",
      name: "Brand 4",
    },
    {
      image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-5.svg",
      lightimg:
        "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-5.svg",
      name: "Brand 5",
    },
  ];

  return (
    // 1. Changed px-32 to px-6 md:px-12 lg:px-32.
    // 2. Added overflow-hidden w-full to prevent horizontal scrolling bugs.
    <section className="w-full overflow-hidden bg-gray-50">
      <div className="section-container space-y-6 md:space-y-8">
        <h3 className="text-center font-clash-display text-2xl md:text-3xl text-blue font-bold">
          Our Trusted Partners
        </h3>

        {/* Scaled the inner padding for smaller screens */}
        <Marquee className="[--duration:20s] px-4 md:px-10" pauseOnHover>
          {brandList.map((brand, index) => (
            <div key={index} className="flex items-center justify-center">
              <img
                src={brand.image}
                alt={brand.name}
                // 3. Made width responsive (w-24 on mobile, w-36 on desktop)
                // 4. Fixed mismatched margins between light/dark mode
                className="w-24 md:w-32 lg:w-36 h-auto mr-8 md:mr-12 lg:mr-20 dark:hidden object-contain"
              />
              <img
                src={brand.lightimg}
                alt={brand.name}
                className="hidden dark:block w-24 md:w-32 lg:w-36 h-auto mr-8 md:mr-12 lg:mr-20 object-contain"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
