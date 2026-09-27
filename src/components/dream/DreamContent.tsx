"use client";

import React from "react";

export interface DreamContentProps {
  className?: string;
}

export const DreamContent: React.FC<DreamContentProps> = ({ className = "" }) => {
  return (
   <div className={`flex flex-col justify-between text-left ${className}`}>

  {/* Top text group: Eyebrow, Main Heading, Subtitle, Description */}
  <div className="w-full">

    {/* Eyebrow */}
    <div className="font-sans text-xs sm:text-sm lg:text-[0.82vw] font-medium tracking-[0.28em] text-[#d4cbbf] uppercase">
      STAGE 01
    </div>

    {/* Main Heading — ONE LINE */}
    <h2 className="mt-2 whitespace-nowrap font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4.8vw] xl:text-[5.2vw] font-normal leading-[0.92] tracking-[0.01em] text-white uppercase">
      THE DREAM
    </h2>

    {/* Subtitle */}
    <p className="mt-3 font-serif text-lg sm:text-xl lg:text-[1.3vw] text-[#e8dfd5] italic tracking-wide">
      Where her story begins to take shape.
    </p>

    {/* Paragraph Description */}
    <p className="mt-4 max-w-[370px] font-sans text-sm sm:text-[14px] lg:max-w-[22vw] lg:text-[0.9vw] leading-[1.65] text-[#c7bcaf] tracking-[0.01em]">
      The Dream Collection is inspired by the first chapter of every journey — her aspirations,
      her what-ifs, and the courage to dream it all.
    </p>

  </div>

  {/* CTA Button */}
  <div className="pt-6 lg:pt-0">

    <button
      type="button"
      className="group inline-flex cursor-pointer items-center space-x-3 bg-[#fdfbf7] px-5 py-2.5 sm:px-6 sm:py-3 lg:px-5 lg:py-2.5 text-[11px] sm:text-xs lg:text-[0.72vw] font-sans font-medium tracking-[0.18em] text-[#1c1815] uppercase transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-black/40 hover:scale-[1.02] active:scale-[0.98]"
    >
      <span>EXPLORE THE DREAM</span>

      <span className="text-xs transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </button>

  </div>

</div>
  );
};
