"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { GardenParticles } from "@/components/garden/GardenParticles";
import { makeTops, nearViewport } from "@/lib/scrub";

export interface TestimonialItem {
  id: string;
  /** e.g. "Whisper #001" */
  whisper: string;
  /** What the visitor wrote to us. */
  message: string;
  /** Maison D'vine's reply. */
  response: string;
  author: string;
  location: string;
  leftNoteLines: string[];
  rightNoteLines: string[];
}

export const initialTestimonials: TestimonialItem[] = [
  {
    id: "whisper-001",
    whisper: "Whisper #001",
    message:
      "I really like the concept, it feels fresh. But honestly the prices look high for a brand that just started.",
    response:
      "A completely fair observation. Trust is earned, not demanded. Our pricing simply reflects the uncompromised cost of a slow, conscious, nine-month creation cycle. We appreciate you saying .",
    author: "Anonymous",
    location: "Delhi",
    leftNoteLines: ["Trust is", "earned,", "not demanded."],
    rightNoteLines: ["Slow,", "conscious,", "nine months."],
  },
  {
    id: "whisper-002",
    whisper: "Whisper #002",
    message:
      "Love the idea but I don't think I can spend 15k on a dress from a new brand right now.",
    response:
      "We deeply respect that boundary. Investing in a new vision requires certainty. You don't need to own a piece to be part of our dialogue, stay in the courtyard as long as you like.",
    author: "Anonymous",
    location: "Anonymous",
    leftNoteLines: ["We respect", "that", "boundary."],
    rightNoteLines: ["Stay in", "the courtyard."],
  },
  {
    id: "whisper-003",
    whisper: "Whisper #003",
    message:
      "I'm not the typical slow-fashion customer. I usually shop on impulse, but your story caught my attention. Curious to see where it leads.",
    response:
      "That's exactly the kind of honesty we want here. You don't have to fit the idea perfectly to be curious about it.",
    author: "Shreya Rao",
    location: "Mumbai, India",
    leftNoteLines: ["Honesty", "is welcome", "here."],
    rightNoteLines: ["Curious", "is enough."],
  },
];

/* ------------------------------------------------------------------
   Scrapbook card (story-card.webp, 1672 x 941, transparent) sliced into
   pieces so each animates in on its own. Every slice carries the true
   composite pixels, so overlapping crops line up once settled.
   ------------------------------------------------------------------ */
const CARD_W = 1672;
const CARD_H = 941;

type Rect = [x0: number, y0: number, x1: number, y1: number];

const RECTS = {
  left: [35, 115, 530, 840] as Rect,
  center: [500, 150, 1235, 760] as Rect,
  right: [1120, 160, 1645, 845] as Rect,
  flower: [395, 410, 690, 880] as Rect,
};

const crop = ([x0, y0, x1, y1]: Rect): React.CSSProperties => {
  const w = (x1 - x0) / CARD_W;
  const h = (y1 - y0) / CARD_H;
  return {
    backgroundImage: "url(/images/story-card.webp)",
    backgroundRepeat: "no-repeat",
    backgroundSize: `${100 / w}% ${100 / h}%`,
    backgroundPosition: `${(x0 / CARD_W / (1 - w)) * 100}% ${(y0 / CARD_H / (1 - h)) * 100}%`,
  };
};

const place = ([x0, y0, x1, y1]: Rect): React.CSSProperties => ({
  left: `${(x0 / CARD_W) * 100}%`,
  top: `${(y0 / CARD_H) * 100}%`,
  width: `${((x1 - x0) / CARD_W) * 100}%`,
  height: `${((y1 - y0) / CARD_H) * 100}%`,
});

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const sm = (p: number, a: number, b: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Mobile line that rises out of its own mask (driven by scroll). */
const SLine: React.FC<{ lag?: number; children: React.ReactNode }> = ({ lag = 0, children }) => (
  <span data-s="rise" data-lag={lag} className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
    <span
      data-inner
      className="block will-change-transform"
      style={{ transform: "translateY(112%)" }}
    >
      {children}
    </span>
  </span>
);

const PETALS = Array.from({ length: 12 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  size: 9 + ((i * 5) % 9),
  dur: 14 + ((i * 3) % 9),
  delay: -((i * 2.3) % 16),
  sway: 30 + ((i * 13) % 50),
  hue: i % 3,
}));

