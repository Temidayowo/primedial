"use client";

import * as React from "react";
// Ensure this import path points to where you saved your animation utilities
import { StaggerContainer, StaggerItem, TextReveal } from "@/components/ui/MotionWrapper";

const testimonials = [
  {
    id: 1,
    name: "Oluwaseun Adebayo",
    role: "Chief Surveyor, Meridian Geo-Systems",
    content: "The Trimble R12i we procured has completely transformed our workflow. The accuracy in challenging canopy environments is unmatched, and the customer support was exceptional.",
    rating: 5,
  },
  {
    id: 2,
    name: "Emeka Nnamdi",
    role: "Project Manager, CT EDGE Construction",
    content: "Fast delivery and highly reliable equipment. We have been sourcing our Leica Total Stations here for over two years, and the calibration is always spot-on right out of the box.",
    rating: 5,
  },
  {
    id: 3,
    name: "Aisha Bello",
    role: "GIS Specialist, BHL Real Estate",
    content: "Excellent service! They helped us transition to newer RTK GPS systems effortlessly. Their technical advice saved us both time and money on our latest mapping project.",
    rating: 5,
  },
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <StaggerContainer staggerDelay={0.15} className="mx-auto max-w-7xl px-6 lg:px-10">
        
        <div className="text-center mb-12">
          <StaggerItem>
            <h2 className="font-clash-display text-2xl md:text-3xl lg:text-4xl font-bold text-blue">
              <TextReveal text="What Our Clients Say" />
            </h2>
          </StaggerItem>
          
          <StaggerItem>
            <p className="mt-4 text-gray-500 font-poppins text-sm md:text-base max-w-2xl mx-auto">
              Trusted by industry professionals, civil engineers, and GIS specialists to deliver high-precision surveying equipment on time.
            </p>
          </StaggerItem>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.id} className="h-full">
              <div className="flex h-full flex-col justify-between bg-[#F8FAFC] p-8 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                <div>
                  <StarRating rating={testimonial.rating} />
                  <p className="text-gray-600 italic font-poppins text-sm leading-relaxed mb-6">
                    "{testimonial.content}"
                  </p>
                </div>
                
                <div className="flex items-center gap-4 mt-auto border-t border-gray-200 pt-4">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue text-white font-bold font-clash-display">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-blue font-poppins">
                      {testimonial.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 font-poppins">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </div>
        
      </StaggerContainer>
    </section>
  );
}