import ConsultationModal from "./consultationModal";
import { AnimateOnScroll, scaleIn } from "@/components/ui/MotionWrapper";

const CtaBanner = () => {
  return (
    <section className="bg-gray-50 overflow-hidden">
      <div className="section-container flex justify-center">
        <AnimateOnScroll
          variants={scaleIn}
          className="flex w-full max-w-4xl flex-col items-center gap-3 rounded-3xl border-[0.1px] border-gray-200 bg-gray-100 px-6 py-12 md:px-10 md:py-16 lg:px-20"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-blue font-bold text-center font-clash-display">
            Need a custom survey or consultation?
          </h2>
          <p className="text-center text-sm text-gray-600">
            Tell us about your project and our team will get back to you within
            24 hours.
          </p>
          <ConsultationModal />
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default CtaBanner;
