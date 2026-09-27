"use client";

import React from "react";

export interface StepQuoteProps {
  className?: string;
}

export const StepQuote: React.FC<StepQuoteProps> = ({ className = "" }) => {
  return (
    <div
      className={`font-script -rotate-[4deg] text-left text-2xl sm:text-3xl lg:text-[2.2vw] leading-[1.05] text-[#1c1815] select-none ${className}`}
      aria-label="It always starts with a single step."
    >
      <div>It always</div>
      <div className="pl-1">starts with</div>
      <div className="pl-0.5">a single step.</div>
    </div>
  );
};
