"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { FaArrowRight } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import ConsultationForm from "./consultationForm";

const ConsultationModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-green w-fit rounded-4xl px-8 py-5 text-sm font-semibold uppercase text-white md:px-12"
      >
        Get Consultation
        <FaArrowRight />
      </Button>

      {/* Backdrop + centering wrapper */}
      <div
        className={`fixed inset-0 z-100 flex items-center justify-center p-4 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />

        {/* Modal */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Request a consultation"
          className={`relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl transition-transform duration-300 ease-out md:p-8 ${
            isOpen ? "scale-100" : "scale-95"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-clash-display text-xl font-bold text-blue md:text-2xl">
                Tell Us About Your Project
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Share a few details and one of our surveyors will scope the
                right solution for you.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="shrink-0 rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="mt-6">
            <ConsultationForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultationModal;
