"use client";

import React from "react";

/** Hand-torn outline as a % polygon, so the card scales with the scrapbook page. */
const tornCard = (() => {
  const wob = (t: number, seed: number) =>
    (Math.sin(t * 1.1 + seed) * 0.5 + Math.sin(t * 2.7 + seed * 2) * 0.3 + Math.sin(t * 6.1 + seed * 3) * 0.2 + 1) / 2;
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) pts.push(`${(i * 2.5).toFixed(1)}% ${(wob(i, 1.7) * 2.6).toFixed(2)}%`);
  for (let i = 1; i <= 30; i++) pts.push(`${(100 - wob(i, 2.9) * 2.2).toFixed(2)}% ${(i * (100 / 30)).toFixed(1)}%`);
  for (let i = 40; i >= 0; i--) pts.push(`${(i * 2.5).toFixed(1)}% ${(100 - wob(i, 4.3) * 2.6).toFixed(2)}%`);
  for (let i = 29; i >= 1; i--) pts.push(`${(wob(i, 5.5) * 2.2).toFixed(2)}% ${(i * (100 / 30)).toFixed(1)}%`);
  return `polygon(${pts.join(", ")})`;
})();

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .35 0 0 0 0 .27 0 0 0 0 .18 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.28'/%3E%3C/svg%3E\")";

const TAPE_CLIP =
  "polygon(0 8%, 4% 0, 8% 10%, 12% 0, 92% 0, 96% 10%, 100% 0, 100% 92%, 96% 100%, 92% 90%, 88% 100%, 8% 100%, 4% 92%, 0 100%)";

const LINES = [
  { text: "It always", pad: "0" },
  { text: "starts with", pad: "9%" },
  { text: "a single step.", pad: "3%" },
];

export interface StepQuoteCardProps {
  inView?: boolean;
  className?: string;
}

/**
 * Paper card laid over the scrapbook's right-hand side. It covers the quote that is baked into
 * the background artwork, so it is always in place (never animated in, or the old text would show
 * behind it); only the live cursive text writes itself in.
 */
export const StepQuoteCard: React.FC<StepQuoteCardProps> = ({ inView = true, className = "" }) => (
  <div
    className={`-rotate-[10deg] ${className}`}
    style={{ filter: "drop-shadow(0 6px 10px rgba(50,34,18,0.28))" }}
    aria-label="It always starts with a single step."
  >
    <div
      className="relative h-full w-full"
      style={{
        clipPath: tornCard,
        backgroundColor: "#f6eedf",
        backgroundImage: `${GRAIN}, linear-gradient(160deg, #fbf5e9 0%, #f4ebd9 55%, #ece0c8 100%)`,
        backgroundBlendMode: "multiply, normal",
      }}
    >
      <div className="flex h-full w-full flex-col justify-center px-[9%] py-[7%] select-none">
        {LINES.map((l, i) => (
          <span
            key={l.text}
            className={`block font-allura allura-regular font-script font-cursive text-[2.9vw] leading-[1.12] text-[#1c1815] ${inView ? "echo-story-ink" : "opacity-0"}`}
            style={{ paddingLeft: l.pad, animationDelay: `${1.1 + i * 0.5}s` }}
          >
            {l.text}
          </span>
        ))}
      </div>
    </div>

    {/* washi tape holding the card */}
    <span
      aria-hidden="true"
      className="absolute -top-[2.6%] left-[8%] h-[6%] w-[26%] -rotate-[28deg] bg-[#d6c291]/85 shadow-[0_1px_2px_rgba(60,40,20,0.25)]"
      style={{ clipPath: TAPE_CLIP }}
    />
  </div>
);
