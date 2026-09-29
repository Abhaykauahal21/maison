"use client";

import React from "react";
import { FilmCTA } from "@/components/home/FilmCTA";

export interface HeroContentProps {
  className?: string;
  onOpenFilm?: () => void;
  /** "editorial": side-by-side desktop/landscape layout. "stacked": phones and portrait tablets. */
  layout?: "editorial" | "stacked";
}

export const HeroContent: React.FC<HeroContentProps> = ({
  className = "",
  onOpenFilm,
  layout = "editorial",
}) => {
  const stacked = layout === "stacked";
  return (
    <div
      className={`flex flex-col text-left text-white ${
        stacked ? "max-w-[420px] sm:max-w-[540px]" : "max-w-[420px]"
      } ${className}`}
    >
      {/* Editorial Headline matching reference composition */}
      <h1
        className={`font-bodoni font-normal uppercase text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.65)] ${
          stacked ? "text-[clamp(30px,min(9vw,6.5vh),68px)]" : "text-[clamp(36px,4.1vw,66px)]"
        } leading-[0.95] tracking-[-0.015em]`}
      >
        <span className="block overflow-hidden pb-1">
          <span className="block animate-hero-line-1">NOT JUST</span>
        </span>
        <span className="block overflow-hidden pb-1">
          <span className="block animate-hero-line-2">DRESSES,</span>
        </span>
        <span className="block overflow-hidden pb-1">
          <span className="block animate-hero-line-3 text-white">
            BUT STORIES.
          </span>
        </span>
      </h1>

      {/* Description - 3-line refined typography */}
      <p className={`animate-hero-desc mt-3.5 font-sans text-[12.5px] sm:text-[13.5px] ${stacked ? "max-w-[335px] sm:max-w-[430px] md:text-[15px]" : "max-w-[335px]"} leading-[1.58] font-light tracking-[0.015em] text-[#eae2d8] drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)] sm:mt-4`}>
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
