"use client";

import React, { useEffect, useRef, useState } from "react";

const BRAND = "MAISON D’VINE";

// The atelier's captions: what is being done while the site loads; the last is the brand promise
const CAPTIONS = [
  "Taking measures…",
  "Cutting the cloth…",
  "Stitching the story…",
  "Not just dresses, but stories.",
];

// The gown, stitched in one thread (viewBox 300 x 520). Outline first, then the waist and folds.
const GOWN_OUTLINE =
  "M124 26 C126 50 134 66 150 84 C166 66 174 50 176 26 C178 60 184 84 186 104 C184 130 168 150 170 172 C176 262 226 382 238 494 C212 514 178 504 150 514 C122 504 88 514 62 494 C74 382 124 262 130 172 C132 150 116 130 114 104 C116 84 122 60 124 26 Z";
const GOWN_DETAILS = [
  "M131 174 C146 182 154 182 169 174", // waist seam
  "M150 184 C146 270 130 380 104 500", // fold
  "M150 184 C154 270 170 380 196 502", // fold
  "M141 184 C128 262 98 372 82 496", // fold
  "M159 184 C172 262 202 372 218 496", // fold
  "M150 84 C150 110 150 140 150 172", // centre seam
];

// The point of the gown the final zoom dives into (inside the skirt)
const DIVE = { x: 150, y: 400 };

const MIN_MS = 3200; // never flash: the gown always gets time to be stitched
const MAX_MS = 6000; // never hang: give up waiting for slow assets
const RUNWAY_MS = MIN_MS - 400;
const ZOOM_MS = 1900;

type Phase = "loading" | "fading" | "opening" | "done";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const sm = (t: number) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};
const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const easeInOut = (t: number) => {
  const c = clamp01(t);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};

