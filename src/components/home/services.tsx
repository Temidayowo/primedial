import Link from "next/link";
import { FaArrowRight, FaMapLocationDot, FaCompassDrafting } from "react-icons/fa6";
import { FaTools } from "react-icons/fa";
import { PiDroneFill } from "react-icons/pi";
import { GiMineTruck } from "react-icons/gi";
import { LuWaves } from "react-icons/lu";
import { StaggerContainer, StaggerItem } from "@/components/ui/MotionWrapper";

const homeServices = [
  {
    header: "Aerial Mapping & Drone Services",
    text: "LiDAR, UAV & manned aircraft",
    icon: PiDroneFill,
  },
  {
    header: "Cadastral, GIS & Digital Mapping",
    text: "Land documentation & charting",
    icon: FaMapLocationDot,
  },
  {
    header: "Engineering & Construction Surveys",
    text: "Topographic, as-built, setting out",
    icon: FaCompassDrafting,
  },
  {
    header: "Hydrographic & Offshore Services",
    text: "Bathymetric surveys, oil & gas positioning",
    icon: LuWaves,
  },
  {
    header: "Pipeline, Route & Mining Surveys",
    text: "Corridor alignment & site surveys",
    icon: GiMineTruck,
  },
  {
    header: "Equipment Repair, Calibration & Training",
    text: "Certified technicians, NIST-traceable",
    icon: FaTools,
  },
];

const Services = () => {
  return (
    <section className="overflow-hidden">
      <StaggerContainer className="section-container py-16 md:py-20">
        <StaggerItem>
          <div className="flex flex-col items-center text-center mb-10 md:mb-12">
            <h4 className="font-clash-display text-green uppercase text-sm font-semibold">
              What We Do
            </h4>
            <h3 className="font-clash-display text-2xl md:text-3xl lg:text-4xl text-blue font-bold mt-1">
              Services We Offer
            </h3>
            <p className="text-gray-600 text-sm mt-3 max-w-xl">
              From field surveys to equipment repair and calibration,
              here&apos;s the full range of geospatial services our
              accredited team delivers.
            </p>
          </div>
        </StaggerItem>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {homeServices.map((service) => {
            const Icon = service.icon;
            return (
              <StaggerItem key={service.header}>
                <Link
                  href="/services"
                  className="group flex items-start gap-4 rounded-xl border-[0.1px] border-gray-300 bg-gray-50 p-6 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl"
                >
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gray-100 p-4 transition-all duration-300 ease-out group-hover:rotate-3 group-hover:bg-blue">
                    <Icon className="size-6 text-blue transition-transform duration-300 ease-out group-hover:scale-110 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-clash-display font-semibold text-blue text-base">
                      {service.header}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1.5">
                      {service.text}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </div>

        <StaggerItem>
          <div className="mt-10 flex justify-center">
            <Link
              href="/services"
              className="flex items-center gap-2 rounded-4xl bg-blue px-8 py-3 text-sm font-semibold uppercase text-white transition-colors hover:bg-blue/90"
            >
              View All Services <FaArrowRight className="size-3" />
            </Link>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </section>
  );
};

export default Services;
