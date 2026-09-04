import { PageHero } from "@/components/ui/pageHero";
import WhatWeOffer from "@/components/services/whatWeOffer";

const ServicesContent = () => {
  return (
    <>
      <PageHero
        heading="Our Services"
        subheading="From cadastral surveys to equipment calibration, our accredited team delivers precision geospatial solutions across every sector we serve."
        breadcrumb="Home / Services"
        backgroundImage="/images/services-page-header.jpg"
      />
      <WhatWeOffer />
    </>
  );
};

export default ServicesContent;
