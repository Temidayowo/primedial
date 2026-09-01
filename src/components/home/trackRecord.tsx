"use client";

import { AnimatedCounter } from "@/components/ui/MotionWrapper";
import { AnimateOnScroll, fadeUp } from "@/components/ui/MotionWrapper";

const stats = [
  { target: 6, suffix: "+", label: "Years Experience" },
  { target: 350, suffix: "+", label: "Projects Completed" },
  { target: 7, suffix: "+", label: "Industries Served" },
  { target: 100, suffix: "%", label: "Surcon / MNIS Certified" },
];

const TrackRecord = () => {
  return (
    <section className="bg-gray-50 py-20 border-y border-gray-200">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-4 md:gap-8">
          {stats.map((stat, i) => (
            <AnimateOnScroll
              key={stat.label}
              variants={fadeUp}
              delay={i * 0.1}
              className="flex flex-col items-center justify-center space-y-3"
            >
              {/* Massive, bold, dark numbers */}
              <div className="text-5xl font-extrabold text-[#111827] sm:text-6xl tracking-tight font-clash-display">
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  duration={2}
                />
              </div>

              {/* Small, uppercase, gray labels with wide letter spacing */}
              <p className="text-sm font-semibold tracking-widest text-gray-500 uppercase font-poppins">
                {stat.label}
              </p>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrackRecord;