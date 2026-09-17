import { FaMapLocationDot, FaCompassDrafting } from "react-icons/fa6";
import { FaDatabase } from "react-icons/fa";
import { PiDroneFill } from "react-icons/pi";
import { GiOilRig, GiMineTruck } from "react-icons/gi";
import { LuWaves } from "react-icons/lu";
import { HiSquare3Stack3D } from "react-icons/hi2";
import { BsImageAlt } from "react-icons/bs";
import WhatWeOfferCard from "./whatWeOfferCard";
import { StaggerContainer, StaggerItem } from "@/components/ui/MotionWrapper";

const WhatWeOffer = () => {
  const whatWeOfferArray = [
    {
      id: 1,
      header: "Aerial Mapping & Drone Services",
      text: "LiDAR, UAV, and manned-aircraft aerial surveys for large-area mapping, volumetrics, and orthophoto generation.",
      icon: PiDroneFill,
    },
    {
      id: 2,
      header: "Cadastral, GIS & Digital Mapping",
      text: "Legal boundary surveys, land documentation, charting, and digital mapping for property registration and titling.",
      icon: FaMapLocationDot,
    },
    {
      id: 3,
      header: "Topographical, As-built & Detail Surveys",
      text: "Accurate terrain and feature mapping to support design, planning, and as-built verification.",
      icon: BsImageAlt,
    },
    {
      id: 4,
      header: "Engineering, Setting Out & Construction Surveys",
      text: "On-site layout and setting out services ensuring structures are built exactly to design specification.",
      icon: FaCompassDrafting,
    },
    {
      id: 5,
      header: "Hydrographic & Bathymetric Surveys",
      text: "Underwater terrain mapping and waterway surveys for reclamation, dredging, and marine works.",
      icon: LuWaves,
    },
    {
      id: 6,
      header: "Oil & Gas / Offshore Positioning Services",
      text: "Offshore positioning and survey support for oil & gas exploration, platform installation, and marine construction.",
      icon: GiOilRig,
    },
    {
      id: 7,
      header: "Pipeline, Route & Mining Surveys",
      text: "Route alignment surveys for pipelines and infrastructure corridors, plus mine site and stockpile surveys.",
      icon: GiMineTruck,
    },
    {
      id: 8,
      header: "Geophysical & Geotechnical Surveys",
      text: "Subsurface investigation and soil analysis to inform foundation design and site suitability.",
      icon: HiSquare3Stack3D,
    }
  ];

  return (
    <section id="field-surveys" className="overflow-hidden">
      <StaggerContainer className="section-container">
        <StaggerItem>
          <h4 className="text-green uppercase text-center text-sm font-semibold">
            What We Offer
          </h4>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-clash-display text-blue text-center">
            Field &amp; Aerial Survey Services
          </h2>
        </StaggerItem>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {whatWeOfferArray.map((item) => (
            <StaggerItem key={item.id}>
              <WhatWeOfferCard
                icon={item.icon}
                header={item.header}
                text={item.text}
              />
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </section>
  );
};

export default WhatWeOffer;