const STYLES = `
.gw-root [data-gw] { opacity: 0; }
.gw-root[data-in="true"] [data-gw="veil"] { animation: gw-fade 2s ease-out .2s both; }
@keyframes gw-bg { from { opacity: 0; transform: scale(1.12); } to { opacity: 1; transform: scale(1.02); } }
@keyframes gw-paper { from { opacity: 0; transform: translateY(7%) scale(.96) rotate(1.2deg); filter: blur(6px); } to { opacity: 1; transform: none; filter: none; } }
@keyframes gw-left { from { opacity: 0; transform: translateX(-9%) rotate(-7deg); filter: blur(5px); } to { opacity: 1; transform: none; filter: none; } }
@keyframes gw-right { from { opacity: 0; transform: translateX(9%) rotate(7deg); filter: blur(5px); } to { opacity: 1; transform: none; filter: none; } }
@keyframes gw-flower { from { opacity: 0; transform: translateY(8%) scale(.9); transform-origin: 50% 100%; } to { opacity: 1; transform: none; } }
@keyframes gw-fade { from { opacity: 0; } to { opacity: 1; } }

.gw-root[data-in="true"] .gw-kenburns { animation: gw-kb 28s ease-in-out 2.6s infinite alternate; }
@keyframes gw-kb { from { transform: scale(1.02); } to { transform: scale(1.08) translate3d(-1%, .8%, 0); } }
.gw-sun { animation: gw-sun 7s ease-in-out infinite; }
@keyframes gw-sun { 0%,100% { opacity: .5; transform: scale(1); } 50% { opacity: .9; transform: scale(1.12); } }

.gw-petal { position: absolute; top: -8%; border-radius: 80% 0 80% 0; opacity: 0; animation: gw-fall linear infinite; will-change: transform; }
@keyframes gw-fall {
  0% { transform: translate3d(0,-10%,0) rotate(0deg); opacity: 0; }
  10% { opacity: .85; }
  50% { transform: translate3d(var(--sway),55vh,0) rotate(200deg); }
  90% { opacity: .7; }
  100% { transform: translate3d(calc(var(--sway) * -.6),115vh,0) rotate(400deg); opacity: 0; }
}

.gw-line { display: block; overflow: hidden; padding-bottom: .12em; margin-bottom: -.12em; }
.gw-line > span { display: block; transform: translateY(115%); }
.gw-root[data-in="true"] .gw-line > span { animation: gw-rise 1.1s cubic-bezier(.16,1,.3,1) var(--d, 0s) both; }
@keyframes gw-rise { to { transform: translateY(0); } }
.gw-fadeup { opacity: 0; }
.gw-root[data-in="true"] .gw-fadeup { animation: gw-fadeup 1.1s cubic-bezier(.16,1,.3,1) var(--d, 0s) both; }
@keyframes gw-fadeup { from { opacity: 0; transform: translateY(14px); filter: blur(4px); } to { opacity: 1; transform: none; filter: none; } }
.gw-rule { transform: scaleX(0); transform-origin: left; }
.gw-root[data-in="true"] .gw-rule { animation: gw-rule 1.3s cubic-bezier(.16,1,.3,1) var(--d, 0s) both; }
@keyframes gw-rule { to { transform: scaleX(1); } }

.gw-root:not([data-in="true"]) .gw-ink { animation-play-state: paused; }
.gw-ink { animation: gw-ink 1.5s cubic-bezier(.65,0,.35,1) var(--d, 0s) both; }
@keyframes gw-ink { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 -4% 0 0); } }

.gw-star { display: inline-block; animation: gw-star .7s cubic-bezier(.34,1.56,.64,1) var(--d, 0s) both; }
@keyframes gw-star { from { opacity: 0; transform: scale(0) rotate(-90deg); } to { opacity: 1; transform: none; } }

.gw-progress { transform-origin: left; animation: gw-progress 9s linear both; }
.gw-word { opacity: 0; animation: gw-word .7s cubic-bezier(.16,1,.3,1) both; }
@keyframes gw-word { from { opacity: 0; transform: translateY(7px); filter: blur(3px); } to { opacity: 1; transform: none; filter: none; } }
@keyframes gw-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }

.gw-parallax { transition: transform .9s cubic-bezier(.16,1,.3,1); will-change: transform; }

@media (prefers-reduced-motion: reduce) {
  .gw-root *, .gw-root *::before, .gw-root *::after { animation-duration: .01ms !important; animation-delay: 0s !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  .gw-petal { display: none; }
}
`;

