import React from "react";

export interface ScrollIndicatorProps {
  className?: string;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ className = "" }) => {
  return (
    <div className={`flex flex-col items-center gap-2 select-none ${className}`} aria-hidden="true">
      <span className="font-serif text-xs tracking-wider text-white/80 italic">Scroll</span>
      <div className="animate-pulse-line h-10 w-[1px] origin-top bg-white/70 sm:h-12" />
    </div>
  );
};
