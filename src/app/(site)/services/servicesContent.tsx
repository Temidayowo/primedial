import { PageHero } from "@/components/ui/pageHero";
import WhatWeOffer from "@/components/services/whatWeOffer";
import WhatWeService from "@/components/services/whatWeService";
import RequestService from "@/components/services/requestService";
import ExpertiseInAction from "@/components/services/expertiseInAction";
import CtaBanner from "@/components/services/ctaBanner";

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
      <WhatWeService />
      <RequestService />
      <ExpertiseInAction />
      <CtaBanner />
    </>
  );
};

export default ServicesContent;
