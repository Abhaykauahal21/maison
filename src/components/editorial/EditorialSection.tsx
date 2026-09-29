"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { EchoCard } from "@/components/editorial/EchoCard";
import { EchoParticles } from "@/components/editorial/EchoParticles";
import { EchoModal } from "@/components/editorial/EchoModal";

const lookData = [
  {
    title: "SOLACE",
    descLines: ["For the moments", "she finds herself."],
    imageSrc: "/images/solace.webp",
    imageAlt: "Maison D'Vine Solace Gown in Floral Silk",
    objectPosition: "50% 15%",
    quote: "For the moments she finds herself.",
    desc: "The Solace look captures the quiet stillness of dawn — delicate floral silk draped in effortless grace, for the woman who belongs to herself.",
    cta: "EXPLORE SOLACE",
  },
  {
    title: "LONGING",
    descLines: ["For what lives", "between hearts."],
    imageSrc: "/images/longing.webp",
    imageAlt: "Maison D'Vine Longing Gown in Crimson Tulle",
    objectPosition: "50% 15%",
    quote: "For what lives between hearts.",
    desc: "The Longing look breathes romantic drama — cascading layers of crimson tulle dancing between unvoiced passion and eternal connection.",
    cta: "EXPLORE LONGING",
  },
  {
    title: "REVERIE",
    descLines: ["For the dreams", "she doesn't say out loud."],
    imageSrc: "/images/reverie.webp",
    imageAlt: "Maison D'Vine Reverie Gown in Noir Satin",
    objectPosition: "50% 15%",
    quote: "For the dreams she doesn't say out loud.",
    desc: "The Reverie look commands the quiet midnight — sculpted noir silhouette whispering secrets only the stars were meant to hear.",
    cta: "EXPLORE REVERIE",
  },
];

