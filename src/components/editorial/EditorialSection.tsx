"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { getLenis, smoothScrollBy } from "@/lib/smooth-scroll";
import Image from "next/image";
import { EchoParticles } from "@/components/editorial/EchoParticles";
import { EchoNote } from "@/components/editorial/EchoNote";
import { useMatches } from "@/hooks/use-matches";

const dresses = [
  {
    no: "I",
    title: ["THE DRESS", "SHE ALREADY HAD"],
    body: "If life were a photograph, I wasn’t the focus, I was the blur in the background, the quiet shape that gave balance to the scene but never claimed the light.",
    imageSrc: "/images/editorial/dress-i-had.webp",
    imageAlt: "A soft grey linen dress with a notched neckline",
  },
  {
    no: "II",
    title: ["THE DRESS", "SHE BORROWED"],
    body: "Sometimes, you borrow someone else’s dress hoping it will carry the confidence you couldn’t find in your own. That evening, my room looked like a small disaster. Clothes covered the bed, the chair, the floor.",
    imageSrc: "/images/editorial/VintageFloralPeonyMaxiDress.webp",
    imageAlt: "A cream maxi dress printed with coral peonies and blue blossoms",
  },
  {
    no: "III",
    title: ["THE DRESS", "SHE BOUGHT"],
    body: "There are dresses you buy because they’re beautiful. And then there are dresses you buy because you hope they’ll turn you into someone else. I bought the dress after seeing it once, and never stopped seeing it again.",
    imageSrc: "/images/editorial/dress-borrowed.webp",
    imageAlt: "A midnight blue sweetheart-neckline dress with a full skirt",
  },
];

/**
 * Scroll-linked chapters. The section keeps ONE continuous progress value (0 → 2). Every chapter layer
 * carries CSS variables written straight from that value, so nothing is "triggered": the words, headline
 * and dress are scrubbed by the scroll itself.
 *   --d  signed distance from this chapter's resting point (-1 = still to come, +1 = already passed)
 *   --a  |d|        --s  +1 while the chapter is still to come, -1 once it has passed
 */
type Register = (el: HTMLElement | null) => void | (() => void);

const chapterVars = (idx: number) =>
  ({
    "--d": -idx,
    "--a": idx,
    "--s": 1,
  }) as React.CSSProperties;

/** One chapter's words: tilts in from depth, headline lines rise, body words surface one by one. */
const DressText: React.FC<{
  idx: number;
  active: number;
  register: Register;
  titleClass: string;
  bodyClass: string;
}> = ({ idx, active, register, titleClass, bodyClass }) => {
  const d = dresses[idx];
  const words = d.body.split(" ");
  return (
    <div
      ref={register}
      data-idx={idx}
      data-kind="text"
      data-on={idx === 0 ? "true" : "false"}
      aria-hidden={idx !== active}
      className="absolute inset-0 will-change-transform"
      style={{
        ...chapterVars(idx),
        opacity: "clamp(0, calc(1 - var(--a) * 2.4), 1)",
        transform:
          "translate3d(0, calc(var(--d) * -64px), calc(var(--a) * -180px)) rotateX(calc(var(--d) * 24deg))",
        transformOrigin: "50% 100%",
      }}
    >
      <h2 className={titleClass}>
        {d.title.map((line, li) => (
          <span key={line} className="block overflow-hidden pb-[0.06em]">
            <span
              className="block will-change-transform"
              style={{
                transform: `translate3d(0, calc(clamp(0, calc(var(--a) * 3 - ${(0.2 - li * 0.12).toFixed(2)}), 1) * var(--s) * 112%), 0)`,
              }}
            >
              {line}
            </span>
          </span>
        ))}
      </h2>
      <span
        aria-hidden="true"
        className="mt-3 block h-px w-14 origin-left bg-[#8a6a3b]/70"
        style={{ transform: "scaleX(clamp(0, calc(1 - var(--a) * 2.6), 1))" }}
      />
      <p className={bodyClass}>
        {words.map((w, wi) => (
          <span
            key={wi}
            className="echo-w inline-block"
            style={{ ["--wd" as string]: `${(0.18 + wi * 0.028).toFixed(3)}s` }}
          >
            {w}
            {"\u00a0"}
          </span>
        ))}
      </p>
    </div>
  );
};

