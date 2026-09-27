import React from "react";
import { ArrowRight } from "lucide-react";

export interface EditorialCTAProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export const EditorialCTA: React.FC<EditorialCTAProps> = ({
  children = "EXPLORE THE ECHO",
  className = "",
  ...props
}) => {
  return (
    <button
      type="button"
      className={`group inline-flex cursor-pointer items-center justify-center gap-3 border border-[#756555]/40 bg-[#f3ede4]/80 px-7 py-3 font-sans text-[11px] font-medium tracking-[0.22em] text-[#241d18] uppercase transition-all duration-300 select-none hover:border-[#4a3e33] hover:bg-[#ede5da] hover:shadow-xs active:bg-[#e4dcce] ${className}`}
      {...props}
    >
      <span>{children}</span>
      <ArrowRight className="h-3.5 w-3.5 stroke-[1.6] text-[#241d18] transition-transform duration-300 group-hover:translate-x-1" />
    </button>
  );
};
