"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/ui/MotionWrapper";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What warranty comes with my equipment?",
      answer:
        "All new equipment ships with a minimum 2-year manufacturer warranty. Extended warranty plans are available at checkout for select product lines.",
    },
    {
      question: "How do I get technical support for my device?",
      answer:
        "Submit a support ticket via this contact form or call our technical support line directly — our team includes certified field technicians for every product category we sell.",
    },
    {
      question: "Can I request a bulk or enterprise quote?",
      answer:
        'Absolutely — select "Request a Quote" as your subject above and include your project details. Our sales team handles enterprise and fleet orders directly.',
    },
    {
      question: "Which equipment can I submit for repair?",
      answer:
        "We support survey instruments including GNSS receivers, total stations, 3D scanners, and other equipment. Include the make, model, and issue in your request so our team can assess it.",
    },
    {
      question: "Can I request calibration without a repair?",
      answer:
        "Yes. Submit a request for calibration and include the instrument type and model. We will confirm the assessment and service details with you.",
    },
    {
      question: "Will I receive calibration documentation?",
      answer:
        "Calibration services include traceable documentation or a calibration certificate, as applicable to the instrument and service performed.",
    },
    {
      question: "How do I get started with equipment repair or calibration?",
      answer:
        "Use the Request Service form on our Equipment Support page. Share your contact details and describe the repair or calibration needed, and our team will follow up.",
    },
  ];

  return (
    <section id="faq" className="flex justify-center overflow-hidden scroll-mt-24">
      <StaggerContainer className="w-full max-w-4xl mx-auto py-12 flex flex-col gap-4">
        <StaggerItem>
          <div className="mb-4 text-center">
            <p className="text-green uppercase text-sm font-semibold">FAQ</p>
            <h2 className="mt-1 font-clash-display text-2xl font-bold text-blue md:text-3xl lg:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>
        </StaggerItem>
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <StaggerItem key={index}>
              <div className="bg-gray-50 rounded-xl overflow-hidden border-gray-300 border-[0.1px]">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-100 transition-colors duration-300"
                >
                  <span className="text-lg font-semibold text-blue font-clash-display">
                    {faq.question}
                  </span>

                  <span
                    className={`ml-4 shrink-0 transition-colors duration-300 ${isOpen ? "text-green" : "text-blue"}`}
                  >
                    <X
                      size={24}
                      strokeWidth={2.5}
                      className={`transition-transform duration-300 ease-in-out ${
                        isOpen ? "rotate-0" : "rotate-45"
                      }`}
                    />
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </section>
  );
};

export default Faq;
