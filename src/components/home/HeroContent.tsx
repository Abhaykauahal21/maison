"use client";

import React from "react";
import { FilmCTA } from "@/components/home/FilmCTA";

export interface HeroContentProps {
  className?: string;
  onOpenFilm?: () => void;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  className = "",
  onOpenFilm,
}) => {
  return (
    <div className={`flex max-w-[440px] flex-col text-left text-white ${className}`}>
      {/* Editorial Badge / Collection Marker */}
      <div className="overflow-hidden mb-2 sm:mb-2.5">
        <div className="animate-hero-tag inline-flex items-center gap-2">
          <span className="h-[1px] w-6 bg-[#d6be9f]/60" />
          <span className="font-sans text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.32em] text-[#dfccb5]/90">
            Couture Édition 2026
          </span>
        </div>
      </div>

      {/* Editorial Headline with Staggered Masked Slide-up Reveals */}
      <h1 className="font-bodoni font-normal uppercase text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)] text-[clamp(42px,4.3vw,76px)] leading-[0.93] tracking-[-0.015em]">
        <span className="block overflow-hidden pb-1">
          <span className="block animate-hero-line-1">NOT JUST</span>
        </span>
        <span className="block overflow-hidden pb-1">
          <span className="block animate-hero-line-2">DRESSES,</span>
        </span>
        <span className="block overflow-hidden pb-1">
          <span className="block animate-hero-line-3 bg-gradient-to-r from-white via-[#f7e0be] to-white bg-clip-text text-transparent animate-shimmer-text">
            BUT STORIES.
          </span>
        </span>
      </h1>

      {/* Description - Refined editorial typography with smooth delayed fade up */}
      <p className="animate-hero-desc mt-3.5 max-w-[360px] font-sans text-[13px] leading-[1.58] font-light tracking-[0.015em] text-[#e8ded4] drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] sm:mt-4 sm:text-[14px]">
        Every Maison D’Vine creation is inspired by a story — of her, of you, of every woman who
        dreams, feels, and evolves.
      </p>

      {/* Primary CTA Button - Rectangular, Cream background with subtle luxury light sweep */}
      <div className="animate-hero-cta mt-4 sm:mt-5">
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById("story");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className="group relative inline-flex cursor-pointer items-center space-x-3.5 overflow-hidden rounded-none bg-[#f2e7db] px-7 py-3 text-xs font-sans font-medium tracking-[0.15em] text-[#141210] uppercase shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all duration-300 hover:bg-white hover:shadow-[0_8px_30px_rgba(242,231,219,0.25)] hover:scale-[1.02] active:scale-[0.98] sm:text-[13px]"
        >
          {/* Subtle diagonal light sheen passing over button */}
          <span
            className="pointer-events-none absolute inset-0 -top-2 -bottom-2 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-btn-sheen"
            aria-hidden="true"
          />

          <span className="relative z-10">READ OUR STORY</span>
          <span className="relative z-10 text-sm transition-transform duration-300 group-hover:translate-x-1.5">
            →
          </span>
        </button>
      </div>

      {/* Secondary Watch the Film CTA */}
      <div className="animate-hero-film mt-4 sm:mt-5">
        <FilmCTA onClick={onOpenFilm} />
      </div>
    </div>
  );
};
