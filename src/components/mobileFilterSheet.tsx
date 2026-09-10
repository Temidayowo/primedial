"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import FilterSection, { type FilterSectionProps } from "@/components/filterSection";

type MobileFilterSheetProps = Omit<FilterSectionProps, "onDone">;

const MobileFilterSheet = ({ categories, brands }: MobileFilterSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue bg-white py-3 font-poppins text-sm font-medium text-blue"
      >
        <SlidersHorizontal className="size-4" />
        Filters
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-100 bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className={`fixed inset-x-0 bottom-0 z-100 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="sticky top-0 flex justify-center bg-white pt-3">
          <div className="h-1.5 w-12 rounded-full bg-gray-200" />
        </div>

        <div className="px-6 pt-2 pb-8">
          <FilterSection
            categories={categories}
            brands={brands}
            onDone={() => setIsOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileFilterSheet;
