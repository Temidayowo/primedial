import Image from "next/image";
import { GiCheckMark } from "react-icons/gi";
import {
  AnimateOnScroll,
  StaggerContainer,
  StaggerItem,
  scaleIn,
  fadeUp,
} from "@/components/ui/MotionWrapper"; // Adjust path to match your project

const About = () => {
  return (
    <section className="section-container py-16 md:py-20">
      <div className="grid grid-cols-1 gap-20 md:grid-cols-5">
        {/* TEXT COLUMN (Animated with StaggerContainer so elements fade up one by one) */}
        <div className="md:col-span-3">
          <StaggerContainer staggerDelay={0.15}>
            <StaggerItem>
              <h3 className="font-clash-display text-green text-lg font-semibold">
                About Primedial
              </h3>
            </StaggerItem>

            <StaggerItem>
              <h2 className="font-clash-display text-blue hidden md:block text-5xl font-bold mt-8">
                We combine cutting-edge technology with decades of expertise to
                deliver precise geospatial solutions.
              </h2>
              <h2 className="md:hidden text-3xl font-bold mt-8 text-blue font-clash-display">
                Precision Meets Experts
              </h2>
            </StaggerItem>

            <StaggerItem>
              <p className="mt-4 text-normal text-gray-800 font-poppins">
                From cadastral surveys to complex engineering projects, our team
                of accredited professionals ensures accuracy and reliability in
                every measurement.
              </p>
            </StaggerItem>

            {/* The list itself fades up as a single unit, but you could wrap each row in a StaggerItem if you want them to come in separately */}
            <StaggerItem>
              <div className="border-l-2 border-gray-400 pl-14 mt-6 flex flex-col gap-4 font-poppins text-gray-800">
                <div className="flex gap-4 items-center">
                  <GiCheckMark className="text-green shrink-0" />
                  <p>Accredited Surveyors & Consultants</p>
                </div>
                <div className="flex gap-4 items-center">
                  <GiCheckMark className="text-green shrink-0" />
                  <p>End-to-End Project Management</p>
                </div>
                <div className="flex gap-4 items-center">
                  <GiCheckMark className="text-green shrink-0" />
                  <p>Accredited Surveyors & Consultants</p>
                </div>
                <div className="flex gap-4 items-center">
                  <GiCheckMark className="text-green shrink-0" />
                  <p>Quality Assurance & Compliance</p>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>

        {/* IMAGE COLUMN (Animated with scaleIn slightly after the text starts) */}
        {/* Note: I fixed a typo in your original class string here ("relativemd:col-span-2 relative min-h-100") */}
        <div className="md:col-span-2 relative min-h-100 md:min-h-full rounded-xl overflow-hidden mt-12 md:mt-0">
          <AnimateOnScroll
            variants={scaleIn}
            delay={0.4}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src="/images/about-section-img.png"
              alt="About Image"
              fill
              loading="eager"
              sizes="(min-width: 768px) 40vw, 100vw"
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
            />
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
};

export default About;
