"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HeroContent } from "@/components/home/HeroContent";
import { ScrollIndicator } from "@/components/home/ScrollIndicator";
import { HeroParticles } from "@/components/home/HeroParticles";
import { FilmModal } from "@/components/home/FilmModal";
import { EditorialText } from "@/components/home/EditorialText";

export const Hero: React.FC = () => {
  const [isFilmOpen, setIsFilmOpen] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  // "Cover" reveal: the hero stays pinned while the Editorial section slides over it.
  // --cover (0 -> 1) is derived from the Editorial section's position, which stays
  // correct while Editorial freezes the body (window.scrollY reads 0 then).
  useEffect(() => {
    const hero = sectionRef.current;
    if (!hero) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const update = () => {
      raf = 0;
      const story = document.getElementById("story");
      if (!story) return;
      const vh = window.innerHeight;
      const top = story.getBoundingClientRect().top;
      const cover = Math.min(1, Math.max(0, (vh - 100 - top) / Math.max(1, vh - 145)));
      hero.style.setProperty("--cover", reduceMotion ? "0" : cover.toFixed(3));
      // Once fully covered, hide the pinned hero so it never bleeds through later sections.
      hero.style.visibility = cover >= 1 ? "hidden" : "visible";
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    // A pinned hero taller than the viewport would clip its buttons, so only pin when it fits.
    const fit = () => {
      hero.style.position = hero.offsetHeight > window.innerHeight + 1 ? "relative" : "";
    };
    const onResize = () => {
      fit();
      schedule();
    };

    fit();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="hero"
        className="sticky top-0 z-0 w-full bg-[#0e0d0c] select-none"
      >
        {/* ========================================================
          1. DESKTOP & TABLET (md: 768px+)
          Matches Reference Composition (1024 x 585 / 16:9.2 Aspect):
          - Proportional dimensions matching reference image
          - Left editorial text positioned with buttons
          - Right handwritten script: Different Stories Same Sisterhood
          - Bottom edge designed to be overlapped by parchment page below
          ======================================================== */}
        <div className="relative hidden h-[100dvh] max-h-[1050px] min-h-[520px] w-full overflow-hidden md:landscape:block">
          {/* Full hero image layer with framing matching reference (scroll parallax wrapper) */}
          <div
            className="absolute inset-0 will-change-transform"
            style={{ transform: "scale(calc(1 + var(--cover, 0) * 0.06))" }}
          >
            <div className="animate-hero-image-settle absolute inset-0 h-full w-full will-change-transform">
              <Image
                src="/images/hero.webp"
                alt="Maison D'Vine Haute Couture Collection"
                fill
                priority
                unoptimized
                className="pointer-events-none h-full w-full object-cover object-[center_30%] select-none"
              />
            </div>
          </div>

          {/* Ambient floating golden couture light particles */}
          <HeroParticles />

          {/* Slow drifting warm light across the couture image (autonomous, no mouse) */}
          <div
            className="animate-hero-glow pointer-events-none absolute inset-0 z-12"
            style={{
              background:
                "radial-gradient(60vw circle at 68% 38%, rgba(235, 205, 150, 0.10) 0%, rgba(235, 205, 150, 0.03) 45%, transparent 75%)",
            }}
            aria-hidden="true"
          />

          {/* Subtle cinematic left-to-right contrast overlay matching IMAGE 1 */}
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background: `
              linear-gradient(90deg, rgba(8, 7, 6, 0.45) 0%, rgba(8, 7, 6, 0.22) 28%, rgba(8, 7, 6, 0.04) 48%, transparent 65%),
              linear-gradient(180deg, rgba(8, 7, 6, 0.35) 0%, transparent 15%, transparent 85%, rgba(8, 7, 6, 0.2) 100%)
            `,
            }}
            aria-hidden="true"
          />

          {/* Main Content Layout Overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-20 w-full will-change-transform"
            style={{
              transform: "translateY(calc(var(--cover, 0) * -48px))",
              opacity: "calc(1 - var(--cover, 0) * 0.9)",
            }}
          >
            {/* Left Editorial Content - Positioned matching Reference 2 */}
            <div className="animate-hero-from-left pointer-events-auto absolute top-[21%] left-[6vw] z-20 w-[44%] max-w-[440px] lg:top-[22%] lg:left-[6.2vw]">
              <HeroContent onOpenFilm={() => setIsFilmOpen(true)} />
            </div>

            {/* Right Script Accent: Different Stories Same Sisterhood */}
            <div className="animate-hero-from-right pointer-events-none absolute top-[21%] right-[5.5vw] z-20 lg:top-[22%] lg:right-[6.2vw]">
              <EditorialText />
            </div>

            {/* Bottom Right Area: Scroll Indicator */}
            <div className="pointer-events-auto absolute right-[5.5vw] bottom-[3.5%] z-20 lg:right-[6.2vw]">
              <ScrollIndicator />
            </div>
          </div>
        </div>

        {/* ========================================================
          2. MOBILE (< 768px)
          Vertical screen adaptation anchored comfortably above fold
          ======================================================== */}
        <div className="relative block h-[100dvh] max-h-[1100px] min-h-[600px] w-full overflow-hidden md:landscape:hidden">
          <div className="animate-hero-image-settle absolute inset-0 z-0">
            <Image
              src="/images/hero.webp"
              alt="Maison D'Vine Haute Couture Collection"
              fill
              priority
              unoptimized
              className="pointer-events-none object-cover object-[52%_28%] select-none"
            />
          </div>

          {/* Floating golden particles on mobile */}
          <HeroParticles />

          <div
            className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/55 via-black/25 to-black/45"
            aria-hidden="true"
          />

          <div
            className="relative z-20 flex h-full w-full flex-col justify-between px-6 pt-24 pb-8 sm:px-10 sm:pt-28 sm:pb-10 md:px-16"
            style={{
              transform: "translateY(calc(var(--cover, 0) * -32px))",
              opacity: "calc(1 - var(--cover, 0) * 0.9)",
            }}
          >
            <div className="flex flex-1 items-center">
              <div className="animate-hero-from-left w-full">
                <HeroContent layout="stacked" onOpenFilm={() => setIsFilmOpen(true)} />
              </div>
            </div>

            <div className="flex w-full items-end justify-end">
              <ScrollIndicator />
            </div>
          </div>
        </div>

        {/* Darkens the pinned hero as the next section slides over it */}
        <div
          className="pointer-events-none absolute inset-0 z-40 bg-[#0a0908]"
          style={{ opacity: "calc(var(--cover, 0) * 0.85)" }}
          aria-hidden="true"
        />
      </section>

      {/* Cinema modal lives outside the sticky section so its stacking context can't be covered by Editorial */}
      <FilmModal isOpen={isFilmOpen} onClose={() => setIsFilmOpen(false)} />
    </>
  );
};
