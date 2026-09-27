import React from "react";

export interface EditorialTextProps {
  className?: string;
}

export const EditorialText: React.FC<EditorialTextProps> = ({ className = "" }) => {
  return (
    <div
      className={`font-script -rotate-[7deg] text-3xl leading-[1.05] text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] select-none sm:text-4xl sm:leading-[1.08] md:text-[42px] lg:text-[46px] ${className}`}
      aria-hidden="true"
    >
      <div className="flex flex-col tracking-wide">
        <span className="pl-1">Different</span>
        <span className="pl-5 sm:pl-7">Stories</span>
        <span className="pl-3 sm:pl-4">Same</span>
        <span className="pl-1 sm:pl-2">Sisterhood</span>
      </div>
    </div>
  );
};
