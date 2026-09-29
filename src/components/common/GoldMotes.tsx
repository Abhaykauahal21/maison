"use client";

import React from "react";

export interface GoldMotesProps {
  count?: number;
  className?: string;
}

/**
 * Drifting golden dust. Positions come from a deterministic formula (no Math.random)
 * so server and client markup always agree. Uses .animate-closer-mote from globals.css.
 */
export const GoldMotes: React.FC<GoldMotesProps> = ({ count = 18, className = "" }) => (
  <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
    {Array.from({ length: count }, (_, i) => (
      <span
        key={i}
        className="animate-closer-mote absolute rounded-full bg-[#e6c98f]"
        style={
          {
            left: `${((i * 37 + 13) % 90) + 5}%`,
            top: `${((i * 53 + 7) % 78) + 12}%`,
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            boxShadow: "0 0 8px 1px rgba(230, 201, 143, 0.7)",
            animationDuration: `${6 + (i % 5) * 1.5}s`,
            animationDelay: `${1 + (i % 7) * 0.8}s`,
            "--dx": `${(i % 2 === 0 ? 1 : -1) * (8 + (i % 4) * 6)}px`,
          } as React.CSSProperties
        }
      />
    ))}
  </div>
);