const Petals: React.FC = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
    {PETALS.map((p, i) => (
      <span
        key={i}
        className="gw-petal"
        style={{
          left: `${p.left}%`,
          width: p.size,
          height: p.size * 1.25,
          animationDuration: `${p.dur}s`,
          animationDelay: `${p.delay}s`,
          ["--sway" as string]: `${p.sway}px`,
          background:
            p.hue === 0
              ? "linear-gradient(135deg,#f7b7c6,#d9577c)"
              : p.hue === 1
                ? "linear-gradient(135deg,#ffe3b0,#e6a64e)"
                : "linear-gradient(135deg,#fff1ee,#f0a8b8)",
        }}
      />
    ))}
  </div>
);

const Note: React.FC<{
  lines: string[];
  d: number;
  className?: string;
  style?: React.CSSProperties;
}> = ({ lines, d, className = "", style }) => (
  <p
    className={`gw-ink font-allura allura-regular font-script font-cursive text-center leading-[1.08] tracking-wide text-[#3d2d1e] ${className}`}
    style={{ ["--d" as string]: `${d}s`, ...style }}
  >
    {lines.map((l, i) => (
      <React.Fragment key={i}>
        {l}
        {i < lines.length - 1 && <br />}
      </React.Fragment>
    ))}
  </p>
);

const Line: React.FC<{ d: number; children: React.ReactNode }> = ({ d, children }) => (
  <span className="gw-line">
    <span style={{ ["--d" as string]: `${d}s` }}>{children}</span>
  </span>
);

/** Words that surface one by one (blur to sharp), starting `start` seconds in. */
const Words: React.FC<{ text: string; start: number; step?: number }> = ({ text, start, step = 0.03 }) => (
  <>
    {text.split(" ").map((w, i) => (
      <span
        key={i}
        className="gw-word inline-block"
        style={{ animationDelay: `${(start + i * step).toFixed(2)}s` }}
      >
        {w}
        {"\u00a0"}
      </span>
    ))}
  </>
);

interface TestimonialViewProps {
  item: TestimonialItem;
  swapClass: string;
  size: "lg" | "sm";
}

/** Whisper label, what she wrote, Maison D'vine's reply and who wrote it: sized in card units (lg) or viewport units (sm). */
const TestimonialView: React.FC<TestimonialViewProps> = ({ item, swapClass, size }) => {
  const lg = size === "lg";
  const msgWords = item.message.split(" ").length;
  const msgStart = 0.25;
  const respStart = msgStart + msgWords * 0.03 + 0.35;
  const respWords = item.response.split(" ").length;
  const signStart = respStart + respWords * 0.022 + 0.3;
  const showLocation = item.location.trim().toLowerCase() !== item.author.trim().toLowerCase();
  return (
    <div className={`flex flex-col transition-all duration-200 ease-out ${swapClass}`}>
      <span
        className="gw-word font-serif font-bold tracking-[0.04em] text-[#16120e]"
        style={{ fontSize: lg ? "max(11px, 1.3cqw)" : "13px", animationDelay: "0s", paddingLeft: lg ? "3cqw" : 0 }}
      >
        {item.whisper}
      </span>
      <p
        className="font-serif leading-[1.38] text-[#16120e]"
        style={{
          fontSize: lg ? "max(12px, 1.62cqw)" : "clamp(14px,4vw,18px)",
          marginTop: lg ? "0.9cqw" : "10px",
          paddingLeft: lg ? "3cqw" : 0,
        }}
      >
        <Words text={item.message} start={msgStart} />
      </p>
      <div style={{ marginTop: lg ? "1.2cqw" : "12px", paddingLeft: lg ? "7.5cqw" : 0 }}>
        <span
          className="gw-word font-serif font-bold text-[#16120e]"
          style={{ fontSize: lg ? "max(11px, 1.2cqw)" : "12.5px", animationDelay: `${respStart - 0.1}s` }}
        >
          Maison D&apos;vine Response:
        </span>
        <p
          className="font-serif leading-[1.5] text-[#46392e] italic"
          style={{ fontSize: lg ? "max(11px, 1.24cqw)" : "clamp(12px,3.3vw,14.5px)", marginTop: "0.25em" }}
        >
          <Words text={item.response} start={respStart} step={0.022} />
        </p>
      </div>
      <div
        className="gw-word flex flex-col"
        style={{ marginTop: lg ? "1.2cqw" : "14px", paddingLeft: lg ? "7.5cqw" : 0, animationDelay: `${signStart}s` }}
      >
        <span
          className="font-serif font-medium tracking-[0.02em] text-[#1c1815]"
          style={{ fontSize: lg ? "max(13px, 1.7cqw)" : "17px" }}
        >
          {item.author}
        </span>
        {showLocation && (
          <span
            className="font-serif tracking-wider text-[#635344]"
            style={{ fontSize: lg ? "max(11px, 1.1cqw)" : "12px", marginTop: "2px" }}
          >
            {item.location}
          </span>
        )}
      </div>
    </div>
  );
};