export const SiteLoader: React.FC = () => {
  const [phase, setPhase] = useState<Phase>("loading");
  const [lettersShown, setLettersShown] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);

  const slotRef = useRef<HTMLDivElement | null>(null);
  const drawRef = useRef<SVGGElement | null>(null); // the thread layer
  const holeGRef = useRef<SVGGElement | null>(null); // the gown-shaped window in the paper
  const holeRef = useRef<SVGPathElement | null>(null);
  const outlineRef = useRef<SVGPathElement | null>(null);
  const glowRef = useRef<SVGPathElement | null>(null);
  const detailRefs = useRef<(SVGPathElement | null)[]>([]);
  const needleRef = useRef<SVGGElement | null>(null);
  const tapeRef = useRef<HTMLDivElement | null>(null);
  const capRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Lock scroll during loading, and always begin from the top (hero), even after a reload
    document.body.style.overflow = "hidden";
    try {
      window.history.scrollRestoration = "manual";
    } catch {
      /* not supported */
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minMs = reduce ? 700 : MIN_MS;
    const runway = reduce ? 500 : RUNWAY_MS;

    const outline = outlineRef.current;
    const glow = glowRef.current;
    const needle = needleRef.current;
    const details = detailRefs.current.filter((d): d is SVGPathElement => !!d);
    const len = outline ? outline.getTotalLength() : 0;

    // Where the gown sits on screen (measured from its slot in the layout)
    const base = { s: 1, ax: 0, ay: 0 }; // scale, and the screen position of the dive point
    const place = (s: number, ax: number, ay: number) => {
      const t = `translate(${(ax - DIVE.x * s).toFixed(2)} ${(ay - DIVE.y * s).toFixed(2)}) scale(${s.toFixed(4)})`;
      drawRef.current?.setAttribute("transform", t);
      holeGRef.current?.setAttribute("transform", t);
    };
    const measure = () => {
      const slot = slotRef.current;
      if (!slot) return;
      const r = slot.getBoundingClientRect();
      base.s = r.height / 520;
      base.ax = r.left + DIVE.x * base.s;
      base.ay = r.top + DIVE.y * base.s;
      place(base.s, base.ax, base.ay);
    };
    measure();
    window.addEventListener("resize", measure);

    let loaded = document.readyState === "complete";
    const onLoad = () => {
      loaded = true;
    };
    if (!loaded) window.addEventListener("load", onLoad, { once: true });

    let raf = 0;
    let zoomRaf = 0;
    let finishing = false;
    let finishStart = 0;
    let finishFrom = 0;
    let lastLetters = -1;
    let lastLine = -1;
    const timers: number[] = [];
    const start = performance.now();

    // Everything that follows progress is written straight to the DOM (no per-frame re-render)
    const apply = (p: number) => {
      // the outline is stitched first (first 72% of the progress), the details after
      const o = clamp01(p / 0.72);
      const off = (1 - o).toFixed(4);
      if (outline) outline.style.strokeDashoffset = off;
      if (glow) glow.style.strokeDashoffset = off;
      if (outline && needle && len) {
        const at = Math.min(len, len * o);
        const a = outline.getPointAtLength(at);
        const b = outline.getPointAtLength(Math.min(len, at + 2));
        const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
        needle.setAttribute(
          "transform",
          `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${angle.toFixed(1)})`
        );
        needle.style.opacity = o > 0.004 && o < 0.995 ? "1" : "0";
      }
      details.forEach((d, i) => {
        const e = sm((p - 0.68 - i * 0.04) / 0.22);
        d.style.strokeDashoffset = (1 - e).toFixed(4);
      });

      // the measuring tape is pulled out
      if (tapeRef.current) tapeRef.current.style.clipPath = `inset(0 ${((1 - p) * 100).toFixed(2)}% 0 0)`;
      if (capRef.current) capRef.current.style.left = `${(p * 100).toFixed(2)}%`;
      if (counterRef.current) counterRef.current.textContent = String(Math.round(p * 100)).padStart(3, "0");

      const letters = Math.ceil(Math.min(1, p / 0.85) * BRAND.length);
      if (letters !== lastLetters) {
        lastLetters = letters;
        setLettersShown(letters);
      }
      const line = p < 0.25 ? 0 : p < 0.55 ? 1 : p < 0.88 ? 2 : 3;
      if (line !== lastLine) {
        lastLine = line;
        setLineIdx(line);
      }
    };

    // The finale: the gown becomes a window onto the site, then the window grows until it is the screen
    const zoom = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      // big enough that the skirt's (narrower) upper part still spans the screen
      const sEnd = (1.2 * (W + 0.21 * H)) / 136 + 0.5;
      const z0 = performance.now();
      const step = (now: number) => {
        const q = clamp01((now - z0) / ZOOM_MS);
        const e = easeInOut(q);
        const s = base.s * Math.pow(sEnd / base.s, e);
        place(s, base.ax + (W / 2 - base.ax) * e, base.ay + (H / 2 - base.ay) * e);
        if (drawRef.current) drawRef.current.style.opacity = String(1 - sm(q / 0.35));
        if (q < 1) zoomRaf = requestAnimationFrame(step);
        else {
          setPhase("done");
          document.body.style.overflow = "";
        }
      };
      zoomRaf = requestAnimationFrame(step);
    };

    const complete = () => {
      // hold on the finished gown, then the fabric "becomes" the site (the window opens)
      timers.push(
        window.setTimeout(() => {
          setPhase("fading");
          if (holeRef.current) holeRef.current.style.fillOpacity = "1";
          timers.push(
            window.setTimeout(() => {
              // the paper is still closed here: make sure nothing restored a scroll position meanwhile
              window.scrollTo({ top: 0, left: 0, behavior: "instant" });
              setPhase("opening");
              // hero entrance animations wait for this flag (see globals.css)
              document.documentElement.dataset.siteReady = "true";
              if (reduce) {
                timers.push(
                  window.setTimeout(() => {
                    setPhase("done");
                    document.body.style.overflow = "";
                  }, 450)
                );
              } else {
                zoom();
              }
            }, 850)
          );
        }, 500)
      );
    };

    const tick = (now: number) => {
      const t = now - start;
      let p = easeOutCubic(t / runway) * 0.9;

      if (!finishing && t >= minMs && (loaded || t >= MAX_MS)) {
        finishing = true;
        finishStart = now;
        finishFrom = p;
      }
      if (finishing) {
        const q = Math.min(1, (now - finishStart) / 380);
        p = finishFrom + (1 - finishFrom) * q;
        if (q >= 1) {
          apply(1);
          complete();
          return;
        }
      }
      apply(p);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(zoomRaf);
      timers.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("load", onLoad);
      window.removeEventListener("resize", measure);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      ref={rootRef}
      className="site-loader pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none"
      data-phase={phase}
      aria-hidden="true"
    >
      {/* One sheet of beige paper with a gown-shaped window that opens onto the site. The gown, its
          thread and the window all live in this one full-screen SVG and share a transform. */}
      <svg className="absolute inset-0 h-full w-full" fill="none">
        <defs>
          <radialGradient id="sl-paper" cx="50%" cy="40%" r="90%">
            <stop offset="0" stopColor="#f8f3ea" />
            <stop offset="0.55" stopColor="#f3ecdf" />
            <stop offset="1" stopColor="#e9dfcb" />
          </radialGradient>
          <mask id="sl-window" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
            <rect width="100%" height="100%" fill="white" />
            <g ref={holeGRef}>
              <path
                ref={holeRef}
                d={GOWN_OUTLINE}
                fill="black"
                style={{ fillOpacity: 0, transition: "fill-opacity 0.8s ease-out" }}
              />
            </g>
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#sl-paper)" mask="url(#sl-window)" />

        <g ref={drawRef}>
          {/* tailor's chalk: the pattern the needle follows */}
          <path
            d={GOWN_OUTLINE}
            stroke="#b9a98f"
            strokeOpacity="0.6"
            strokeWidth="1"
            strokeDasharray="2 6"
            strokeLinecap="round"
          />
          {/* the thread (soft line under, crisp line on top) */}
          <path
            ref={glowRef}
            d={GOWN_OUTLINE}
            stroke="#b8862d"
            strokeOpacity="0.22"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
          />
          <path
            ref={outlineRef}
            d={GOWN_OUTLINE}
            stroke="#1c1815"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
          />
          {GOWN_DETAILS.map((d, i) => (
            <path
              key={d}
              ref={(el) => {
                detailRefs.current[i] = el;
              }}
              d={d}
              stroke="#3a3128"
              strokeOpacity="0.75"
              strokeWidth="1.2"
              strokeLinecap="round"
              pathLength={1}
              style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
            />
          ))}

          {/* the needle */}
          <g ref={needleRef} style={{ opacity: 0 }}>
            <circle r="11" fill="#b8862d" opacity="0.18" />
            <line x1="-18" y1="0" x2="17" y2="0" stroke="#9e8365" strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="-13" cy="0" rx="3.4" ry="1.2" stroke="#9e8365" strokeWidth="1" fill="#f3ecdf" />
            <circle cx="17" cy="0" r="1.4" fill="#1c1815" />
          </g>

          {/* little sparkles around the hem */}
          {[
            [40, 470],
            [262, 462],
            [150, 540],
          ].map(([x, y], i) => (
            <path
              key={i}
              className="sl-spark"
              style={{ animationDelay: `${i * 0.7}s` }}
              d={`M${x} ${y - 7} L${x + 1.6} ${y - 1.6} L${x + 7} ${y} L${x + 1.6} ${y + 1.6} L${x} ${y + 7} L${x - 1.6} ${y + 1.6} L${x - 7} ${y} L${x - 1.6} ${y - 1.6} Z`}
              fill="#b8923d"
            />
          ))}
        </g>
      </svg>

      <div className="sl-stage pointer-events-auto absolute inset-0 z-10 flex flex-col items-center justify-between px-6 py-6 sm:px-12 sm:py-9">
        {/* debossed double frame, like a book cover */}
        <div className="pointer-events-none absolute inset-3 border border-[#d9cdbd] sm:inset-5" />
        <div className="pointer-events-none absolute inset-[18px] border border-[#e6dccd] sm:inset-[26px]" />

        {/* Top line */}
        <div className="relative flex w-full items-center justify-between border-b border-[#ded5c8] px-2 pb-3 font-serif text-[10px] tracking-[0.34em] text-[#7a6d5f] uppercase sm:px-4 sm:pb-4 sm:text-[11px]">
          <span>Haute Couture</span>
          <span className="hidden sm:block">Chapter 00</span>
          <span className="italic tracking-[0.2em] normal-case">Édition 2026</span>
        </div>

        {/* Gown slot (the SVG above draws into it), brand, caption */}
        <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center">
          <div ref={slotRef} className="h-[min(44vh,420px)]" style={{ aspectRatio: "300 / 520" }} />

          {/* Brand: each letter appears as the thread passes */}
          <h1
            aria-label={BRAND}
            className="font-bodoni mt-4 text-[26px] font-normal tracking-[0.34em] whitespace-nowrap text-[#1c1815] uppercase sm:mt-5 sm:text-4xl sm:tracking-[0.4em] md:text-5xl"
          >
            {Array.from(BRAND).map((ch, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="inline-block transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  opacity: i < lettersShown ? 1 : 0,
                  transform: i < lettersShown ? "translateY(0)" : "translateY(0.35em)",
                  filter: i < lettersShown ? "blur(0px)" : "blur(6px)",
                }}
              >
                {ch === " " ? " " : ch}
              </span>
            ))}
          </h1>

          <div className="mt-3 flex h-7 items-center justify-center sm:mt-4">
            <p
              key={lineIdx}
              className="animate-fade-in font-serif text-sm tracking-wide text-[#594d40] italic sm:text-base"
            >
              {CAPTIONS[lineIdx]}
            </p>
          </div>
        </div>

        {/* The measuring tape is pulled out as the site arrives */}
        <div className="relative w-full max-w-[640px]">
          <div className="relative">
            <div className="relative h-7 overflow-hidden rounded-[1px] bg-[#1c1815]/10">
              <div
                ref={tapeRef}
                className="absolute inset-0"
                style={{
                  clipPath: "inset(0 100% 0 0)",
                  background: "linear-gradient(180deg, #2a2521 0%, #1c1815 100%)",
                }}
              >
                {/* ticks: every mm, every 5, every 10 */}
                <div
                  className="absolute inset-x-0 bottom-0 h-[7px]"
                  style={{ backgroundImage: "repeating-linear-gradient(90deg, #cdbf9f 0 1px, transparent 1px 6.4px)" }}
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-[12px]"
                  style={{ backgroundImage: "repeating-linear-gradient(90deg, #efe3c4 0 1px, transparent 1px 32px)" }}
                />
                {Array.from({ length: 11 }, (_, i) => (
                  <span
                    key={i}
                    className="absolute top-[3px] -translate-x-1/2 font-mono text-[8px] leading-none text-[#e8dcc0]"
                    style={{ left: `${Math.min(97, Math.max(2.4, i * 10))}%` }}
                  >
                    {i * 10}
                  </span>
                ))}
              </div>
            </div>
            {/* brass tip riding the end of the tape */}
            <div
              ref={capRef}
              className="absolute top-0 h-7 w-[5px] -translate-x-1/2 bg-gradient-to-b from-[#e9c77b] to-[#a8741f] shadow-[0_0_8px_rgba(184,134,45,0.5)]"
              style={{ left: "0%" }}
            />
          </div>
          <div className="mt-2.5 flex items-baseline justify-between border-t border-[#ded5c8] pt-2.5 font-serif text-[10px] tracking-[0.3em] text-[#8c7f72] uppercase sm:text-[11px]">
            <span>Measuring the story</span>
            <span className="flex items-baseline gap-1.5 font-mono tracking-[0.12em] text-[#594d40] tabular-nums">
              <span ref={counterRef}>000</span>
              <span className="text-[#8c7f72]">cm</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
