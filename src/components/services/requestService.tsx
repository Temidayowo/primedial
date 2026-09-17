import { FaUserCog } from "react-icons/fa";
import { FaPuzzlePiece, FaFileCircleCheck } from "react-icons/fa6";
import { BiSolidZap } from "react-icons/bi";
import RequestServiceForm from "./requestServiceForm";
import {
  AnimateOnScroll,
  StaggerContainer,
  StaggerItem,
  slideLeft,
} from "@/components/ui/MotionWrapper";

const RequestService = () => {
  const whyRequestOurService = [
    {
      head: "Certified Technicians",
      subheader:
        "Factory-trained specialists handle every repair and calibration.",
      icon: FaUserCog,
    },
    {
      head: "Genuine Parts",
      subheader: "Only manufacturer-approved components are used in repairs.",
      icon: FaPuzzlePiece,
    },
    {
      head: "Fast Turnaround",
      subheader: "Most units are back in the field within 3–5 business days.",
      icon: BiSolidZap,
    },
    {
      head: "Calibration Certificate Provided",
      subheader:
        "Every service comes with traceable documentation for compliance.",
      icon: FaFileCircleCheck,
    },
  ];

  return (
    <section id="request-service" className="overflow-hidden">
      <div className="section-container grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        <StaggerContainer className="md:pr-4">
          <StaggerItem>
            <h4 className="uppercase text-sm text-green font-semibold">
              {" "}
              Request Equipment Repair, Calibration
            </h4>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-clash-display text-blue">
              Why Request Through Us
            </h2>
            <p className="text-gray-600 text-sm mt-3">
              Trust your instruments to the same team that uses them in the
              field every day.
            </p>
          </StaggerItem>
          <div className="flex flex-col gap-8 mt-5">
            {whyRequestOurService.map((request) => {
              const Icon = request.icon;

              return (
                <StaggerItem key={request.head}>
                  <div className="flex gap-6">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-green/10">
                      <Icon className="size-6 text-green" />
                    </div>
                    <div className="flex flex-col">
                      <h5 className="text-blue text-sm font-semibold font-clash-display">
                        {request.head}
                      </h5>
                      <p className="text-gray-600 text-sm">
                        {request.subheader}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </div>
        </StaggerContainer>
        <AnimateOnScroll variants={slideLeft} className="w-full">
          <RequestServiceForm />
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default RequestService;