/** How long each whisper stays before the next one (matches the .gw-progress animation). */
const AUTO_MS = 9000;

const navBtnClass =
  "group flex items-center justify-center rounded-full border border-white/50 bg-black/35 text-white backdrop-blur-sm transition-all duration-300 hover:border-[#e9c98c] hover:bg-[#e9c98c]/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xl";

export interface GardenSectionProps {
  testimonials?: TestimonialItem[];
}

export const GardenSection: React.FC<GardenSectionProps> = ({
  testimonials = initialTestimonials,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const mobRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const changeTestimonial = useCallback(
    (dir: "next" | "prev") => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setDirection(dir);
      setTimeout(() => {
        setCurrentIndex((prev) =>
          dir === "next"
            ? (prev + 1) % testimonials.length
            : (prev - 1 + testimonials.length) % testimonials.length
        );
        setIsTransitioning(false);
      }, 190);
    },
    [isTransitioning, testimonials.length]
  );

  const nextTestimonial = useCallback(() => changeTestimonial("next"), [changeTestimonial]);
  const prevTestimonial = useCallback(() => changeTestimonial("prev"), [changeTestimonial]);

  // Scroll engine. Desktop: the stage pins and the scroll assembles the scrapbook, fans it out and
  // turns the pages. Mobile: every piece is scrubbed against its own position on screen.
  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const mob = mobRef.current;
    if (!track || !stage || !mob) return;

    const one = (root: HTMLElement, sel: string) => root.querySelector<HTMLElement>(sel);
    const all = (root: HTMLElement, sel: string) =>
      Array.from(root.querySelectorAll<HTMLElement>(sel));

    const dBg = one(stage, "[data-gw='bg']");
    const dPaper = one(stage, "[data-gw='paper']");
    const dLeft = one(stage, "[data-gw='left']");
    const dRight = one(stage, "[data-gw='right']");
    const dFlower = one(stage, "[data-gw='flower']");

    const mBg = one(mob, "[data-gw='bg']");
    const mPaper = one(mob, "[data-gw='paper']");
    const mLeft = one(mob, "[data-gw='left']");
    const mRight = one(mob, "[data-gw='right']");
    const mRises = all(mob, "[data-s='rise']");
    const mRules = all(mob, "[data-s='rule']");
    const mFades = all(mob, "[data-s='fade']");

    let raf = 0;
    const desk = window.matchMedia("(min-width: 768px)");

    const T = makeTops();
    const progM = (el: Element, lag = 0, span = 0.17) => {
      const vh = window.innerHeight;
      return sm(vh * 0.92 - T.top(el) - lag, 0, vh * span);
    };

    const applyDesktop = () => {
      const vh = window.innerHeight;
      const r = track.getBoundingClientRect();
      if (!nearViewport(r, vh, 0.5)) return;
      const enter = clamp01((vh - r.top) / (vh * 0.95));
      // 0 → 1 as the section scrolls up past the top: only a gentle drift of the scrapbook pieces
      const p = clamp01(-r.top / vh);

      if (dBg) {
        dBg.style.opacity = String(sm(enter, 0, 0.5).toFixed(3));
        dBg.style.transform = `scale(${(1.14 - 0.12 * enter + 0.05 * p).toFixed(4)})`;
      }

      // The scrapbook is assembled as the stage scrolls in, then fans out as you read
      const ePaper = sm(enter, 0.22, 0.62);
      const eLeft = sm(enter, 0.38, 0.78);
      const eRight = sm(enter, 0.48, 0.88);
      const eFlower = sm(enter, 0.62, 1);
      const lift = 0;

      if (dPaper) {
        dPaper.style.opacity = String(clamp01(ePaper * 2).toFixed(3));
        dPaper.style.transform = `translate3d(0, ${((1 - ePaper) * 9 - lift).toFixed(2)}%, 0) scale(${(0.95 + 0.05 * ePaper).toFixed(4)}) rotate(${((1 - ePaper) * 1.6 + (p - 0.5) * 0.8).toFixed(2)}deg)`;
      }
      if (dLeft) {
        dLeft.style.opacity = String(clamp01(eLeft * 2).toFixed(3));
        dLeft.style.transform = `translate3d(${(-9 * (1 - eLeft) - p * 2.2).toFixed(2)}%, ${(p * -1.6).toFixed(2)}%, 0) rotate(${(-7 * (1 - eLeft) - p * 3.4).toFixed(2)}deg)`;
      }
      if (dRight) {
        dRight.style.opacity = String(clamp01(eRight * 2).toFixed(3));
        dRight.style.transform = `translate3d(${(9 * (1 - eRight) + p * 2.2).toFixed(2)}%, ${(p * 1.6).toFixed(2)}%, 0) rotate(${(7 * (1 - eRight) + p * 3.4).toFixed(2)}deg)`;
      }
      if (dFlower) {
        dFlower.style.opacity = String(clamp01(eFlower * 2).toFixed(3));
        dFlower.style.transform = `translate3d(0, ${((1 - eFlower) * 8 - p * 3).toFixed(2)}%, 0) scale(${(0.9 + 0.1 * eFlower).toFixed(4)}) rotate(${(p * -4).toFixed(2)}deg)`;
        dFlower.style.transformOrigin = "50% 100%";
      }
    };

    const applyMobile = () => {
      const vh = window.innerHeight;
      const rr = mob.getBoundingClientRect();
      // offscreen: nothing to do (this handler runs on every scroll, for every section)
      if (!nearViewport(rr, vh)) return;
      // all reads first (one style/layout pass), then all writes
      T.read(mRises, mRules, mFades, [mLeft, mRight, mPaper]);
      const mp = clamp01((vh - rr.top) / (vh + rr.height));

      if (mBg) {
        const e = sm(vh - rr.top, 0, vh * 0.6);
        mBg.style.opacity = String(e.toFixed(3));
        mBg.style.transform = `scale(${(1.12 - 0.1 * e).toFixed(4)})`;
      }
      mRises.forEach((el) => {
        const inner = el.querySelector<HTMLElement>("[data-inner]");
        if (!inner) return;
        const e = progM(el, Number(el.dataset.lag || 0));
        inner.style.transform = `translate3d(0, ${((1 - e) * 112).toFixed(1)}%, 0)`;
        inner.style.opacity = String((0.3 + 0.7 * e).toFixed(3));
      });
      mRules.forEach((el) => {
        el.style.transform = `scaleX(${progM(el, Number(el.dataset.lag || 0), 0.14).toFixed(3)})`;
      });
      mFades.forEach((el) => {
        const e = progM(el, Number(el.dataset.lag || 0), 0.18);
        el.style.opacity = String((0.15 + 0.85 * e).toFixed(3));
        el.style.transform = `translate3d(0, ${((1 - e) * 16).toFixed(1)}px, 0)`;
      });
      const drift = (mp - 0.5) * 2; // -1..1 while the section crosses the screen
      if (mLeft) {
        const e = progM(mLeft, 0, 0.36);
        mLeft.style.opacity = String(clamp01(e * 2).toFixed(3));
        mLeft.style.transform = `translate3d(${(-14 * (1 - e)).toFixed(2)}%, ${(drift * -10).toFixed(1)}px, 0) rotate(${(-8 * (1 - e) - drift * 2.4).toFixed(2)}deg)`;
      }
      if (mRight) {
        const e = progM(mRight, 30, 0.36);
        mRight.style.opacity = String(clamp01(e * 2).toFixed(3));
        mRight.style.transform = `translate3d(${(14 * (1 - e)).toFixed(2)}%, ${(drift * 12).toFixed(1)}px, 0) rotate(${(8 * (1 - e) + drift * 2.4).toFixed(2)}deg)`;
      }
      if (mPaper) {
        const e = progM(mPaper, 0, 0.3);
        mPaper.style.opacity = String(clamp01(e * 2).toFixed(3));
        mPaper.style.transform = `translate3d(0, ${((1 - e) * 60 - drift * 8).toFixed(1)}px, 0) scale(${(0.94 + 0.06 * e).toFixed(4)}) rotate(${((1 - e) * 2.2).toFixed(2)}deg)`;
      }
    };

    const update = () => {
      raf = 0;
      if (desk.matches) applyDesktop();
      else applyMobile();
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

  // The stories turn by themselves: every few seconds the next whisper writes itself onto the page.
  // (Scrolling no longer changes the story; the arrows still do, and restart the timer.)
  useEffect(() => {
    if (!inView || testimonials.length < 2) return;
    const t = setTimeout(() => changeTestimonial("next"), AUTO_MS);
    return () => clearTimeout(t);
  }, [inView, currentIndex, changeTestimonial, testimonials.length]);

  // Subtle pointer parallax: background and scrapbook drift in opposite directions.
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    stage.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    stage.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const handleLeave = () => {
    stageRef.current?.style.setProperty("--mx", "0");
    stageRef.current?.style.setProperty("--my", "0");
  };

  const current = testimonials[currentIndex] || testimonials[0];
  const swapClass = isTransitioning
    ? direction === "next"
      ? "opacity-0 -translate-x-4 blur-[3px]"
      : "opacity-0 translate-x-4 blur-[3px]"
    : direction === "next"
      ? "animate-testimonial-next"
      : "animate-testimonial-prev";

  const navButtons = (sizeClass: string) => (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={prevTestimonial}
        disabled={isTransitioning}
        className={`${navBtnClass} ${sizeClass}`}
        aria-label="Previous testimonial"
      >
        <span className="text-lg transition-transform duration-300 group-hover:-translate-x-1">
          ←
        </span>
      </button>
      <button
        type="button"
        onClick={nextTestimonial}
        disabled={isTransitioning}
        className={`${navBtnClass} ${sizeClass}`}
        aria-label="Next testimonial"
      >
        <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </button>
    </div>
  );

  const counterEl = () => (
    <div className="flex items-center gap-3 font-sans text-[11px] tracking-[0.25em] text-[#e8dfd4]/80">
      <span>{String(currentIndex + 1).padStart(2, "0")}</span>
      <span className="relative block h-px w-14 overflow-hidden bg-white/25">
        <span key={currentIndex} className="gw-progress absolute inset-0 bg-[#e9c98c]" />
      </span>
      <span>{String(testimonials.length).padStart(2, "0")}</span>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      id="whispers"
      data-in={inView}
      className="gw-root relative z-10 -mt-6 w-full bg-[#0a0806] text-[#1c1815] select-none sm:-mt-8 md:-mt-12 lg:-mt-16 xl:-mt-20"
    >
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* ============ DESKTOP / TABLET (md+) ============ */}
      <div
        ref={trackRef}
        className="relative hidden w-full md:block"
        style={{ height: "100vh" }}
      >
        <div
          ref={stageRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          className="sticky top-0 w-full overflow-hidden"
          style={{ height: "100vh", ["--mx" as string]: 0, ["--my" as string]: 0 }}
        >
          {/* Garden background */}
          <div
            className="gw-parallax absolute inset-[-3%]"
            style={{
              transform: "translate3d(calc(var(--mx) * -14px), calc(var(--my) * -10px), 0)",
            }}
          >
            <div data-gw="bg" className="absolute inset-0">
              <div className="gw-kenburns absolute inset-0">
                <Image
                  src="/images/story-web.webp"
                  alt="Sunlit garden at golden hour"
                  fill
                  quality={90}
                  sizes="100vw"
                  className="pointer-events-none object-cover select-none"
                />
              </div>
            </div>
          </div>

          {/* Golden sun bloom, left-side reading shade, edge blend */}
          <div
            aria-hidden
            data-gw="veil"
            className="gw-sun pointer-events-none absolute -top-[14%] -left-[6%] z-[1] h-[70%] w-[46%]"
            style={{
              background:
                "radial-gradient(circle, rgba(255,214,140,0.5), rgba(255,170,70,0.16) 45%, transparent 70%)",
              mixBlendMode: "screen",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[2]"
            style={{
              background:
                "linear-gradient(90deg, rgba(8,7,6,0.78) 0%, rgba(8,7,6,0.5) 24%, rgba(8,7,6,0.12) 40%, transparent 52%), linear-gradient(180deg, #0a0806 0%, rgba(10,8,6,0) 10%, rgba(10,8,6,0) 90%, #0a0806 100%)",
            }}
          />

          <GardenParticles />
          <Petals />

          {/* Left column */}
          <div className="absolute top-1/2 left-[3%] z-20 flex w-[30%] max-w-[480px] -translate-y-1/2 flex-col text-left">
            <div className="flex items-center gap-3">
              <span
                className="gw-rule block h-px w-9 bg-[#e9c98c]"
                style={{ ["--d" as string]: "0.6s" }}
              />
              <span
                className="gw-fadeup font-sans text-xs font-medium tracking-[0.32em] text-[#e8dfd4] uppercase md:text-[0.95vw]"
                style={{ ["--d" as string]: "0.55s" }}
              >
                THE WHISPERS
              </span>
            </div>
            <h2 className="mt-3 font-serif text-5xl leading-[1] font-normal tracking-[0.01em] text-white md:text-[4.2vw] xl:text-[4.6vw]">
              <Line d={0.75}>Real Stories.</Line>
              <Line d={0.9}>
                Real <em className="text-[#ecd09a] italic">Women.</em>
              </Line>
            </h2>
            <p
              className="gw-fadeup mt-5 max-w-[300px] font-sans text-sm leading-[1.65] tracking-[0.01em] text-[#ded6cb] md:text-[1.05vw]"
              style={{ ["--d" as string]: "1.2s" }}
            >
              Every dress carries a feeling. Here are the women who made them a part of their story.
            </p>
            <div
              className="gw-fadeup mt-8 flex flex-col gap-5"
              style={{ ["--d" as string]: "1.4s" }}
            >
              {navButtons("h-11 w-11 md:h-[3.2vw] md:w-[3.2vw] md:min-h-11 md:min-w-11 max-h-14 max-w-14")}
              {counterEl()}
            </div>
          </div>

          {/* Scrapbook card */}
          <div
            className="absolute top-1/2 right-[1.2%] z-10 w-[66%] -translate-y-1/2"
            style={{ aspectRatio: `${CARD_W} / ${CARD_H}`, containerType: "inline-size" }}
          >
            <div
              className="gw-parallax absolute inset-0"
              style={{ transform: "translate3d(calc(var(--mx) * 10px), calc(var(--my) * 7px), 0)" }}
            >
              <div
                className="absolute inset-0"
                style={{ filter: "drop-shadow(0 1.6cqw 2.2cqw rgba(30,14,4,0.45))" }}
              >
                <div
                  data-gw="paper"
                  className="absolute"
                  style={{ ...place(RECTS.center), ...crop(RECTS.center) }}
                />
                <div
                  data-gw="left"
                  className="absolute"
                  style={{ ...place(RECTS.left), ...crop(RECTS.left) }}
                />
                <div
                  data-gw="right"
                  className="absolute"
                  style={{ ...place(RECTS.right), ...crop(RECTS.right) }}
                />
                <div
                  data-gw="flower"
                  className="absolute"
                  style={{ ...place(RECTS.flower), ...crop(RECTS.flower) }}
                />
              </div>

              {/* Testimonial on the centre paper */}
              <div
                className="gw-fadeup absolute z-10 flex items-center"
                style={{
                  left: "34.2%",
                  top: "26%",
                  width: "37.6%",
                  height: "50%",
                  ["--d" as string]: "1.1s",
                }}
              >
                <TestimonialView
                  key={currentIndex}
                  item={current}
                  swapClass={swapClass}
                  size="lg"
                />
              </div>

              {/* Handwritten notes on the small papers */}
              <div
                className="pointer-events-none absolute z-10 flex items-center justify-center"
                style={{ left: "4.4%", top: "58.6%", width: "18.4%", height: "25%" }}
              >
                <Note
                  key={`l${currentIndex}`}
                  lines={current.leftNoteLines}
                  d={0.2}
                  className="-rotate-[11deg]"
                  style={{ fontSize: "max(18px, 2.7cqw)", opacity: isTransitioning ? 0 : 1 }}
                />
              </div>
              <div
                className="pointer-events-none absolute z-10 flex items-center justify-center"
                style={{ left: "77%", top: "61.4%", width: "19.5%", height: "25%" }}
              >
                <Note
                  key={`r${currentIndex}`}
                  lines={current.rightNoteLines}
                  d={0.45}
                  className="-rotate-[11deg]"
                  style={{ fontSize: "max(18px, 2.7cqw)", opacity: isTransitioning ? 0 : 1 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ MOBILE (< md) ============ */}
      <div ref={mobRef} className="relative block w-full overflow-hidden md:hidden">
        <div className="absolute inset-0">
          <div data-gw="bg" className="absolute inset-0">
            <div className="gw-kenburns absolute inset-0">
              <Image
                src="/images/story-mobile.webp"
                alt="Sunlit garden at golden hour"
                fill
                quality={85}
                sizes="100vw"
                className="object-cover select-none"
              />
            </div>
          </div>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(180deg, #0a0806 0%, rgba(10,8,6,0.55) 18%, rgba(10,8,6,0.15) 45%, rgba(10,8,6,0.55) 100%)",
          }}
        />
        <div
          aria-hidden
          data-gw="veil"
          className="gw-sun pointer-events-none absolute -top-[6%] -left-[20%] z-[1] h-[40%] w-[90%]"
          style={{
            background: "radial-gradient(circle, rgba(255,214,140,0.45), transparent 68%)",
            mixBlendMode: "screen",
          }}
        />
        <Petals />

        <div className="relative z-10 flex flex-col px-[4vw] pt-14 pb-14 text-left">
          <div className="px-[2vw]">
            <div className="flex items-center gap-3">
              <span
                data-s="rule"
                className="block h-px w-7 origin-left bg-[#e9c98c]"
                style={{ transform: "scaleX(0)" }}
              />
              <span
                data-s="fade"
                className="font-sans text-[10px] font-medium tracking-[0.28em] text-[#e8dfd4] uppercase"
                style={{ opacity: 0.15 }}
              >
                THE WHISPERS
              </span>
            </div>
            <h2 className="mt-3 font-serif text-[clamp(32px,10vw,48px)] leading-[1.04] font-normal text-white">
              <SLine>Real Stories.</SLine>
              <SLine lag={22}>
                Real <em className="text-[#ecd09a] italic">Women.</em>
              </SLine>
            </h2>
            <p
              data-s="fade"
              data-lag={30}
              className="mt-3 max-w-[340px] font-sans text-[13px] leading-relaxed text-[#ded6cb]"
              style={{ opacity: 0.15 }}
            >
              Every dress carries a feeling. Here are the women who made them a part of their story.
            </p>
          </div>

          <div className="mx-auto mt-8 w-full max-w-[640px]">
            {/* Shadows sit on each moving piece (cached with its layer) instead of a wrapper that
                would be re-filtered every scroll frame */}
            <div className="relative z-10 flex items-start justify-between gap-[2vw]">
              <div
                data-gw="left"
                className="relative w-[51%] will-change-transform"
                style={{
                  aspectRatio: `${RECTS.left[2] - RECTS.left[0]} / ${RECTS.left[3] - RECTS.left[1]}`,
                  filter: "drop-shadow(0 14px 18px rgba(30,14,4,0.45))",
                  ...crop(RECTS.left),
                }}
              >
                <div
                  className="absolute flex items-center justify-center"
                  style={{ left: "5%", top: "58%", width: "64%", height: "38%" }}
                >
                  <Note
                    key={`ml${currentIndex}`}
                    lines={current.leftNoteLines}
                    d={0.2}
                    className="-rotate-[11deg] text-[clamp(14px,4.6vw,28px)]"
                  />
                </div>
              </div>
              <div
                data-gw="right"
                className="relative mt-[8%] w-[48%] will-change-transform"
                style={{
                  aspectRatio: `${RECTS.right[2] - RECTS.right[0]} / ${RECTS.right[3] - RECTS.right[1]}`,
                  filter: "drop-shadow(0 14px 18px rgba(30,14,4,0.45))",
                  ...crop(RECTS.right),
                }}
              >
                <div
                  className="absolute flex items-center justify-center"
                  style={{ left: "30%", top: "60%", width: "62%", height: "36%" }}
                >
                  <Note
                    key={`mr${currentIndex}`}
                    lines={current.rightNoteLines}
                    d={0.4}
                    className="-rotate-[11deg] text-[clamp(14px,4.6vw,28px)]"
                  />
                </div>
              </div>
            </div>

            <div className="relative z-20 -mt-[6vw] w-full sm:-mt-10">
              <div
                data-gw="paper"
                className="w-full will-change-transform"
                style={{ filter: "drop-shadow(0 16px 20px rgba(30,14,4,0.5))", ...crop(RECTS.center) }}
              >
                <div className="px-[11%] pt-[13%] pb-[13%]">
                  <TestimonialView
                    key={currentIndex}
                    item={current}
                    swapClass={swapClass}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between px-[2vw]">
              {navButtons("h-11 w-11")}
              {counterEl()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
