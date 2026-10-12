import { FaTools, FaChalkboardTeacher, FaClipboardCheck } from "react-icons/fa";
import WhatWeOfferCard from "./whatWeOfferCard";
import { StaggerContainer, StaggerItem } from "@/components/ui/MotionWrapper";

const equipmentCapabilities = [
  {
    id: 1,
    header: "Equipment Repair and Calibration",
    text: "Fast, expert diagnostics and repairs for GNSS receivers, total stations, 3D scanners and other survey instruments, plus NIST-traceable calibration to keep your readings accurate and compliant.",
    icon: FaTools,
  },
  {
    id: 2,
    header: "Software and Technical Training",
    text: "Hands-on training for your team on instrument operation, field workflows and processing software, so you get the most out of the gear you already own.",
    icon: FaChalkboardTeacher,
  },
  {
    id: 3,
    header: "Equipment Maintenance and Support",
    text: "Routine servicing, firmware updates and health checks that catch small issues early, cut downtime and keep your instruments field-ready.",
    icon: FaClipboardCheck,
  },
];

const WhatWeService = () => {
  return (
    <section id="equipment-services" className="overflow-hidden bg-gray-100">
      <StaggerContainer className="section-container">
        <StaggerItem>
          <h4 className="text-green uppercase text-center text-sm font-semibold">
            Repair &amp; Calibration
          </h4>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue text-center font-clash-display">
            Expert Equipment Support
          </h2>
        </StaggerItem>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
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
      </StaggerContainer>
    </section>
  );
};

export default WhatWeService;
