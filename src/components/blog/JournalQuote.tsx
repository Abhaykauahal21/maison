"use client";

import React from "react";

interface JournalQuoteProps {
  className?: string;
  inView?: boolean;
}

export const JournalQuote: React.FC<JournalQuoteProps> = ({ className = "", inView = true }) => {
  const lines: [string, string][] = [
    ["More than fashion,", ""],
    ["Stories that", "pl-4 sm:pl-6 md:pl-8"],
    ["Stay with you.", "pl-8 sm:pl-12 md:pl-16"],
  ];
  return (
    <div
      className={`select-none pointer-events-none transition-all duration-1000 ease-out ${className}`}
      aria-hidden="true"
    >
      <p className="font-allura allura-regular font-script font-cursive text-3xl sm:text-4xl md:text-[3.2vw] lg:text-[3.6rem] leading-[1.08] text-white/95 -rotate-[4deg] origin-top-left tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)]">
        {lines.map(([text, pad], i) => (
          <span
            key={text}
            className={`block ${pad} ${inView ? "animate-india-script" : "opacity-0"}`}
            style={{ "--i": i, "--d": "0.9s" } as React.CSSProperties}
          >
            {text}
          </span>
        ))}
      </p>
    </div>
  );
};