export const EditorialSection: React.FC = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const [activeLook, setActiveLook] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Never leave the page locked if this section unmounts while pinned
  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  const openLook = useCallback((index: number) => {
    setSelectedCardIndex(index);
    setIsModalOpen(true);
  }, []);

  const setLook = useCallback((idx: number) => {
    setActiveLook(Math.min(2, Math.max(0, idx)));
  }, []);

  const snapRafRef = useRef(0);

  // Lock scrolling by clipping the root (overflow: hidden) instead of position: fixed on <body>.
  // position: fixed removed the scrollbar, reflowed the page (visible shift) and reset scrollY.
  // With html { scrollbar-gutter: stable } nothing reflows, and scrollY stays intact.
  const lockScroll = () => {
    document.documentElement.style.overflow = "hidden";
  };
  const unlockScroll = () => {
    cancelAnimationFrame(snapRafRef.current);
    document.documentElement.style.overflow = "";
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
    window.scrollBy({ top: 90, behavior: "smooth" });
  }, []);

  const unpinUp = useCallback(() => {
    unlockScroll();
    isPinnedRef.current = false;
    setIsPinned(false);
    unpinCooldownRef.current = Date.now() + 900;
    accumulatedWheelDeltaRef.current = 0;

    // Natural momentum continuation upwards
    window.scrollBy({ top: -90, behavior: "smooth" });
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

      // Ideal vertical framing: top ripped edge sits right under navbar (~45px)
      const targetTop = 45;

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
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isPinnedRef.current) return;

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
  }, [stepNext, stepPrev]);

  // Touch gesture support for mobile / tablet
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

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

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [stepNext, stepPrev]);

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
      <div className="relative hidden w-full overflow-x-clip lg:block">
        <div
          className="relative w-full overflow-x-clip"
        >
          {/* Exact background asset in normal flow - NO CROP, NO STRETCH, NO GAPS */}
          <Image
            src="/images/echo-bg.png"
            alt="The Echo Parchment"
            width={2048}
            height={846}
            priority
            unoptimized
            className="pointer-events-none block h-auto w-full select-none"
            style={{
              filter:
                "drop-shadow(0px -10px 22px rgba(0,0,0,0.5)) drop-shadow(0px 14px 24px rgba(0,0,0,0.55))",
            }}
          />

          {/* Floating Atelier Dried Botanical Particles */}
          <EchoParticles />

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
                <div className="font-sans text-[11px] sm:text-xs md:text-[1.1vw] lg:text-[0.82vw] font-medium tracking-[0.25em] text-[#4a3d31] uppercase select-none">
                  CHAPTER 0
                </div>

                {/* Clickable Look Progress Dots */}
                <div className="flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] tracking-widest text-[#7a6b5d]">
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
                            : "w-1.5 bg-[#cfc4b5] hover:bg-[#a89c8e]"
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
                  <p className="font-serif italic text-sm sm:text-base md:text-[1.35vw] lg:text-[1.3vw] text-[#2c231b] tracking-wide transition-all duration-300">
                    &ldquo;{currentContent.quote}&rdquo;
                  </p>
                </div>

                {/* Active Look Description */}
                <div className="mt-2 md:mt-3 max-w-[370px] lg:max-w-[22vw] min-h-[4.8em]">
                  <p className="font-sans text-xs sm:text-[13px] md:text-[1vw] lg:text-[0.9vw] leading-[1.65] text-[#4a3e33] tracking-[0.015em] transition-all duration-300">
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
                // Depth: earlier cards drift up slightly as newer ones arrive
                const depthShift = isRevealed ? -(activeLook - idx) * 8 : 0;

                return (
                  <div
                    key={col.title}
                    className="flex-1 will-change-transform cursor-pointer"
                    style={{
                      opacity,
                      transform: `translate3d(${translateX}px, ${depthShift}px, 0) scale(${scale})`,
                      pointerEvents: isRevealed ? "auto" : "none",
                      transition:
                        "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    onClick={() => setLook(idx)}
                  >
                    <div
                      className={`transition-all duration-300 rounded-[2px] ${
                        isCurrentActive
                          ? "ring-2 ring-[#221c17]/65 ring-offset-2 ring-offset-transparent shadow-xl"
                          : "hover:opacity-100"
                      }`}
                    >
                      <EchoCard
                        title={col.title}
                        descLines={col.descLines as [string, string]}
                        imageSrc={col.imageSrc}
                        imageAlt={col.imageAlt}
                        objectPosition={col.objectPosition}
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

      {/* ========================================================
          2. PHONE & TABLET EDITORIAL LAYOUT (< 1024px)
          - Parchment sheet from /images/echo-bg-mobile.png (487 x 1024, torn top/bottom,
            dried flowers top-right)
          - Phones: locked to the artwork's aspect ratio, so the torn edges sit exactly at the ends
          - Tablets: a centred sheet that grows with its content
          ======================================================== */}
      <div className="relative block h-auto w-full lg:hidden">
        <div className="relative mx-auto flex aspect-[487/1024] w-full max-w-[760px] flex-col justify-between px-6 pt-16 pb-14 text-[#221c17] sm:aspect-auto sm:min-h-[780px] sm:px-14 sm:pt-24 sm:pb-20">
          <Image
            src="/images/echo-bg-mobile.png"
            alt=""
            aria-hidden="true"
            fill
            priority
            unoptimized
            sizes="(max-width: 760px) 100vw, 760px"
            className="pointer-events-none z-0 object-fill select-none"
          />

          {/* Title block: kept clear of the dried flowers in the top-right corner */}
          <div className="relative z-10 w-full pr-[16%] text-left">
            <div className="font-sans text-[11px] font-medium tracking-[0.25em] text-[#3a3026] uppercase sm:text-xs">
              CHAPTER 0
            </div>

            <h2 className="mt-1 font-bodoni text-[28px] leading-[0.92] font-normal tracking-[0.02em] text-[#14100c] uppercase min-[400px]:text-[32px] sm:mt-2 sm:text-[48px]">
              THE ECHO
            </h2>

            <div key={activeLook} className="animate-slide-left-in mt-1.5 sm:mt-3">
              <p className="font-serif text-[13px] leading-tight text-[#2c231b] italic sm:text-lg">
                &ldquo;{currentContent.quote}&rdquo;
              </p>
              <p className="mt-1.5 font-sans text-xs leading-relaxed text-[#4a3e33] sm:mt-2.5 sm:text-[15px] sm:leading-[1.7]">
                {currentContent.desc}
              </p>
            </div>
          </div>

          {/* Looks */}
          <div className="relative z-10 my-4 flex w-full flex-col gap-3 sm:my-8 sm:gap-4">
            {lookData.map((col, idx) => {
              const isRevealed = idx <= activeLook;
              const translateX = isRevealed ? 0 : 90;
              const opacity = isRevealed ? (idx === activeLook ? 1 : 0.75) : 0;

              return (
                <div
                  key={col.title}
                  className="h-20 w-full cursor-pointer will-change-transform min-[400px]:h-24 sm:h-28"
                  style={{
                    opacity,
                    transform: `translate3d(${translateX}px, 0, 0)`,
                    pointerEvents: isRevealed ? "auto" : "none",
                    transition:
                      "opacity 0.4s ease-out, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  onClick={() => setLook(idx)}
                >
                  <EchoCard
                    variant="horizontal"
                    title={col.title}
                    descLines={col.descLines as [string, string]}
                    imageSrc={col.imageSrc}
                    imageAlt={col.imageAlt}
                    objectPosition={col.objectPosition}
                    onClick={() => openLook(idx)}
                  />
                </div>
              );
            })}
          </div>

          {/* CTA + look indicator */}
          <div className="relative z-10 flex w-full items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={() => openLook(activeLook)}
              className="group inline-flex cursor-pointer items-center space-x-3.5 border border-[#221c17] bg-transparent px-5 py-2 font-sans text-[10.5px] font-medium tracking-[0.2em] text-[#1c1815] uppercase transition-all hover:bg-[#1c1815] hover:text-[#f4efe8] sm:px-7 sm:py-3 sm:text-xs"
            >
              <span>{currentContent.cta}</span>
              <span className="text-xs transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>

            <div className="flex items-center gap-1 font-mono text-[9.5px] text-[#7a6b5d] sm:text-[11px]">
              <span>LOOK {activeLook + 1}/3</span>
              <div className="ml-1 flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLook(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeLook ? "w-3 bg-[#1c1815]" : "w-1.5 bg-[#cfc4b5]"
                    }`}
                    aria-label={`Go to look ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Haute Couture Lookbook Modal */}
      <EchoModal
        initialIndex={selectedCardIndex}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};
