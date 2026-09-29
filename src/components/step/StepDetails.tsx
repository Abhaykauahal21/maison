"use client";

import React from "react";

export interface StepDetailsProps {
  className?: string;
  inView?: boolean;
}

export const StepDetails: React.FC<StepDetailsProps> = ({
  className = "",
  inView = true,
}) => {
  return (
    <div
      className={`flex translate-x-[2vw] translate-y-[1.2vw] flex-col text-left transition-all duration-900 delay-350 ease-out ${
        inView ? "opacity-100 translate-y-[1.2vw]" : "opacity-0 translate-y-[3vw]"
      } ${className}`}
    >
      {/* Rule that draws itself in */}
      <span
        className="mb-3 block h-px bg-[#1c1815]/70 transition-[width] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
        style={{ width: inView ? "3.4vw" : "0vw", transitionDelay: "900ms" }}
        aria-hidden="true"
      />

      {/* Title: THE BEGINNING */}
      <h3 className="font-bodoni text-sm sm:text-base lg:text-[1.05vw] font-normal tracking-[0.22em] text-[#1c1815] uppercase">
        THE BEGINNING
      </h3>

      {/* Description */}
      <p className="mt-2.5 font-serif text-xs sm:text-sm lg:text-[0.82vw] leading-[1.35] text-[#4a3e33] italic tracking-wide">
        A step towards
        <br />
        becoming her.
      </p>

      {/* Action link */}
      <div className="group mt-4 inline-flex cursor-pointer items-center space-x-2.5 text-[10px] sm:text-xs lg:text-[0.72vw] font-sans font-medium tracking-[0.2em] text-[#221c17] uppercase transition-colors hover:text-black">
        <span>VIEW DETAILS</span>
        <span className="text-xs lg:text-[0.8vw] transition-transform duration-300 group-hover:translate-x-1.5">
          →
        </span>
      </div>
    </div>
  );
};