/** The dress itself: swings through 3D on its own axis as the scroll moves it in and out. */
const DressImage: React.FC<{ idx: number; active: number; register: Register; sizes: string }> = ({
  idx,
  active,
  register,
  sizes,
}) => {
  const d = dresses[idx];
  return (
    <div
      ref={register}
      data-idx={idx}
      aria-hidden={idx !== active}
      className="absolute inset-0 will-change-transform"
      style={{
        ...chapterVars(idx),
        opacity: "clamp(0, calc(1 - var(--a) * 1.5), 1)",
        transform:
          "translate3d(calc(var(--d) * -34%), calc(var(--d) * -4%), calc(var(--a) * -380px)) rotateY(calc(var(--d) * 80deg)) rotateZ(calc(var(--d) * -7deg)) scale(calc(1 - var(--a) * 0.14))",
      }}
    >
      {/* soft shadow on the paper below the hovering dress */}
      <div
        aria-hidden="true"
        className="absolute bottom-[1%] left-1/2 h-[4%] w-[52%] -translate-x-1/2 rounded-[50%] bg-[#2a1d10]/45 blur-lg"
        style={{ opacity: "clamp(0, calc(1 - var(--a) * 2), 1)" }}
      />
      <div className="animate-echo-dress-float relative h-full w-full">
        <Image
          src={d.imageSrc}
          alt={d.imageAlt}
          fill
          sizes={sizes}
          priority={idx === 0}
          className="object-contain object-center drop-shadow-[0_22px_26px_rgba(40,26,12,0.42)]"
        />
      </div>
    </div>
  );
};

/** Warm light behind the dress; drifts slower than the dress for parallax depth. */
const MOTES = [
  { x: 14, y: 22, size: 5, k: 90, delay: 0 },
  { x: 78, y: 16, size: 4, k: 150, delay: 1.2 },
  { x: 88, y: 58, size: 6, k: 60, delay: 2.1 },
  { x: 8, y: 66, size: 4, k: 130, delay: 0.7 },
  { x: 30, y: 84, size: 3, k: 190, delay: 1.8 },
  { x: 64, y: 90, size: 5, k: 110, delay: 2.6 },
  { x: 52, y: 8, size: 3, k: 170, delay: 0.4 },
];

const DressBackdrop: React.FC<{ idx: number; register: Register }> = ({ idx, register }) => (
  <div
    ref={register}
    data-idx={idx}
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 flex items-center justify-center"
    style={{
      ...chapterVars(idx),
      opacity: "clamp(0, calc(1 - var(--a) * 1.3), 1)",
      transform: "translate3d(calc(var(--d) * 22%), 0, 0)",
    }}
  >
    <div
      className="absolute inset-[6%] rounded-full blur-2xl"
      style={{
        background: "radial-gradient(closest-side, rgba(255,238,200,0.6), transparent 75%)",
      }}
    />
    {/* gold dust at different depths: each speck drifts at its own speed as you scroll */}
    {MOTES.map((m, i) => (
      <span
        key={i}
        className="animate-echo-dress-float absolute rounded-full bg-[#c9a46a] blur-[1px]"
        style={{
          left: `${m.x}%`,
          top: `${m.y}%`,
          width: m.size,
          height: m.size,
          opacity: 0.55,
          animationDelay: `-${m.delay}s`,
          translate: `calc(var(--d) * ${m.k}px) 0`,
        }}
      />
    ))}
  </div>
);

/** Clickable chapter progress: 01 / 03 plus a bar per chapter */
const DressProgress: React.FC<{ active: number; onPick: (i: number) => void }> = ({
  active,
  onPick,
}) => (
  <div className="flex items-center gap-3 font-mono text-[10px] font-medium tracking-widest text-[#4f4132] md:text-[clamp(10px,0.75vw,14px)]">
    <div className="flex items-center gap-1.5">
      {dresses.map((d, i) => (
        <button
          key={d.no}
          type="button"
          onClick={() => onPick(i)}
          aria-label={`Go to chapter ${d.no}`}
          className={`h-1.5 cursor-pointer rounded-full transition-all duration-500 ${
            i === active
              ? "w-6 bg-[#1c1815]"
              : i < active
                ? "w-2.5 bg-[#695a4c]"
                : "w-2 bg-[#a99c88] hover:bg-[#7d705f]"
          }`}
        />
      ))}
    </div>
  </div>
);

