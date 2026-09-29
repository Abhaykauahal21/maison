"use client";

import React, { useEffect, useRef, useState } from "react";

const BRAND = "MAISON D’VINE";

// The story told while the site loads; the last line is the brand promise.
const STORY_LINES = [
  "Once, there was a thread…",
  "…stitched with a dream.",
  "Every woman, a different story.",
  "Not just dresses, but stories.",
];

// A single continuous thread that the needle stitches from left to right (viewBox 600 x 120)
const THREAD_PATH =
  "M10 74 C 70 74, 88 22, 140 30 S 206 104, 254 82 S 304 10, 344 36 S 344 98, 304 88 C 272 80, 304 40, 354 60 S 434 104, 486 62 S 544 22, 590 50";

const MIN_MS = 2600; // never flash: the story always gets time to be read
const MAX_MS = 5500; // never hang: give up waiting for slow assets
const RUNWAY_MS = MIN_MS - 350;

type Phase = "loading" | "fading" | "opening" | "done";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

export const SiteLoader: React.FC = () => {
  const [phase, setPhase] = useState<Phase>("loading");
  const [lettersShown, setLettersShown] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);

  const threadRef = useRef<SVGPathElement | null>(null);
  const needleRef = useRef<SVGGElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);

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

    const path = threadRef.current;
    const needle = needleRef.current;
    const len = path ? path.getTotalLength() : 0;
    if (path) {
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
    }

    let loaded = document.readyState === "complete";
    const onLoad = () => {
      loaded = true;
    };
    if (!loaded) window.addEventListener("load", onLoad, { once: true });

    let raf = 0;
    let finishing = false;
    let finishStart = 0;
    let finishFrom = 0;
    let lastLetters = -1;
    let lastLine = -1;
    const timers: number[] = [];
    const start = performance.now();

    // Everything that follows progress is written straight to the DOM (no per-frame re-render)
    const apply = (p: number) => {
      if (path) path.style.strokeDashoffset = `${len * (1 - p)}`;
      if (path && needle) {
        const at = Math.min(len, len * p);
        const a = path.getPointAtLength(at);
        const b = path.getPointAtLength(Math.min(len, at + 2));
        const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
        needle.setAttribute("transform", `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${angle.toFixed(1)})`);
      }
      if (counterRef.current) counterRef.current.textContent = String(Math.round(p * 100)).padStart(3, "0");

      const letters = Math.ceil(Math.min(1, p / 0.85) * BRAND.length);
      if (letters !== lastLetters) {
        lastLetters = letters;
        setLettersShown(letters);
      }
      const line = p < 0.3 ? 0 : p < 0.6 ? 1 : p < 0.9 ? 2 : 3;
      if (line !== lastLine) {
        lastLine = line;
        setLineIdx(line);
      }
    };

    const complete = () => {
      // hold on the finished line, fade the cover's contents, then open the book
      timers.push(
        window.setTimeout(() => {
          setPhase("fading");
          timers.push(
            window.setTimeout(() => {
              // the cover is still opaque here: make sure nothing restored a scroll position meanwhile
              window.scrollTo({ top: 0, left: 0, behavior: "instant" });
              setPhase("opening");
              // hero entrance animations wait for this flag (see globals.css)
              document.documentElement.dataset.siteReady = "true";
              timers.push(
                window.setTimeout(() => {
                  setPhase("done");
                  document.body.style.overflow = "";
                }, 1350),
              );
            }, 450),
          );
        }, 450),
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
        const q = Math.min(1, (now - finishStart) / 350);
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
      timers.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("load", onLoad);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  const contentHidden = phase !== "loading";

  return (
    <div
      className="site-loader fixed inset-0 z-[9999] overflow-hidden pointer-events-none select-none"
      data-phase={phase}
      aria-hidden="true"
      style={{ perspective: "1800px" }}
    >
      {/* Book cover: two halves that swing open into the screen */}
      <div className="loader-panel loader-panel-left absolute top-0 left-0 h-full w-1/2 will-change-transform" />
      <div className="loader-panel loader-panel-right absolute top-0 right-0 h-full w-1/2 will-change-transform" />

      {/* Gold spine that fades as the cover opens */}
      <div
        className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#b8a07a] to-transparent transition-opacity duration-500"
        style={{ opacity: phase === "opening" ? 0 : 0.7 }}
      />

      {/* Cover contents */}
      <div
        className="pointer-events-auto absolute inset-0 z-10 flex flex-col justify-between px-6 py-8 sm:px-14 sm:py-12"
        style={{
          opacity: contentHidden ? 0 : 1,
          transform: contentHidden ? "scale(0.97) translateY(-18px)" : "scale(1) translateY(0)",
          transition: "opacity 0.45s ease-out, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Debossed double frame, like a book cover */}
        <div className="pointer-events-none absolute inset-3 border border-[#d9cdbd] sm:inset-5" />
        <div className="pointer-events-none absolute inset-[18px] border border-[#e6dccd] sm:inset-[26px]" />

        {/* Top header */}
        <div className="relative flex w-full items-center justify-between border-b border-[#ded5c8] pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[#9e8365] opacity-80" />
            <span className="font-sans text-[10px] font-normal tracking-[0.3em] text-[#7a6d5f] uppercase sm:text-[11px]">
              PARIS · ATELIER HAUTE COUTURE
            </span>
          </div>
          <span className="font-serif text-[11px] italic tracking-wider text-[#7a6d5f] sm:text-[12px]">
            Édition 2026
          </span>
        </div>

        {/* Centre: the needle stitching the brand into being */}
        <div className="relative my-auto flex flex-col items-center text-center">
          <span className="mb-4 font-sans text-[10px] font-medium tracking-[0.42em] text-[#9e8365] uppercase sm:text-[11px]">
            Chapter 00
          </span>

          <svg
            viewBox="0 0 600 120"
            className="h-auto w-[min(82vw,560px)] overflow-visible"
            fill="none"
          >
            {/* faint pattern line the needle follows */}
            <path d={THREAD_PATH} stroke="#d9cdbd" strokeWidth="1" strokeDasharray="2 7" strokeLinecap="round" />
            {/* the thread itself */}
            <path
              ref={threadRef}
              d={THREAD_PATH}
              stroke="#1c1815"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* the needle */}
            <g ref={needleRef} transform="translate(10 74)">
              <line x1="-16" y1="0" x2="15" y2="0" stroke="#9e8365" strokeWidth="1.7" strokeLinecap="round" />
              <ellipse cx="-11" cy="0" rx="3" ry="1.1" stroke="#9e8365" strokeWidth="0.9" fill="#f5efe7" />
              <circle cx="15" cy="0" r="1.2" fill="#1c1815" />
            </g>
          </svg>

          {/* Brand: each letter appears as the thread passes */}
          <h1
            aria-label={BRAND}
            className="mt-6 font-bodoni text-3xl font-normal tracking-[0.24em] whitespace-nowrap text-[#1c1815] uppercase sm:mt-8 sm:text-5xl sm:tracking-[0.28em] md:text-6xl"
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

          {/* The story so far */}
          <div className="mt-4 flex h-8 items-center justify-center sm:mt-5 sm:h-9">
            <p
              key={lineIdx}
              className="animate-fade-in font-serif text-base tracking-wide text-[#594d40] italic sm:text-lg md:text-xl"
            >
              {STORY_LINES[lineIdx]}
            </p>
          </div>
        </div>

        {/* Bottom: chapter + page-number style progress */}
        <div className="relative flex w-full items-center justify-between border-t border-[#ded5c8] pt-3 font-sans text-[10.5px] tracking-[0.22em] text-[#8c7f72] uppercase sm:pt-4 sm:text-[11.5px]">
          <span className="flex items-center gap-1.5">
            <span>STORY CHAPTER</span>
            <span className="font-mono text-[#594d40]">00</span>
          </span>

          <span className="flex items-baseline gap-1 font-mono text-[#594d40] tabular-nums">
            <span ref={counterRef}>000</span>
            <span className="text-[#8c7f72]">%</span>
          </span>
        </div>
      </div>
    </div>
  );
};
