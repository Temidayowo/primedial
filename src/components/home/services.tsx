import Link from "next/link";
import { FaArrowRight, FaMapLocationDot, FaCompassDrafting } from "react-icons/fa6";
import { FaTools } from "react-icons/fa";
import { PiDroneFill } from "react-icons/pi";
import { GiMineTruck } from "react-icons/gi";
import { LuWaves } from "react-icons/lu";

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
    <section className="section-container">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h4 className="font-clash-display text-green uppercase text-sm font-semibold">
            What We Do
          </h4>
          <h3 className="font-clash-display text-2xl md:text-3xl lg:text-3xl text-blue font-bold mt-1">
            Services We Offer
          </h3>
        </div>
        <Link
          href="/services"
          className="hidden sm:flex items-center gap-2 text-sm font-semibold text-blue hover:text-blue/80 transition-colors shrink-0"
        >
          View all services <FaArrowRight className="size-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {homeServices.map((service) => {
          const Icon = service.icon;
          return (
            <Link
              key={service.header}
              href="/services"
              className="group flex items-start gap-4 rounded-xl border-[0.1px] border-gray-300 bg-gray-50 p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 transition-all duration-300 ease-out group-hover:bg-blue">
                <Icon className="size-5 text-blue transition-colors duration-300 group-hover:text-white" />
              </div>
              <div>
                <h4 className="font-clash-display font-semibold text-blue text-sm">
                  {service.header}
                </h4>
                <p className="text-gray-600 text-xs mt-1">{service.text}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <Link
        href="/services"
        className="sm:hidden mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-blue"
      >
        View all services <FaArrowRight className="size-3" />
      </Link>
    </section>
  );
};

export default Services;
