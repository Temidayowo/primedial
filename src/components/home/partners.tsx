import Image from "next/image";
import { Marquee } from "@/components/shadcn-space/animations/marquee";
import { AnimateOnScroll } from "@/components/ui/MotionWrapper";
import { getPublishedPartners } from "@/lib/content";
import { imageProps } from "@/lib/images";

// Partner logos are managed in /admin/partners.
export default async function Partners() {
  const partners = await getPublishedPartners();

  if (partners.length === 0) return null;

  return (
    <section className="w-full overflow-hidden bg-gray-50">
      <div className="section-container space-y-6 md:space-y-8">
        <AnimateOnScroll>
          <h3 className="text-center font-clash-display text-2xl md:text-3xl text-blue font-bold">
            Our Trusted Partners
          </h3>
        </AnimateOnScroll>

        <Marquee className="[--duration:20s] px-4 md:px-10" pauseOnHover>
          {partners.map((partner) => {
            const logo = (
              <Image
                {...imageProps(partner.logo)}
                alt={partner.name}
                width={144}
                height={48}
                className="w-24 md:w-32 lg:w-36 h-12 object-contain"
              />
            );

            return (
              <div
                key={partner.id}
                className="flex items-center justify-center mr-8 md:mr-12 lg:mr-20"
              >
                {partner.websiteUrl ? (
                  <a
                    href={partner.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${partner.name} website`}
                  >
                    {logo}
                  </a>
                ) : (
                  logo
                )}
              </div>
            );
          })}
        </Marquee>
      </div>
    </section>
  );
}
