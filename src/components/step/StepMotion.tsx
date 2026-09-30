"use client";

import React, { useEffect, useRef } from "react";

/**
 * Living scrapbook layer for STEP 1. Sits over the paper artwork (pointer-events: none) and is
 * driven by scroll, so it plays forward going down and rewinds going up:
 *   - a giant outlined "1" watermark that drifts and unwinds
 *   - a rotating wax-seal ring of type that spins with scroll
 *   - light that sweeps across the photograph
 *   - (desktop) footprints that walk across the paper one after another
 *   - pressed petals that fall and sway forever
 */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const sm = (p: number, a: number, b: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const PETALS = [
  { left: "6%", size: 14, dur: 15, delay: 0, hue: "#b98a4a" },
  { left: "17%", size: 10, dur: 19, delay: -6, hue: "#8a5a2b" },
  { left: "31%", size: 16, dur: 17, delay: -11, hue: "#c9a05a" },
  { left: "48%", size: 11, dur: 21, delay: -3, hue: "#9b6a35" },
  { left: "63%", size: 15, dur: 16, delay: -9, hue: "#b98a4a" },
  { left: "78%", size: 10, dur: 20, delay: -14, hue: "#8a5a2b" },
  { left: "91%", size: 13, dur: 18, delay: -7, hue: "#c9a05a" },
];

// Footprints walk along the bottom strip of the desktop paper (viewBox = artwork pixels)
const STEPS = Array.from({ length: 10 }, (_, i) => ({
  x: 150 + i * 66,
  y: 782 + Math.sin(i * 0.55) * 10 + (i % 2 === 0 ? -15 : 15),
  rot: 82 + Math.sin(i * 0.55) * 6,
  mirror: i % 2 === 0 ? 1 : -1,
}));

const Foot: React.FC = () => (
  <g>
    <path d="M0 -13 C7 -13 9 -4 7 4 C6 10 3 14 0 14 C-3 14 -6 10 -6 4 C-8 -4 -6 -13 0 -13 Z" />
    {[-6, -2.6, 0.6, 3.6, 6.2].map((dx, i) => (
      <circle key={i} cx={dx} cy={-17 - (i === 0 ? 0 : i === 1 ? 1.6 : i === 2 ? 1.2 : i === 3 ? 0.2 : -1)} r={i === 0 ? 2.6 : 2} />
    ))}
  </g>
);

export interface StepMotionProps {
  variant: "desktop" | "mobile";
}

export const StepMotion: React.FC<StepMotionProps> = ({ variant }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const one = <T extends Element>(sel: string) => root.querySelector<T>(sel);
    const numeral = one<HTMLElement>("[data-numeral]");
    const seal = one<HTMLElement>("[data-seal]");
    const sealRing = one<HTMLElement>("[data-seal-ring]");
    const sheen = one<HTMLElement>("[data-sheen]");
    const feet = Array.from(root.querySelectorAll<SVGGElement>("[data-foot]"));

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      // p: 0 as the section enters at the bottom, 1 as it leaves at the top
      const p = clamp01((vh - rect.top) / (vh + rect.height));
      // q: reading progress, 0 when its top hits the lower part of the screen, 1 mid-section
      const q = clamp01((vh * 0.92 - rect.top) / (rect.height * 0.85));

      if (numeral) {
        numeral.style.transform = `translate3d(0, ${(0.5 - p) * 160}px, 0) rotate(${
          -8 + p * 10
        }deg) scale(${0.92 + p * 0.16})`;
        numeral.style.opacity = String(0.35 + 0.65 * sm(q, 0, 0.4));
      }
      if (seal) {
        const e = sm(q, 0.2, 0.55);
        seal.style.opacity = String(e);
        seal.style.transform = `translate3d(0, ${(1 - e) * 40}px, 0) scale(${0.6 + 0.4 * e})`;
      }
      if (sealRing) sealRing.style.transform = `rotate(${p * 900}deg)`;
      if (sheen) {
        const s = sm(q, 0.25, 0.95);
        sheen.style.transform = `translate3d(${-120 + s * 260}%, 0, 0) skewX(-18deg)`;
        sheen.style.opacity = String(Math.sin(s * Math.PI) * 0.9);
      }
      feet.forEach((f, i) => {
        const e = sm(q, 0.3 + i * 0.05, 0.3 + i * 0.05 + 0.06);
        f.style.opacity = String(e * 0.62);
        f.style.transform = `translate(${STEPS[i].x}px, ${STEPS[i].y}px) rotate(${
          STEPS[i].rot
        }deg) scale(${STEPS[i].mirror * (0.5 + 0.5 * e)}, ${0.5 + 0.5 * e})`;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const isDesk = variant === "desktop";

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-0 z-[15] overflow-hidden"
      aria-hidden="true"
    >
      {/* Warm light drifting over the paper */}
      <div
        className="animate-sunbeam absolute inset-0 opacity-40 mix-blend-soft-light"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 30% 25%, rgba(255,236,190,0.85), transparent 70%)",
        }}
      />

      {/* Giant outlined numeral */}
      <div
        data-numeral
        className="absolute font-bodoni leading-none will-change-transform select-none"
        style={{
          left: isDesk ? "1.5%" : "auto",
          right: isDesk ? "auto" : "-6%",
          top: isDesk ? "2%" : "34%",
          fontSize: isDesk ? "min(46vw, 620px)" : "70vw",
          color: "transparent",
          WebkitTextStroke: "1.2px rgba(88,60,36,0.2)",
          opacity: 0.35,
        }}
      >
        1
      </div>

      {/* Petals falling through the whole section */}
      {PETALS.map((pt, i) => (
        <span
          key={i}
          className="animate-step-petal absolute -top-8 block"
          style={
            {
              left: pt.left,
              width: pt.size,
              height: pt.size * 1.5,
              background: pt.hue,
              borderRadius: "70% 30% 70% 30% / 60% 40% 60% 40%",
              opacity: 0.5,
              animationDuration: `${pt.dur}s`,
              animationDelay: `${pt.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}

      {isDesk ? (
        <>
          {/* Footprints across the bottom of the paper */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1952 848"
            preserveAspectRatio="none"
            fill="#5a3c23"
          >
            {STEPS.map((s, i) => (
              <g key={i} data-foot style={{ opacity: 0 }}>
                <Foot />
              </g>
            ))}
          </svg>

          {/* Light sweeping across the photo */}
          <div className="absolute top-[17.5%] left-[44.7%] h-[67%] w-[24.4%] overflow-hidden">
            <div
              data-sheen
              className="absolute inset-y-0 -left-1/4 w-1/2 will-change-transform"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
                mixBlendMode: "overlay",
                opacity: 0,
              }}
            />
          </div>

          {/* Spinning type seal pinned to the photo's corner */}
          <div
            data-seal
            className="absolute top-[7.5%] left-[64.5%] h-[10%] w-[6.2%] will-change-transform"
            style={{ opacity: 0 }}
          >
            <Seal />
          </div>
        </>
      ) : (
        <>
          <div className="absolute top-[39.5%] left-[20.7%] h-[30%] w-[51.4%] -rotate-[3.2deg] overflow-hidden">
            <div
              data-sheen
              className="absolute inset-y-0 -left-1/4 w-1/2 will-change-transform"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
                mixBlendMode: "overlay",
                opacity: 0,
              }}
            />
          </div>
          <div
            data-seal
            className="absolute top-[33.4%] right-[5%] aspect-square w-[24vw] max-w-[130px] will-change-transform"
            style={{ opacity: 0 }}
          >
            <Seal />
          </div>
        </>
      )}
    </div>
  );
};

const Seal: React.FC = () => (
  <div className="relative h-full w-full">
    <div data-seal-ring className="absolute inset-0 will-change-transform">
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <defs>
          <path id="stepSealCircle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text
          fill="#2a1d12"
          fontSize="17.5"
          letterSpacing="4.2"
          fontFamily="var(--font-sans, sans-serif)"
          fontWeight="500"
        >
          <textPath href="#stepSealCircle">
            A SINGLE STEP • CAN CHANGE • EVERYTHING •
          </textPath>
        </text>
      </svg>
    </div>
    <div className="absolute inset-[26%] flex items-center justify-center rounded-full border border-[#2a1d12]/70 bg-[#f4ecdd]/70 backdrop-blur-[1px]">
      <span className="font-bodoni text-[clamp(14px,2.2vw,30px)] leading-none text-[#2a1d12]">1</span>
    </div>
  </div>
);