export const EditorialSection: React.FC = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const mobileRef = useRef<HTMLDivElement | null>(null);
  const wide = useMatches("(min-width: 1024px)");
  const showMobile = wide !== true;
  const [mobileProgress, setMobileProgress] = useState(0);
  const seg = (start: number, len: number) =>
    Math.min(1, Math.max(0, (mobileProgress - start) / len));
  const [activeLook, setActiveLook] = useState(0);
  const [isPinned, setIsPinned] = useState(false);

  // High-performance mutable synchronization refs
  const isPinnedRef = useRef(false);
  const activeLookRef = useRef(0);
  const pinnedScrollYRef = useRef(0);
  const unpinCooldownRef = useRef(0);
  const touchStartYRef = useRef(0);

  // Sync state to refs
  useEffect(() => {
    isPinnedRef.current = isPinned;
  }, [isPinned]);

  useEffect(() => {
    activeLookRef.current = activeLook;
  }, [activeLook]);

  // Never leave the page locked if this section unmounts while pinned
  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = "";
      getLenis()?.start();
    };
  }, []);

  // Scroll-linked progress for the mobile layout: 0 = below the fold, 1 = fully in view.
  // Bidirectional, so everything plays forward on scroll down and rewinds on scroll up.
  useEffect(() => {
    const el = mobileRef.current;
    if (!el || !showMobile) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = (vh * 0.92 - rect.top) / (rect.height * 0.55);
      const p = Math.round(Math.min(1, Math.max(0, raw)) * 100) / 100;
      setMobileProgress((prev) => (prev === p ? prev : p));
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
  }, [showMobile]);

  // ---- Scroll-linked progress engine -------------------------------------------------------------
  // `target` follows the wheel / touch directly; `cur` chases it with easing and is what the layers read.
  // When input stops, the target settles onto the nearest chapter (biased by swipe direction).
  const progTargetRef = useRef(0);
  const progCurRef = useRef(0);
  const progRafRef = useRef(0);
  const baseRef = useRef(0); // chapter the current gesture started from: one gesture moves at most one chapter
  const lastChangeRef = useRef(0);
  const settleTimerRef = useRef(0);
  const dirRef = useRef(1);
  const layersRef = useRef<Set<HTMLElement>>(new Set());

  const applyProgress = useCallback((cur: number) => {
    layersRef.current.forEach((el) => {
      const d = Math.max(-1, Math.min(1, cur - Number(el.dataset.idx)));
      el.style.setProperty("--d", d.toFixed(4));
      el.style.setProperty("--a", Math.abs(d).toFixed(4));
      el.style.setProperty("--s", d < 0 ? "1" : "-1");
      if (el.dataset.kind === "text") {
        // the words write themselves once this chapter is (nearly) in place, and clear when it leaves
        const on = Math.abs(d) < 0.3 ? "true" : "false";
        if (el.dataset.on !== on) el.dataset.on = on;
      }
    });
    const idx = Math.round(Math.min(2, Math.max(0, cur)));
    if (idx !== activeLookRef.current) {
      activeLookRef.current = idx;
      lastChangeRef.current = Date.now();
      setActiveLook(idx);
    }
  }, []);

  const registerLayer = useCallback(
    (el: HTMLElement | null) => {
      if (!el) return;
      layersRef.current.add(el);
      applyProgress(progCurRef.current);
      return () => {
        layersRef.current.delete(el);
      };
    },
    [applyProgress]
  );

  const runLoop = useCallback(() => {
    if (progRafRef.current) return;
    const tick = () => {
      const diff = progTargetRef.current - progCurRef.current;
      if (Math.abs(diff) < 0.0008) {
        progCurRef.current = progTargetRef.current;
        applyProgress(progCurRef.current);
        progRafRef.current = 0;
        return;
      }
      progCurRef.current += diff * 0.1;
      applyProgress(progCurRef.current);
      progRafRef.current = requestAnimationFrame(tick);
    };
    progRafRef.current = requestAnimationFrame(tick);
  }, [applyProgress]);

  const jumpTo = useCallback(
    (idx: number) => {
      const i = Math.min(2, Math.max(0, idx));
      window.clearTimeout(settleTimerRef.current);
      baseRef.current = i;
      progTargetRef.current = i;
      lastChangeRef.current = Date.now();
      runLoop();
    },
    [runLoop]
  );
  const setLook = jumpTo;

  useEffect(() => {
    const timer = settleTimerRef;
    return () => {
      cancelAnimationFrame(progRafRef.current);
      window.clearTimeout(timer.current);
    };
  }, []);

  const snapRafRef = useRef(0);

  // Lock scrolling by clipping the root (overflow: hidden) instead of position: fixed on <body>.
  // position: fixed removed the scrollbar, reflowed the page (visible shift) and reset scrollY.
  // With html { scrollbar-gutter: stable } nothing reflows, and scrollY stays intact.
  const lockScroll = () => {
    getLenis()?.stop();
    document.documentElement.style.overflow = "hidden";
  };
  const unlockScroll = () => {
    cancelAnimationFrame(snapRafRef.current);
    document.documentElement.style.overflow = "";
    getLenis()?.start();
  };

  const pinAtTarget = useCallback((targetY: number) => {
    if (isPinnedRef.current) return;
    pinnedScrollYRef.current = targetY;

    lockScroll();
    isPinnedRef.current = true;
    setIsPinned(true);
    baseRef.current = activeLookRef.current;
    progTargetRef.current = baseRef.current;
    lastChangeRef.current = Date.now();

    // Ease into the exact framing instead of jumping (the old hard snap felt like a jolt)
    const startY = window.scrollY;
    const distance = targetY - startY;
    if (Math.abs(distance) > 0.5) {
      const duration = 320;
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        window.scrollTo({ top: startY + distance * eased, behavior: "instant" });
        if (p < 1) snapRafRef.current = requestAnimationFrame(step);
      };
      snapRafRef.current = requestAnimationFrame(step);
    }
  }, []);

  // Smooth unpin handlers
  const unpinDown = useCallback(() => {
    unlockScroll();
    isPinnedRef.current = false;
    setIsPinned(false);
    unpinCooldownRef.current = Date.now() + 900;
    window.clearTimeout(settleTimerRef.current);
    baseRef.current = 2;
    progTargetRef.current = 2;
    runLoop();

    // Natural momentum continuation downwards
    smoothScrollBy(90);
  }, [runLoop]);

  const unpinUp = useCallback(() => {
    unlockScroll();
    isPinnedRef.current = false;
    setIsPinned(false);
    unpinCooldownRef.current = Date.now() + 900;
    window.clearTimeout(settleTimerRef.current);
    baseRef.current = 0;
    progTargetRef.current = 0;
    runLoop();

    // Natural momentum continuation upwards
    smoothScrollBy(-90);
  }, [runLoop]);

  // Keyboard / dot navigation: one whole chapter at a time
  const stepNext = useCallback(() => {
    if (activeLookRef.current < 2) jumpTo(activeLookRef.current + 1);
    else unpinDown();
  }, [jumpTo, unpinDown]);

  const stepPrev = useCallback(() => {
    if (activeLookRef.current > 0) jumpTo(activeLookRef.current - 1);
    else unpinUp();
  }, [jumpTo, unpinUp]);

  // Wheel / touch: scrub the progress directly, settle on a chapter when the gesture ends
  const settle = useCallback(() => {
    if (!isPinnedRef.current) return;
    const snapped = Math.min(
      2,
      Math.max(0, Math.round(progTargetRef.current + dirRef.current * 0.38)),
      baseRef.current + 1
    );
    jumpTo(Math.max(snapped, baseRef.current - 1));
  }, [jumpTo]);

  const scrub = useCallback(
    (delta: number) => {
      if (!isPinnedRef.current) return;
      const lo = Math.max(baseRef.current - 1, -0.3);
      const hi = Math.min(baseRef.current + 1, 2.3);
      progTargetRef.current = Math.min(hi, Math.max(lo, progTargetRef.current + delta));
      if (Math.abs(delta) > 0.0005) dirRef.current = delta > 0 ? 1 : -1;
      runLoop();

      // pushing past the last / first chapter hands the page back (ignored right after a chapter change,
      // so the tail of a trackpad swipe can't throw you out of the section)
      const settled = Date.now() - lastChangeRef.current > 700;
      if (settled && baseRef.current === 2 && progTargetRef.current >= 2.14) {
        unpinDown();
        return;
      }
      if (settled && baseRef.current === 0 && progTargetRef.current <= -0.14) {
        unpinUp();
        return;
      }
      window.clearTimeout(settleTimerRef.current);
      settleTimerRef.current = window.setTimeout(settle, 170);
    },
    [runLoop, settle, unpinDown, unpinUp]
  );

  // Viewport scroll detector: cleanly catches the section when it arrives in view
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const checkTrigger = () => {
      if (isPinnedRef.current) return;
      if (Date.now() < unpinCooldownRef.current) return;

      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY >= lastScrollY;
      lastScrollY = currentScrollY;

      // Ideal vertical framing: top ripped edge tucks right under the navbar's torn strip.
      // The artwork has ~14px of transparent margin above its torn edge, so the section top sits
      // higher than the navbar bottom; at 45px that margin showed the dark page bg as a black band.
      const targetTop = 30;

      if (scrollingDown && activeLookRef.current < 2) {
        // Entering from Hero going down
        if (rect.top <= targetTop + 25 && rect.top >= targetTop - 50) {
          const exactY = Math.round(window.scrollY + (rect.top - targetTop));
          pinAtTarget(exactY);
        }
      } else if (!scrollingDown && activeLookRef.current > 0) {
        // Entering from DreamSection going up
        if (rect.top >= targetTop - 50 && rect.top <= targetTop + 25) {
          const exactY = Math.round(window.scrollY + (rect.top - targetTop));
          pinAtTarget(exactY);
        }
      }
    };

    const onScroll = () => {
      if (isPinnedRef.current) return; // Never run during pin (prevents any vibration)
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          checkTrigger();
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pinAtTarget]);

  // Wheel listener: scrubs the chapters while pinned
  // The non-passive wheel / touchmove listeners exist ONLY while pinned: a non-passive listener on
  // window makes the browser wait for the main thread on every gesture, even when it does nothing.
  useEffect(() => {
    if (!isPinned) return;
    const handleWheel = (e: WheelEvent) => {
      if (!isPinnedRef.current) return;
      e.preventDefault(); // no native viewport scroll while pinned
      const dy = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
      scrub(dy / 600);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isPinned, scrub]);

  // Touch gesture support for mobile / tablet
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    const stopStart = () => window.removeEventListener("touchstart", handleTouchStart);
    if (!isPinned) return stopStart;

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPinnedRef.current || e.touches.length !== 1) return;
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartYRef.current - currentY;
      touchStartYRef.current = currentY;
      scrub(deltaY / 320);
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      stopStart();
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isPinned, scrub]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPinnedRef.current) return;

      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        stepNext();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        stepPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stepNext, stepPrev]);

  return (
    <section
      ref={containerRef}
      id="story"
      className="relative z-30 -mt-8 w-full bg-transparent text-[#221c17] select-none sm:-mt-12 md:-mt-16 lg:-mt-20"
    >
      {/* ========================================================
          1. DESKTOP & TABLET EDITORIAL PINNED SCROLLYTELLING (md: 768px+)
          - Natural flow, seamless joints between Hero and DreamSection
          - Rock-solid freeze (ZERO vibration / jitter)
          - Cards enter 1-by-1 smoothly with each scroll gesture
          - Left editorial content smoothly cross-fades per look
          ======================================================== */}
      {wide !== false && (
        <div className="relative hidden w-full overflow-x-clip lg:block">
          <div className="relative w-full overflow-x-clip">
            {/* Exact background asset in normal flow - NO CROP, NO STRETCH, NO GAPS */}
            <Image
              src="/images/closer-chapter-bg.webp"
              alt="The Echo Parchment"
              width={1983}
              height={793}
              unoptimized
              className="pointer-events-none block h-auto w-full select-none"
              style={{
                filter:
                  "drop-shadow(0px -10px 22px rgba(0,0,0,0.5)) drop-shadow(0px 14px 24px rgba(0,0,0,0.55))",
              }}
            />

            {/* Floating Atelier Dried Botanical Particles */}
            <EchoParticles />

            {/* Dried flowers + handwritten note (recreated in HTML; the old PNG had them baked in) */}
            <EchoNote />

            {/* Atmospheric Sunlight Beam */}
            <div
              className="animate-sunbeam pointer-events-none absolute inset-0 z-11 opacity-20"
              style={{
                background:
                  "radial-gradient(ellipse 90% 70% at 75% 30%, rgba(255, 240, 205, 0.45) 0%, rgba(245, 225, 185, 0.15) 50%, transparent 80%)",
              }}
              aria-hidden="true"
            />

            {/* Content layer positioned proportionally over the parchment */}
            <div className="pointer-events-auto absolute inset-0 z-20">
              {/* Left: the chapter's words, tilting in from depth and out again as you scroll */}
              <div className="absolute top-[15%] left-[15.2%] z-20 h-[62%] w-[28%] max-w-[430px] [perspective:1200px]">
                {dresses.map((_, idx) => (
                  <DressText
                    key={idx}
                    idx={idx}
                    active={activeLook}
                    register={registerLayer}
                    titleClass="mt-1 font-bodoni text-[clamp(26px,3.1vw,60px)] leading-[0.98] font-normal tracking-[0.03em] text-[#14100c] uppercase"
                    bodyClass="mt-4 max-w-[min(26vw,440px)] font-serif text-[clamp(14px,1.08vw,22px)] leading-[1.7] text-[#2e2418] italic"
                  />
                ))}
                <div className="absolute bottom-0 left-0">
                  <DressProgress active={activeLook} onPick={setLook} />
                </div>
              </div>

              {/* Right: the dress, swinging through 3D */}
              <div className="absolute top-[9%] left-[46%] z-20 h-[80%] w-[46%] [perspective:1500px] [transform-style:preserve-3d]">
                {dresses.map((_, idx) => (
                  <DressBackdrop key={`bd-${idx}`} idx={idx} register={registerLayer} />
                ))}
                {dresses.map((_, idx) => (
                  <DressImage
                    key={idx}
                    idx={idx}
                    active={activeLook}
                    register={registerLayer}
                    sizes="46vw"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          2. PHONE & TABLET EDITORIAL LAYOUT (< 1024px)
          - Parchment sheet from /images/echo-bg-mobile.webp (487 x 1024, torn top/bottom,
            dried flowers top-right)
          - Phones: locked to the artwork's aspect ratio, so the torn edges sit exactly at the ends
          - Tablets: a centred sheet that grows with its content
          ======================================================== */}
      {showMobile && (
        <div ref={mobileRef} className="relative block h-auto w-full lg:hidden">
          <div className="relative mx-auto flex aspect-[487/1024] w-full max-w-[760px] flex-col px-6 pt-16 pb-14 text-[#221c17] sm:aspect-auto sm:min-h-[820px] sm:px-14 sm:pt-24 sm:pb-20">
            <Image
              src="/images/echo-bg-mobile.webp"
              alt=""
              aria-hidden="true"
              fill
              unoptimized
              sizes="(max-width: 760px) 100vw, 760px"
              className="pointer-events-none z-0 object-fill select-none"
            />

            {/* Chapter words + dress; kept clear of the dried flowers in the top-right corner */}
            <div
              className="relative z-10 flex min-h-0 w-full flex-1 flex-col [perspective:1200px]"
              style={{
                opacity: seg(0.1, 0.3),
                transform: `translate3d(0, ${(1 - seg(0.1, 0.3)) * 24}px, 0)`,
                transition: "opacity 0.25s linear, transform 0.25s linear",
              }}
            >
              <div className="relative h-[8.5rem] w-full pr-[14%] sm:h-[11rem]">
                {dresses.map((_, idx) => (
                  <DressText
                    key={idx}
                    idx={idx}
                    active={activeLook}
                    register={registerLayer}
                    titleClass="mt-1 font-bodoni text-[24px] leading-[0.98] font-normal tracking-[0.03em] text-[#14100c] uppercase min-[400px]:text-[27px] sm:text-[40px]"
                    bodyClass="mt-2.5 font-serif text-[12.5px] leading-[1.6] text-[#2e2418] italic sm:text-[15px]"
                  />
                ))}
              </div>
              <div className="relative my-3 min-h-0 w-full flex-1 [perspective:1200px] [transform-style:preserve-3d] sm:my-6 sm:min-h-[340px]">
                {dresses.map((_, idx) => (
                  <DressBackdrop key={`bd-${idx}`} idx={idx} register={registerLayer} />
                ))}
                {dresses.map((_, idx) => (
                  <DressImage
                    key={idx}
                    idx={idx}
                    active={activeLook}
                    register={registerLayer}
                    sizes="(max-width: 760px) 80vw, 460px"
                  />
                ))}
              </div>
            </div>

            {/* CTA + progress + swipe hint */}
            <div
              className="relative z-10 flex w-full flex-col gap-3"
              style={{
                opacity: seg(0.5, 0.3),
                transform: `translate3d(0, ${(1 - seg(0.5, 0.3)) * 18}px, 0)`,
                transition: "opacity 0.25s linear, transform 0.25s linear",
              }}
            >
              <div className="flex h-px w-full gap-1.5" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="relative h-px flex-1 bg-[#221c17]/15">
                    <div
                      className="absolute inset-y-0 left-0 h-[2px] -translate-y-1/2 bg-[#1c1815] transition-[width] duration-700 ease-out"
                      style={{ width: i <= activeLook ? "100%" : "0%", top: "50%" }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex w-full items-center justify-between gap-4">
                <DressProgress active={activeLook} onPick={setLook} />
                {activeLook < 2 && (
                  <span className="animate-echo-swipe-hint text-[#3a3026]" aria-hidden="true">
                    ↓
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
