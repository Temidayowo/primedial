import { FaMapLocationDot, FaCompassDrafting } from "react-icons/fa6";
import { FaTools } from "react-icons/fa";
import { LuWaves } from "react-icons/lu";
import { HiSquare3Stack3D } from "react-icons/hi2";
import { IoSpeedometer } from "react-icons/io5";
import { BsImageAlt } from "react-icons/bs";
import WhatWeOfferCard from "./whatWeOfferCard";

const WhatWeOffer = () => {
  const whatWeOfferArray = [
    {
      id: 1,
      header: "Cadastral Surveys",
      text: "Legal boundary and land parcel surveys for property registration, titling, and dispute resolution.",
      icon: FaMapLocationDot,
    },
    {
      id: 2,
      header: "Topographical, As-built & Detail Surveys",
      text: "Accurate terrain and feature mapping to support design, planning, and as-built verification.",
      icon: BsImageAlt,
    },
    {
      id: 3,
      header: "Engineering, Setting Out & Construction Surveys",
      text: "On-site layout and setting out services ensuring structures are built exactly to design specification.",
      icon: FaCompassDrafting,
    },
    {
      id: 4,
      header: "Hydrographic & Bathymetric Surveys",
      text: "Underwater terrain mapping and waterway surveys for reclamation, dredging, and marine works.",
      icon: LuWaves,
    },
    {
      id: 5,
      header: "Geophysical & Geotechnical Surveys",
      text: "Subsurface investigation and soil analysis to inform foundation design and site suitability.",

      icon: HiSquare3Stack3D,
    },
    {
      id: 6,
      header: "Equipment Repair",
      text: "Expert diagnostics and repair services for GNSS receivers, total stations, and 3D scanners.",
      icon: FaTools,
    },
    {
      id: 7,
      header: "Equipment Calibration",
      text: "NIST-traceable calibration services to keep your instruments precise, compliant, and field-ready.",
      icon: IoSpeedometer,
    },
  ];

  return (
    <section>
      <div className="section-container">
        <h4 className="text-green uppercase text-center text-sm font-semibold">
          What We Offer
        </h4>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue text-center">
          Full-Spectrum Geospatial Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-8">
          {whatWeOfferArray.map((item) => (
            <WhatWeOfferCard
              icon={item.icon}
              key={item.id}
              header={item.header}
              text={item.text}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeOffer;
