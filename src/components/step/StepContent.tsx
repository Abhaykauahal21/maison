"use client";

import React from "react";
import { ScrollTextReveal } from "@/components/common/ScrollTextReveal";

export interface StepContentProps {
  className?: string;
  inView?: boolean;
}

export const StepContent: React.FC<StepContentProps> = ({
  className = "",
  inView = true,
}) => {
  return (
    <div
      className={`relative flex h-full w-full flex-col justify-between text-left ${className}`}
    >
      {/* LEFT CONTENT */}
      <div className="absolute left-0 top-0 flex flex-col">
        {/* Main Heading — Masked Curtain Slide Up */}
        <div className="overflow-hidden pb-1">
          <h2
            className={`font-bodoni text-6xl sm:text-7xl md:text-7xl lg:text-[4.8vw] xl:text-[5.1vw] font-normal leading-[0.9] tracking-[0.015em] text-[#120e0a] uppercase whitespace-nowrap transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              inView ? "translate-y-0 opacity-100" : "translate-y-[115%] opacity-0"
            }`}
          >
            STEP 1
          </h2>
        </div>

        {/* Ink underline drawn after the heading lands */}
        <span
          className="mt-1 block h-[2px] bg-gradient-to-r from-[#1c1815] via-[#1c1815]/70 to-transparent transition-[width] duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
          style={{ width: inView ? "78%" : "0%", transitionDelay: "800ms" }}
          aria-hidden="true"
        />

        {/* Subtitle — Scroll-Based Word Reveal */}
        <div className="mt-3">
          <ScrollTextReveal
            text="A single step can change the direction of her entire story."
            as="p"
            className="font-serif text-lg sm:text-xl md:text-xl lg:text-[1.4vw] xl:text-[1.45vw] font-normal leading-[1.2] text-[#2a221a] tracking-wide"
            unrevealedOpacity={0.25}
          />
        </div>

        {/* Description — Scroll-Based Word Reveal */}
        <div className="mt-5 max-w-[400px] sm:max-w-[420px] lg:max-w-[24vw]">
          <ScrollTextReveal
            text="Step 1 is for the woman who has started — who knows that every big story begins with a brave, beautiful first step."
            as="p"
            className="font-sans text-[15px] sm:text-base md:text-base lg:text-[0.95vw] xl:text-[0.98vw] leading-[1.65] text-[#4a3e33] tracking-[0.01em]"
            unrevealedOpacity={0.25}
          />
        </div>

        {/* CTA */}
        <div
          className={`mt-7 transition-all duration-900 delay-450 ease-out ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <button
            type="button"
            className="group relative inline-flex cursor-pointer items-center space-x-4 overflow-hidden border border-[#221c17] bg-transparent px-7 py-3.5 sm:px-8 sm:py-4 lg:px-7 lg:py-3 text-xs sm:text-sm lg:text-[0.8vw] font-sans font-medium tracking-[0.2em] text-[#1c1815] uppercase shadow-sm transition-all duration-300 hover:bg-[#1c1815] hover:text-[#f7f4ee] hover:shadow-lg active:scale-[0.98]"
          >
            <span className="relative z-10">EXPLORE STEP 1</span>
            <span className="relative z-10 text-sm transition-transform duration-300 group-hover:translate-x-1.5">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};