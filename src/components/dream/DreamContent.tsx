"use client";

import React from "react";
import { ScrollTextReveal } from "@/components/common/ScrollTextReveal";

export interface DreamContentProps {
  className?: string;
  inView?: boolean;
}

const HEADING = "THE DREAM";

export const DreamContent: React.FC<DreamContentProps> = ({
  className = "",
  inView = true,
}) => {
  return (
    <div className={`flex flex-col justify-between text-left ${className}`}>
      {/* Top text group: Eyebrow, Main Heading, Subtitle, Description */}
      <div className="w-full">
        {/* Eyebrow with a gold rule that draws itself in */}
        <div
          className={`flex items-center gap-3 font-sans text-xs sm:text-sm lg:text-[0.82vw] font-medium tracking-[0.28em] text-[#d4cbbf] uppercase transition-all duration-700 ${
            inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          }`}
        >
          <span
            className="block h-px bg-gradient-to-r from-[#e6c98f] to-[#e6c98f]/0 transition-[width] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
            style={{ width: inView ? "2.6em" : "0em", transitionDelay: "150ms" }}
            aria-hidden="true"
          />
          STAGE 01
        </div>

        {/* Main Heading: each letter drifts in out of a dream haze (blur -> focus) */}
        <div className="mt-2 pb-1">
          <h2
            aria-label={HEADING}
            className="whitespace-nowrap font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.8vw] xl:text-[4.2vw] font-normal leading-[1.08] tracking-[0.025em] text-white uppercase"
          >
            {Array.from(HEADING).map((ch, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="inline-block transition-[opacity,transform,filter] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(45%)",
                  filter: inView ? "blur(0px)" : "blur(10px)",
                  transitionDelay: inView ? `${250 + i * 75}ms` : "0ms",
                }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </h2>
          {/* Gold underline drawn after the letters land */}
          <span
            className="mt-2 block h-px bg-gradient-to-r from-[#e6c98f] via-[#f7e7c1]/80 to-transparent transition-[width] duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
            style={{ width: inView ? "70%" : "0%", transitionDelay: "1000ms" }}
            aria-hidden="true"
          />
        </div>

        {/* Subtitle — Scroll-Based Word Reveal */}
        <div className="mt-3.5 sm:mt-4">
          <ScrollTextReveal
            text="Where her story begins to take shape."
            as="p"
            className="font-serif text-base sm:text-lg lg:text-[1.22vw] leading-[1.45] text-[#f2e7db] italic tracking-wide"
            unrevealedOpacity={0.25}
          />
        </div>

        {/* Paragraph Description — Scroll-Based Word Reveal */}
        <div className="mt-4 sm:mt-5 max-w-[390px] lg:max-w-[26vw]">
          <ScrollTextReveal
            text="The Dream Collection is inspired by the first chapter of every journey — her aspirations, her what-ifs, and the courage to dream it all."
            as="p"
            className="font-sans text-xs sm:text-[13px] lg:text-[0.88vw] leading-[1.85] sm:leading-[1.9] lg:leading-[1.95] text-[#c7bcaf] tracking-[0.015em]"
            unrevealedOpacity={0.25}
          />
        </div>
      </div>

      {/* CTA Button */}
      <div
        className={`pt-8 lg:pt-8 transition-all duration-900 delay-450 ease-out ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById("step-1");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className="group relative inline-flex cursor-pointer items-center space-x-3 overflow-hidden bg-[#fdfbf7] px-6 py-2.5 sm:px-7 sm:py-3 lg:px-6 lg:py-2.5 text-[11px] sm:text-xs lg:text-[0.72vw] font-sans font-medium tracking-[0.2em] text-[#1c1815] uppercase shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-all duration-300 hover:bg-white hover:shadow-black/50 hover:scale-[1.02] active:scale-[0.98]"
        >
          {/* Subtle light sweep */}
          <span
            className="pointer-events-none absolute inset-0 -top-2 -bottom-2 w-1/2 bg-gradient-to-r from-transparent via-black/10 to-transparent animate-btn-sheen"
            aria-hidden="true"
          />

          <span className="relative z-10">EXPLORE THE DREAM</span>
          <span className="relative z-10 text-xs transition-transform duration-300 group-hover:translate-x-1.5">
            →
          </span>
        </button>
      </div>
    </div>
  );
};
