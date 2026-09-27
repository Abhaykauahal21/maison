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
      className={`group flex cursor-pointer items-center gap-4 text-left transition-transform duration-300 select-none focus-visible:outline-none ${className}`}
      aria-label="Watch the film"
    >
      {/* Circular Play Button - Thin & Elegant, Unfilled */}
      <div className="flex h-10 w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12 items-center justify-center rounded-full border border-white/70 bg-transparent shadow-sm transition-all duration-300 group-hover:scale-108 group-hover:border-white group-hover:bg-white/10 group-active:scale-95">
        <Play className="h-3 w-3 sm:h-3.5 sm:w-3.5 translate-x-[1px] stroke-[1.5] text-white fill-none" />
      </div>

      {/* Stacked Text: WATCH / THE FILM */}
      <div className="flex flex-col font-sans text-[9.5px] sm:text-[10px] lg:text-[11px] leading-[1.3] font-medium tracking-[0.22em] text-white/90 uppercase transition-colors group-hover:text-white">
        <span>WATCH</span>
        <span>THE FILM</span>
      </div>
    </button>
  );
};
