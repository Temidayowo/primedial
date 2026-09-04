import { FaSatelliteDish } from "react-icons/fa6";
import IconCard from "./iconCard";

const WhatWeService = () => {
  const services = [
    {
      name: "GNSS Recievers",
      icon: FaSatelliteDish,
    },
    {
      name: "Total Station",
      icon: FaSatelliteDish,
    },
    {
      name: "Levels",
      icon: FaSatelliteDish,
    },
    {
      name: "3D Scanners",
      icon: FaSatelliteDish,
    },
    {
      name: "Drones",
      icon: FaSatelliteDish,
    },
    {
      name: "Accessories",
      icon: FaSatelliteDish,
    },
  ];

  return (
    <section className="bg-gray-100">
      <div className="section-container">
        <h4 className="text-green uppercase text-center text-sm font-semibold">
          What We Service
        </h4>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue text-center">
          Equipment We Repair & Calibrate
        </h2>
        <p className="text-gray-400 text-sm text-center mt-3">
          Our technicians are trained on the full range of survey-grade
          instruments and accessories.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {services.map((service) => (
            <IconCard
              key={service.name}
              name={service.name}
              icon={service.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeService;
