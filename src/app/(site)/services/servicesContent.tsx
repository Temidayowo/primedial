import { PageHero } from "@/components/ui/pageHero";
import Link from "next/link";
import WhatWeOffer from "@/components/services/whatWeOffer";
import ExpertiseInAction from "@/components/services/expertiseInAction";
import CtaBanner from "@/components/shared/ctaBanner";
import { StaggerContainer, StaggerItem } from "@/components/ui/MotionWrapper";

const WhyChooseUs = () => (
  <section className="overflow-hidden bg-gray-100">
    <StaggerContainer className="section-container">
      <StaggerItem>
        <h4 className="text-center text-sm font-semibold uppercase text-green">
          Why Choose Us
        </h4>
        <h2 className="text-center font-clash-display text-2xl font-bold text-blue md:text-3xl lg:text-4xl">
          Survey Expertise You Can Rely On
        </h2>
      </StaggerItem>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          {
            title: "Experienced Survey Professionals",
            text: "Our team brings practical field experience to projects across land, construction, and water environments.",
          },
          {
            title: "Accurate, Useful Data",
            text: "We use modern survey methods and instruments to deliver dependable data for planning and decision-making.",
          },
          {
            title: "Project-Focused Delivery",
            text: "From site assessment to final outputs, our survey work is tailored to your project requirements.",
          },
        ].map((item) => (
          <StaggerItem key={item.title}>
            <div className="h-full rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="font-clash-display text-lg font-semibold text-blue">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{item.text}</p>
            </div>
          </StaggerItem>
        ))}
      </div>
    </StaggerContainer>
  </section>
);

const EquipmentSupportCallout = () => (
  <section className="bg-gray-50">
    <div className="section-container py-6">
      <p className="text-center text-sm text-gray-600">
        Need your equipment repaired or calibrated?{" "}
        <Link
          href="/equipment-support"
          className="font-semibold text-blue underline decoration-green underline-offset-4 hover:text-blue/80"
        >
          Visit Equipment Support
        </Link>
      </p>
    </div>
  </section>
);

const ServicesContent = () => {
  return (
    <>
      <PageHero
        heading="Our Services"
        subheading="Our survey professionals deliver precise geospatial data for land, infrastructure, construction, and water projects."
        breadcrumb="Home / Services"
        backgroundImage="/images/services-page-header.jpg"
      />
      <WhatWeOffer />
      <WhyChooseUs />
      {/* <ExpertiseInAction /> */}
      <EquipmentSupportCallout />
      <CtaBanner />
    </>
  );
};

export default ServicesContent;
