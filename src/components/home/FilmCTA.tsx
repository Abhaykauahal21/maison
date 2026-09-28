"use client";

import React from "react";
import { Play } from "lucide-react";

export interface FilmCTAProps {
  onClick?: () => void;
  className?: string;
}

export const FilmCTA: React.FC<FilmCTAProps> = ({ onClick, className = "" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex cursor-pointer items-center gap-4 text-left select-none focus-visible:outline-none ${className}`}
      aria-label="Watch the film"
    >
      {/* Container with Animated Expanding Aura Rings */}
      <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center">
        {/* Outer Aura Ring 1 */}
        <span
          className="pointer-events-none absolute inset-0 rounded-full border border-[#f5dfb8]/40 animate-aura-1"
          aria-hidden="true"
        />

        {/* Outer Aura Ring 2 */}
        <span
          className="pointer-events-none absolute inset-0 rounded-full border border-white/30 animate-aura-2"
          aria-hidden="true"
        />

        {/* Core Circular Play Button */}
        <div className="relative flex h-full w-full items-center justify-center rounded-full border border-white/80 bg-black/25 backdrop-blur-[2px] shadow-[0_0_15px_rgba(255,255,255,0.12)] transition-all duration-300 group-hover:scale-110 group-hover:border-[#f5dfb8] group-hover:bg-[#f5dfb8]/15 group-hover:shadow-[0_0_20px_rgba(245,223,184,0.3)] group-active:scale-95">
          <Play className="h-3.5 w-3.5 translate-x-[1px] stroke-[1.6] text-white transition-colors duration-300 group-hover:text-[#fbf4eb] fill-white/10" />
        </div>
      </div>

      {/* Stacked Text: WATCH / THE FILM */}
      <div className="flex flex-col font-sans text-[9.5px] sm:text-[10.5px] leading-[1.3] font-medium tracking-[0.22em] text-white/85 uppercase transition-all duration-300 group-hover:text-white group-hover:translate-x-1">
        <span>WATCH</span>
        <span className="text-[#e2d5c5] group-hover:text-white">THE FILM</span>
      </div>
    </button>
  );
};
