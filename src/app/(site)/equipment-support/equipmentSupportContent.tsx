import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";
import { PageHero } from "@/components/ui/pageHero";
import IconCard from "@/components/services/iconCard";
import WhatWeService from "@/components/services/whatWeService";
import RequestService from "@/components/services/requestService";
import { StaggerContainer, StaggerItem } from "@/components/ui/MotionWrapper";

// const supportedEquipment = [
//   { name: "GNSS Receivers", icon: FaMapLocationDot },
//   { name: "Total Stations", icon: FaCompassDrafting },
//   { name: "3D Scanners", icon: BsImageAlt },
//   { name: "Digital Levels", icon: HiSquare3Stack3D },
//   { name: "Hydrographic Instruments", icon: LuWaves },
//   { name: "Survey Accessories", icon: FaTools },
// ];

const repairProcess = [
  {
    number: "01",
    title: "Submit a Service Request",
    text: "Tell us about your instrument, its model, and the repair or calibration it needs.",
  },
  {
    number: "02",
    title: "Assessment & Service",
    text: "Our technicians assess the equipment, confirm the required work, and carry out the service.",
  },
  {
    number: "03",
    title: "Verification & Return",
    text: "We verify the work completed and provide service or calibration documentation where applicable.",
  },
];

const EquipmentSupportCta = () => (
  <section className="overflow-hidden bg-gray-50">
    <div className="section-container flex justify-center">
      <div className="flex w-full max-w-4xl flex-col items-center gap-4 rounded-3xl border border-gray-200 bg-gray-100 px-6 py-12 text-center md:px-10 md:py-16">
        <h2 className="font-clash-display text-2xl font-bold text-blue md:text-3xl lg:text-4xl">
          Get Your Equipment Field-Ready
        </h2>
        <p className="max-w-2xl text-sm text-gray-600">
          Request a repair or calibration and let our team help get your survey
          instruments back to work.
        </p>
        <Link
          href="#request-service"
          className="rounded-4xl bg-green px-7 py-3 text-sm font-semibold uppercase text-white transition-colors hover:bg-green/90"
        >
          Request Service
        </Link>
        <Link
          href="/services"
          className="text-sm font-semibold text-blue underline decoration-green underline-offset-4 hover:text-blue/80"
        >
          Explore our survey services
        </Link>
      </div>
    </div>
  </section>
);

const EquipmentSupportContent = () => (
  <>
    <PageHero
      heading="Expert Equipment Repair & Calibration"
      subheading="Keep your survey instruments accurate, reliable, and ready for the field with expert repair and calibration support."
      breadcrumb="Home / Equipment Support"
      backgroundImage="/images/services-page-header.jpg"
      action={
        <Link
          href="#request-service"
          className="inline-flex rounded-4xl bg-green px-7 py-3 text-sm font-semibold uppercase text-white transition-colors hover:bg-green/90"
        >
          Request Service
        </Link>
      }
    />
    <section className="overflow-hidden">
      {/* <StaggerContainer className="section-container">
        <StaggerItem>
          <h2 className="text-center font-clash-display text-2xl font-bold text-blue md:text-3xl lg:text-4xl">
            Equipment We Support
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-gray-600">
            Repair and calibration support for the instruments survey teams
            rely on.
          </p>
        </StaggerItem>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {supportedEquipment.map((equipment) => (
            <StaggerItem key={equipment.name}>
              <IconCard name={equipment.name} icon={equipment.icon} />
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer> */}
    </section>
    <WhatWeService />
    <section className="overflow-hidden">
      <StaggerContainer className="section-container">
        <StaggerItem>
          <h4 className="text-center text-sm font-semibold uppercase text-green">
            Our Process
          </h4>
          <h2 className="text-center font-clash-display text-2xl font-bold text-blue md:text-3xl lg:text-4xl">
            From Request to Field-Ready
          </h2>
        </StaggerItem>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {repairProcess.map((step) => (
            <StaggerItem key={step.number}>
              <div className="h-full rounded-xl border border-gray-200 bg-white p-6">
                <p className="font-clash-display text-2xl font-bold text-green">
                  {step.number}
                </p>
                <h3 className="mt-3 font-clash-display text-lg font-semibold text-blue">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{step.text}</p>
              </div>
            </StaggerItem>
          ))}
        </div>
        <Link
          href="shop"
          className="relative mx-auto mt-8 block group w-fit pb-1 text-center text-sm font-semibold text-blue transition-colors duration-300 hover:text-blue/80 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue after:transition-all after:duration-300 after:content-[''] hover:after:w-full"
        >
          <p className="flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
            Visit Primedial Store
            <FaArrowRightLong />
          </p>
        </Link>
      </StaggerContainer>
    </section>
    <RequestService />
    {/* <EquipmentSupportCta /> */}
  </>
);

export default EquipmentSupportContent;
