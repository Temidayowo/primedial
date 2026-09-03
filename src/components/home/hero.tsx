"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { StaggerContainer, StaggerItem, TextReveal } from "@/components/ui/MotionWrapper"; 

const Hero = () => {
  return (
    <section className="relative h-screen md:h-auto w-full overflow-hidden">
      {/* Layer 1: Hero bg (z-0) */}
      <Image
        src="/images/hero-img.jpg"
        alt="Hero Image"
        fill
        className="object-cover object-center z-0 opacity-75"
        priority
      />

      {/* Layer 2: White overlay (z-10) */}
      {/* <div className="hidden md:block absolute inset-0 z-10 bg-linear-to-r from-white from-25% to-transparent" /> */}

      {/* Layer 3: Content (relative z-20) */}
      <div className="relative z-20 mx-auto grid h-full max-w-7xl grid-cols-1 gap-20 px-6 py-48 md:grid-cols-2 md:px-8 lg:px-12">
        
        {/* Replace the content div with StaggerContainer */}
        <StaggerContainer staggerDelay={0.15} className="flex flex-col items-start justify-center space-y-4 md:space-y-6">
          
          <StaggerItem>
            <h2 className="text-3xl md:text-5xl font-bold font-clash-display text-blue">
              <TextReveal text="Precision, Innovation, Excellence in Geospatial Solutions" />
            </h2>
          </StaggerItem>
          
          <StaggerItem>
            <p className="mt-2 md:mt-4 text-normal text-gray-800 font-poppins">
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