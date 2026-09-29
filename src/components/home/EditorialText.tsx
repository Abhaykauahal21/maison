import React from "react";

export interface EditorialTextProps {
  className?: string;
}

export const EditorialText: React.FC<EditorialTextProps> = ({ className = "" }) => {
  return (
    <div
      className={`allura-regular font-allura -rotate-[7deg] text-3xl leading-[1.1] text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] select-none sm:text-4xl sm:leading-[1.1] md:text-[44px] lg:text-[50px] ${className}`}
      aria-hidden="true"
    >
      <div className="flex flex-col tracking-wide">
        <span className="animate-hero-script pl-1" style={{ "--i": 0 } as React.CSSProperties}>Different</span>
        <span className="animate-hero-script pl-5 sm:pl-7" style={{ "--i": 1 } as React.CSSProperties}>Stories</span>
        <span className="animate-hero-script pl-3 sm:pl-4" style={{ "--i": 2 } as React.CSSProperties}>Same</span>
        <span className="animate-hero-script relative inline-block pl-1 sm:pl-2" style={{ "--i": 3 } as React.CSSProperties}>
          Sisterhood
          <svg
            className="absolute -bottom-2 -left-1 w-[105%] h-3 text-white/85 pointer-events-none overflow-visible"
            viewBox="0 0 100 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 4C25 10 70 10 98 2"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              pathLength={1}
              className="animate-hero-underline"
            />
          </svg>
        </span>
      </div>
    </div>
  );
};
