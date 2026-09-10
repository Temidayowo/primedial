"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import {
  StaggerContainer,
  StaggerItem,
  TextReveal,
} from "@/components/ui/MotionWrapper";

const Hero = () => {
  return (
    <section className="relative z-0 h-screen w-full overflow-hidden md:h-auto">
      {/* Layer 1: Hero bg (z-0) */}
      <Image
        src="/images/hero-img.jpg"
        alt="Hero Image"
        height={810}
        width={1440}
        className="absolute inset-0 z-0 h-full w-full object-cover object-center"
        priority
      />

      {/* Layer 2: Light scrim so dark text stays readable over the photo (z-10) */}
      {/* <div className="absolute inset-0 z-10 bg-white/70" /> */}
      <div className="absolute inset-0 z-10 hidden bg-linear-to-r from-white from-30% via-white/75 via-70% to-transparent md:block" />

      {/* Layer 3: Content (relative z-20) */}
      <div className="relative z-20 mx-auto grid h-full max-w-7xl grid-cols-1 gap-20 px-6 py-48 md:grid-cols-2 md:px-8 lg:px-12">
        {/* Replace the content div with StaggerContainer */}
        <StaggerContainer
          staggerDelay={0.15}
          className="flex flex-col items-start justify-center space-y-4 md:space-y-6"
        >
          <StaggerItem>a
            <h2 className="text-3xl md:text-5xl font-bold font-clash-display text-blue">
              <TextReveal text="Precision, Innovation, Excellence in Geospatial Solutions" />
            </h2>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-2 md:mt-4 text-normal text-gray-900 font-poppins">
              We offer innovative surveying, mapping, and geospatial services
              tailored for various sectors, including construction, oil and gas,
              and real estate projects.
            </p>
          </StaggerItem>

          <StaggerItem className="flex space-x-4 mt-4">
            <button className="bg-green hover:bg-blue transition-colors duration-300 text-white px-6 md:px-8 py-2 md:py-3 rounded-full hover:bg-green-hover">
              <Link href="" className="flex items-center font-medium">
                Services <FaArrowRight className="ml-2" />
              </Link>
            </button>
            <button className="border font-medium border-blue transition-colors duration-300 text-blue px-6 md:px-8 py-2 md:py-3 rounded-full hover:bg-blue hover:text-white">
              <Link href="">Shop Now</Link>
            </button>
          </StaggerItem>
        </StaggerContainer>

        <div></div>
      </div>
    </section>
  );
};

export default Hero;
