import { FaUserCog } from "react-icons/fa";
import { FaPuzzlePiece, FaFileCircleCheck } from "react-icons/fa6";
import { BiSolidZap } from "react-icons/bi";
import RequestServiceForm from "./requestServiceForm";

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
    <section>
      <div className="section-container grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="uppercase text-sm text-green font-semibold">
            {" "}
            Request Service
          </h4>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-clash-display text-blue">
            Why Request Through Us
          </h2>
          <p className="text-gray-600 text-sm mt-3">
            Trust your instruments to the same team that uses them in the field
            every day.
          </p>
          <div className="flex flex-col gap-6 mt-5">
            {whyRequestOurService.map((request) => {
              const Icon = request.icon;

              return (
                <div key={request.head} className="flex gap-6">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-green/10">
                    <Icon className="size-5 text-green" />
                  </div>
                  <div className="flex flex-col">
                    <h5 className="text-blue text-sm font-semibold font-clash-display">
                      {request.head}
                    </h5>
                    <p className="text-gray-600 text-sm">{request.subheader}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <RequestServiceForm />
      </div>
    </section>
  );
};

export default RequestService;
