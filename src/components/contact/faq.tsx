"use client";

import { useState } from "react";
import { X } from "lucide-react";

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
  ];

  return (
    <section className="flex justify-center">
      <div className="w-full max-w-4xl mx-auto py-12 flex flex-col gap-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="bg-gray-50 rounded-xl overflow-hidden border-gray-300 border-[0.1px]"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-100 transition-colors"
              >
                <span className="text-lg font-semibold text-blue font-clash-display">
                  {faq.question}
                </span>

                <span className="ml-4 shrink-0 text-blue">
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
          );
        })}
      </div>
    </section>
  );
};

export default Faq;
