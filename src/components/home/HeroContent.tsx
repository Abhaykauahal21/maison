"use client";

import React from "react";
import { FilmCTA } from "@/components/home/FilmCTA";

export interface HeroContentProps {
  className?: string;
}

export const HeroContent: React.FC<HeroContentProps> = ({ className = "" }) => {
  return (
    <div className={`flex max-w-[440px] flex-col text-left text-white ${className}`}>
      {/* Editorial Headline - High-Contrast Luxury Serif (Bodoni Moda / Cormorant Garamond) */}
      <h1 className="font-bodoni font-normal uppercase text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)] text-[clamp(44px,4.5vw,82px)] leading-[0.93] tracking-[-0.015em]">
        <span>NOT JUST</span>
        <br />
        <span>DRESSES,</span>
        <br />
        <span>BUT STORIES.</span>
      </h1>

      {/* Description - Refined editorial typography with exact em-dash */}
      <p className="mt-5 max-w-[360px] font-sans text-[13px] leading-[1.62] font-light tracking-[0.015em] text-[#e8ded4] drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] sm:mt-6 sm:text-[14.5px]">
        Every Maison D’Vine creation is inspired by a story — of her, of you, of every woman who
        dreams, feels, and evolves.
      </p>

      {/* Primary CTA Button - Rectangular, Cream background, Dark text, Editorial style */}
      <div className="mt-6 sm:mt-7">
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById("story");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className="group inline-flex cursor-pointer items-center space-x-3.5 rounded-none bg-[#f2e7db] px-7 py-3.5 text-xs font-sans font-medium tracking-[0.15em] text-[#141210] uppercase transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-black/30 hover:scale-[1.01] active:scale-[0.98] sm:text-[13px]"
        >
          <span>READ OUR STORY</span>
          <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>

      {/* Secondary Watch the Film CTA */}
      <div className="mt-7 sm:mt-8">
        <FilmCTA />
      </div>
    </div>
  );
};
