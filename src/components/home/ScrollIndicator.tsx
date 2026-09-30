"use client";

import { smoothScrollTo } from "@/lib/smooth-scroll";
import React from "react";

export interface ScrollIndicatorProps {
  className?: string;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ className = "" }) => {
  const handleClick = () => {
    const el = document.getElementById("story");
    smoothScrollTo(el);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group flex cursor-pointer flex-col items-center gap-2.5 select-none transition-transform duration-300 hover:scale-105 focus-visible:outline-none ${className}`}
      aria-label="Scroll to next section"
    >
      <span className="allura-regular font-allura text-base sm:text-lg text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] tracking-wide transition-colors duration-300 group-hover:text-white">
        Scroll
      </span>

      {/* Vertical Track with Glowing Droplet */}
      <div className="relative h-9 sm:h-11 w-[1.5px] overflow-hidden rounded-full bg-white/30">
        <span
          className="pointer-events-none absolute top-0 left-0 h-4 w-full rounded-full bg-gradient-to-b from-transparent via-[#f8ebd7] to-transparent shadow-[0_0_8px_#f8ebd7] animate-scroll-drop"
          aria-hidden="true"
        />
      </div>
    </button>
  );
};
