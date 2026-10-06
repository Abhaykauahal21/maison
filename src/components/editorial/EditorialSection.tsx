"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { getLenis, smoothScrollBy } from "@/lib/smooth-scroll";
import Image from "next/image";
import { EchoCard } from "@/components/editorial/EchoCard";
import { EchoParticles } from "@/components/editorial/EchoParticles";
import { EchoNote } from "@/components/editorial/EchoNote";
import { EchoStory } from "@/components/editorial/EchoStory";
import { useMatches } from "@/hooks/use-matches";

const lookData = [
  {
    title: "SOLACE",
    tag: "Floral Silk · Dawn",
    descLines: ["In the moments", "I find myself."],
    imageSrc: "/images/solace.webp",
    imageAlt: "Maison D'Vine Solace Gown in Floral Silk",
    objectPosition: "50% 15%",
    quote: "In the moments I find myself.",
    desc: "I wore Solace at the quiet edge of dawn — delicate floral silk falling in effortless grace. It was the first morning I belonged entirely to myself.",
    cta: "EXPLORE SOLACE",
  },
  {
    title: "LONGING",
    tag: "Crimson Tulle · Romance",
    descLines: ["In what lives", "between our hearts."],
    imageSrc: "/images/longing.webp",
    imageAlt: "Maison D'Vine Longing Gown in Crimson Tulle",
    objectPosition: "50% 15%",
    quote: "In what lives between our hearts.",
    desc: "I wore Longing the night I stopped hiding what I felt — crimson tulle cascading between the words I never said and the love I could not hold back.",
    cta: "EXPLORE LONGING",
  },
  {
    title: "REVERIE",
    tag: "Noir Satin · Midnight",
    descLines: ["For the dreams", "I don't say out loud."],
    imageSrc: "/images/reverie.webp",
    imageAlt: "Maison D'Vine Reverie Gown in Noir Satin",
    objectPosition: "50% 15%",
    quote: "For the dreams I don't say out loud.",
    desc: "Reverie is me at midnight — a sculpted noir silhouette, whispering the secrets only the stars were meant to hear.",
    cta: "EXPLORE REVERIE",
  },
];

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
  // Latches once the section scrolls into view, so the "Chapter 0" title plays when it can be seen
  const [seen, setSeen] = useState(false);
  // Which look's story is open (its card has been pulled off the board); null = none
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const storyOpenRef = useRef(false);
  useEffect(() => {
    storyOpenRef.current = storyIndex !== null;
  }, [storyIndex]);

  // High-performance mutable synchronization refs
  const isPinnedRef = useRef(false);
  const activeLookRef = useRef(0);
  const pinnedScrollYRef = useRef(0);
  const unpinCooldownRef = useRef(0);
  const lastGestureTimeRef = useRef(0);
  const accumulatedWheelDeltaRef = useRef(0);
  const touchStartYRef = useRef(0);

  // Sync state to refs
  useEffect(() => {
    isPinnedRef.current = isPinned;
  }, [isPinned]);

  useEffect(() => {
    activeLookRef.current = activeLook;
  }, [activeLook]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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

  // Every "explore" entry point opens the same torn-paper story page
  const openLook = useCallback((index: number) => {
    setStoryIndex(index);
  }, []);

  const setLook = useCallback((idx: number) => {
    setActiveLook(Math.min(2, Math.max(0, idx)));
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
    accumulatedWheelDeltaRef.current = 0;

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
    accumulatedWheelDeltaRef.current = 0;

    // Natural momentum continuation downwards
    smoothScrollBy(90);
  }, []);

  const unpinUp = useCallback(() => {
    unlockScroll();
    isPinnedRef.current = false;
    setIsPinned(false);
    unpinCooldownRef.current = Date.now() + 900;
    accumulatedWheelDeltaRef.current = 0;

    // Natural momentum continuation upwards
    smoothScrollBy(-90);
  }, []);

  // Step transitions
  const stepNext = useCallback(() => {
    if (activeLookRef.current < 2) {
      setLook(activeLookRef.current + 1);
    } else {
      unpinDown();
    }
  }, [setLook, unpinDown]);

  const stepPrev = useCallback(() => {
    if (activeLookRef.current > 0) {
      setLook(activeLookRef.current - 1);
    } else {
      unpinUp();
    }
  }, [setLook, unpinUp]);

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

  // Wheel listener: controls card progression when pinned
  // The non-passive wheel / touchmove listeners exist ONLY while pinned: a non-passive listener on
  // window makes the browser wait for the main thread on every gesture, even when it does nothing.
  useEffect(() => {
    if (!isPinned) return;
    const handleWheel = (e: WheelEvent) => {
      if (!isPinnedRef.current) return;
      if (storyOpenRef.current) return;

      // Prevent native viewport scroll
      e.preventDefault();

      const now = Date.now();
      if (now - lastGestureTimeRef.current < 380) {
        return; // debounce between cards for elegant pacing
      }

      accumulatedWheelDeltaRef.current += e.deltaY;

      const threshold = 35; // gentle, responsive notch sensitivity

      if (accumulatedWheelDeltaRef.current > threshold) {
        accumulatedWheelDeltaRef.current = 0;
        lastGestureTimeRef.current = now;
        stepNext();
      } else if (accumulatedWheelDeltaRef.current < -threshold) {
        accumulatedWheelDeltaRef.current = 0;
        lastGestureTimeRef.current = now;
        stepPrev();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isPinned, stepNext, stepPrev]);

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
      if (!isPinnedRef.current) return;

      if (e.touches.length === 1) {
        e.preventDefault();
        const currentY = e.touches[0].clientY;
        const deltaY = touchStartYRef.current - currentY;

        const now = Date.now();
        if (now - lastGestureTimeRef.current < 400) return;

        if (deltaY > 40) {
          touchStartYRef.current = currentY;
          lastGestureTimeRef.current = now;
          stepNext();
        } else if (deltaY < -40) {
          touchStartYRef.current = currentY;
          lastGestureTimeRef.current = now;
          stepPrev();
        }
      }
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      stopStart();
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isPinned, stepNext, stepPrev]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPinnedRef.current) return;
      if (storyOpenRef.current) return;

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

  const currentContent = lookData[activeLook];

  return (
    <section
      ref={containerRef}
      id="story"
      className="relative z-30 -mt-8 sm:-mt-12 md:-mt-16 lg:-mt-20 w-full bg-transparent text-[#221c17] select-none"
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
        <div
          className="relative w-full overflow-x-clip"
        >
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
            className="pointer-events-none absolute inset-0 z-11 animate-sunbeam opacity-20"
            style={{
              background:
                "radial-gradient(ellipse 90% 70% at 75% 30%, rgba(255, 240, 205, 0.45) 0%, rgba(245, 225, 185, 0.15) 50%, transparent 80%)",
            }}
            aria-hidden="true"
          />

          {/* Content layer positioned proportionally over the parchment */}
          <div className="pointer-events-auto absolute inset-0 z-20">
            {/* Left Dynamic Text Column: Changes with each active card */}
            <div
              className="absolute top-[16%] left-[15.2%] z-20 flex w-[28%] max-w-[410px] flex-col text-left"
              style={{
                transform: `translate3d(0, ${activeLook * -6}px, 0)`,
                transition: "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Top Row: CHAPTER 0 + Realtime Active Look Indicator */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[0.6vw] select-none">
                  <span
                    className={`chapter-gold font-allura allura-regular font-script font-cursive pr-[0.15em] text-[2.3vw] leading-none xl:text-[2.5vw] ${seen ? "chapter-write" : "opacity-0"}`}
                  >
                    Chapter
                  </span>
                  <span
                    className={`chapter-gold font-bodoni text-[2.9vw] leading-none font-normal italic xl:text-[3.1vw] ${seen ? "chapter-pop" : "opacity-0"}`}
                  >
                    0
                  </span>
                  <span
                    className={`h-px w-[2.4vw] bg-[#8a6a3b]/60 ${seen ? "chapter-line" : "scale-x-0"}`}
                    aria-hidden="true"
                  />
                </div>

                {/* Clickable Look Progress Dots */}
                <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] lg:text-[clamp(11px,0.75vw,14px)] font-medium tracking-widest text-[#4f4132]">
                  <span>LOOK {activeLook + 1}/3</span>
                  <div className="flex items-center gap-1.5 ml-1.5">
                    {[0, 1, 2].map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setLook(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          i === activeLook
                            ? "w-4 bg-[#1c1815]"
                            : i < activeLook
                            ? "w-2 bg-[#695a4c]"
                            : "w-1.5 bg-[#a99c88] hover:bg-[#7d705f]"
                        }`}
                        aria-label={`Go to look ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* THE ECHO Headline */}
              <div className="overflow-hidden mt-1 pb-1">
                <h2 className="font-bodoni text-3xl sm:text-4xl md:text-[3.8vw] lg:text-[4.2vw] xl:text-[4.5vw] font-normal leading-[0.92] tracking-[0.025em] text-[#14100c] uppercase">
                  THE ECHO
                </h2>
              </div>

              {/* Dynamic Content Group with Smooth Cross-fade per Look */}
              <div key={activeLook} className="animate-slide-left-in flex flex-col">
                {/* Active Look Subtitle */}
                <div className="mt-2 md:mt-3 min-h-[2.4em]">
                  <p className="font-serif italic text-sm sm:text-base md:text-[1.35vw] lg:text-[clamp(17px,1.35vw,30px)] text-[#1c1510] tracking-wide transition-all duration-300">
                    &ldquo;{currentContent.quote}&rdquo;
                  </p>
                </div>

                {/* Active Look Description */}
                <div className="mt-2 md:mt-3 max-w-[400px] lg:max-w-[min(26vw,480px)] min-h-[4.8em]">
                  <p className="font-sans text-xs sm:text-[13px] md:text-[1vw] lg:text-[clamp(14px,1vw,21px)] leading-[1.65] text-[#2e2418] tracking-[0.015em] transition-all duration-300">
                    {currentContent.desc}
                  </p>
                </div>

                {/* Active Look CTA Button */}
                <div className="mt-4 md:mt-5 lg:mt-6">
                  <button
                    type="button"
                    onClick={() => openLook(activeLook)}
                    className="group relative inline-flex cursor-pointer items-center space-x-3 md:space-x-4 overflow-hidden border border-[#221c17] bg-transparent px-4 py-2 md:px-5 md:py-2.5 lg:px-7 lg:py-2.5 text-[10px] md:text-[0.9vw] lg:text-[0.76vw] font-sans font-medium tracking-[0.2em] text-[#1c1815] uppercase transition-all duration-300 hover:bg-[#1c1815] hover:text-[#f4efe8] hover:shadow-lg active:scale-95"
                  >
                    <span>{currentContent.cta}</span>
                    <span className="text-xs transition-transform duration-300 group-hover:translate-x-1.5">
                      →
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side 3 Cards: Sequential Entrance based on activeLook */}
            <div className="absolute top-[13.5%] left-[45%] z-20 flex w-[50.5%] gap-3 md:gap-4 lg:gap-5 xl:gap-6">
              {lookData.map((col, idx) => {
                const isRevealed = idx <= activeLook;
                const isCurrentActive = idx === activeLook;
                const translateX = isRevealed ? 0 : 220;
                const opacity = isRevealed ? (isCurrentActive ? 1 : 0.85) : 0;
                const scale = isCurrentActive ? 1.02 : 0.98;
                // Pinned-print feel: each card sits at its own slight angle, the active one straightens and lifts
                const tilt = isCurrentActive ? 0 : [-1.6, 1.2, -0.9][idx];
                const lift = isCurrentActive ? -6 : 0;

                return (
                  <div
                    key={col.title}
                    className="flex-1 will-change-transform cursor-pointer"
                    style={{
                      opacity,
                      transform: `translate3d(${translateX}px, ${lift}px, 0) rotate(${tilt}deg) scale(${scale})`,
                      pointerEvents: isRevealed ? "auto" : "none",
                      transition:
                        "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    onClick={() => setLook(idx)}
                  >
                    <div className="transition-all duration-300 hover:opacity-100">
                      <EchoCard
                        title={col.title}
                        descLines={col.descLines as [string, string]}
                        tag={col.tag}
                        index={idx + 1}
                        imageSrc={col.imageSrc}
                        imageAlt={col.imageAlt}
                        objectPosition={col.objectPosition}
                        fallen={storyIndex === idx}
                        onPinFall={() => setStoryIndex(idx)}
                        onClick={() => openLook(idx)}
                      />
                    </div>
                  </div>
                );
              })}
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

          {/* Title block: kept clear of the dried flowers in the top-right corner */}
          <div className="relative z-10 w-full pr-[16%] text-left">
            <div
              className="flex items-center gap-2"
              style={{
                opacity: seg(0.05, 0.25),
                transform: `translate3d(0, ${(1 - seg(0.05, 0.25)) * 14}px, 0)`,
                transition: "opacity 0.25s linear, transform 0.25s linear",
              }}
            >
              <span
                className={`chapter-gold font-allura allura-regular font-script font-cursive pr-[0.15em] text-[28px] leading-none sm:text-[34px] ${seen ? "chapter-write" : "opacity-0"}`}
              >
                Chapter
              </span>
              <span
                className={`chapter-gold font-bodoni text-[34px] leading-none italic sm:text-[42px] ${seen ? "chapter-pop" : "opacity-0"}`}
              >
                0
              </span>
              <span
                className="h-px bg-[#8a6a3b]/60 transition-[width] duration-200 ease-out"
                style={{ width: seg(0.15, 0.3) * 36 }}
              />
            </div>

            <div className="overflow-hidden pb-1">
              <h2
                className="mt-1 font-bodoni text-[28px] leading-[0.92] font-normal tracking-[0.02em] text-[#14100c] uppercase min-[400px]:text-[32px] sm:mt-2 sm:text-[48px]"
                style={{
                  transform: `translate3d(0, ${(1 - seg(0.1, 0.3)) * 105}%, 0)`,
                  opacity: seg(0.1, 0.15),
                  transition: "transform 0.25s linear, opacity 0.25s linear",
                }}
              >
                THE ECHO
              </h2>
            </div>

            <div
              key={activeLook}
              className="mt-1.5 sm:mt-3"
              style={{ opacity: seg(0.15, 0.25) }}
            >
              <p
                className="animate-echo-rise font-serif text-[14px] leading-tight text-[#1c1510] italic sm:text-lg"
                style={{ animationDelay: "0ms" }}
              >
                &ldquo;{currentContent.quote}&rdquo;
              </p>
              <p
                className="animate-echo-rise mt-1.5 font-sans text-[12.5px] leading-relaxed text-[#2e2418] sm:mt-2.5 sm:text-[15px] sm:leading-[1.7]"
                style={{ animationDelay: "120ms" }}
              >
                {currentContent.desc}
              </p>
            </div>
          </div>

          {/* Looks: accordion-style stack, the active look expands and the rest recede */}
          <div className="relative z-10 my-4 flex min-h-0 w-full flex-1 flex-col gap-2.5 sm:my-8 sm:min-h-[360px] sm:gap-3.5">
            {lookData.map((col, idx) => {
              const isActive = idx === activeLook;
              return (
                <div
                  key={col.title}
                  className="min-h-0 w-full cursor-pointer will-change-transform"
                  style={{
                    flexGrow: isActive ? 2.2 : 1,
                    flexBasis: 0,
                    opacity: seg(0.2 + idx * 0.17, 0.25),
                    transform: `translate3d(${
                      (1 - seg(0.2 + idx * 0.17, 0.25)) * 80
                    }px, 0, 0)`,
                    transition:
                      "flex-grow 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s linear, transform 0.25s linear",
                  }}
                  onClick={() => (isActive ? openLook(idx) : setLook(idx))}
                >
                  <EchoCard
                    variant="horizontal"
                    active={isActive}
                    title={col.title}
                    descLines={col.descLines as [string, string]}
                        tag={col.tag}
                        index={idx + 1}
                    imageSrc={col.imageSrc}
                    imageAlt={col.imageAlt}
                    objectPosition={col.objectPosition}
                    onClick={() => {}}
                  />
                </div>
              );
            })}
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
              <button
                type="button"
                onClick={() => openLook(activeLook)}
                className="group inline-flex cursor-pointer items-center space-x-3.5 border border-[#221c17] bg-transparent px-5 py-2 font-sans text-[10.5px] font-medium tracking-[0.2em] text-[#1c1815] uppercase transition-all hover:bg-[#1c1815] hover:text-[#f4efe8] active:scale-95 sm:px-7 sm:py-3 sm:text-xs"
              >
                <span key={activeLook} className="animate-echo-rise">
                  {currentContent.cta}
                </span>
                <span className="text-xs transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>

              <div className="flex items-center gap-2 font-mono text-[10.5px] font-medium text-[#4f4132] sm:text-[12px]">
                <span>
                  {String(activeLook + 1).padStart(2, "0")} / 03
                </span>
                {activeLook < 2 && (
                  <span
                    className="animate-echo-swipe-hint text-[#3a3026]"
                    aria-hidden="true"
                  >
                    ↓
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Her story, on a torn paper page: opens when a card is pulled off its pin */}
      <EchoStory index={storyIndex} onClose={() => setStoryIndex(null)} />
    </section>
  );
};
