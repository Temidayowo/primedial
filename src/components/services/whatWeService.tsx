import Link from "next/link";
import { FaSatelliteDish, FaTools, FaChalkboardTeacher } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { IoSpeedometer } from "react-icons/io5";
import IconCard from "./iconCard";
import WhatWeOfferCard from "./whatWeOfferCard";
import { StaggerContainer, StaggerItem } from "@/components/ui/MotionWrapper";

const equipmentCapabilities = [
  {
    id: 1,
    header: "Equipment Repair",
    text: "Expert diagnostics and repair services for GNSS receivers, total stations, and 3D scanners.",
    icon: FaTools,
  },
  {
    id: 2,
    header: "Equipment Calibration",
    text: "NIST-traceable calibration services to keep your instruments precise, compliant, and field-ready.",
    icon: IoSpeedometer,
  },
  {
    id: 3,
    header: "Technical Training & Support",
    text: "Hands-on instrument training and ongoing technical support for survey teams and equipment operators.",
    icon: FaChalkboardTeacher,
  },
];

const equipmentActions = [
  { name: "Repair a GNSS Receiver" },
  { name: "Calibrate a Total Station" },
  { name: "Service a Level" },
  { name: "Repair a 3D Scanner" },
  { name: "Service a Drone" },
  { name: "Repair an Accessory" },
];

const WhatWeService = () => {
  return (
    <section id="equipment-services" className="bg-gray-100 overflow-hidden">
      <StaggerContainer className="section-container">
        <StaggerItem>
          <h4 className="text-green uppercase text-center text-sm font-semibold">
            Equipment Services
          </h4>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue text-center font-clash-display">
            Repair, Calibration &amp; Training
          </h2>
        </StaggerItem>
        {/* <p className="text-gray-500 text-sm text-center mt-3 max-w-2xl mx-auto">
          Our technicians are trained on the full range of survey-grade
          instruments and accessories.
        </p> */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {equipmentCapabilities.map((item) => (
            <StaggerItem key={item.id}>
              <WhatWeOfferCard
                header={item.header}
                text={item.text}
                icon={item.icon}
              />
            </StaggerItem>
          ))}
        </div>

        <StaggerItem>
          <div className="mt-8 flex justify-center">
            <Link
              href="/shop"
              className="flex items-center gap-2 text-sm font-semibold text-blue hover:text-blue/80 transition-colors duration-300"
            >
              Want to buy equipments instead?
              <FaArrowRight className="size-3" />
            </Link>
          </div>
        </StaggerItem>

        {/* <h4 className="uppercase font-poppins text-xs font-semibold text-gray-500 text-center mt-10">
          On This Equipment
        </h4>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {equipmentActions.map((service) => (
            <IconCard key={service.name} name={service.name} icon={FaSatelliteDish} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/shop"
            className="flex items-center gap-2 text-sm font-semibold text-blue hover:text-blue/80 transition-colors duration-300"
          >
            Looking to buy new equipment instead? Browse the Shop
            <FaArrowRight className="size-3" />
          </Link>
        </div> */}
      </StaggerContainer>
    </section>
  );
};

export default WhatWeService;
