"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { DreamContent } from "@/components/dream/DreamContent";
import { SlideIn } from "@/components/common/SlideIn";
import { DreamCard } from "@/components/dream/DreamCard";
import { DreamParticles } from "@/components/dream/DreamParticles";
import { useParallax } from "@/hooks/use-parallax";

export const DreamSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const textParallaxRef = useParallax<HTMLDivElement>(0.03, 22);
  const card1ParallaxRef = useParallax<HTMLDivElement>(0.07, 36);
  const card2ParallaxRef = useParallax<HTMLDivElement>(0.12, 56);

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

  return (
    <section
      ref={sectionRef}
      id="dream"
      className="relative z-10 -mt-1.5 w-full bg-[#0a0908] text-white select-none sm:-mt-2 md:-mt-3.5 lg:-mt-5 xl:-mt-6"
    >
      {/* ========================================================
          1. DESKTOP EDITORIAL LAYOUT (lg: 1024px+)
          Uses natural image in document flow:
          - Zero distortion, zero unnatural cropping
          - Natural aspect ratio of IMAGE 1 (2048 x 822)
          - Left editorial text, center woman, right 2 vertical cards
          - Overlapped by previous parchment section (z-index: 10 vs 20)
          ======================================================== */}
      <div className="relative hidden w-full overflow-hidden lg:block">
        {/* Exact background asset (IMAGE 1) in normal flow, waking up out of the haze */}
        <div className={inView ? "animate-dream-wake" : "opacity-0"}>
          <Image
            src="/images/dream-bg.png"
            alt="Maison D'Vine The Dream Collection"
            width={2048}
            height={822}
            loading="lazy"
            unoptimized
            className="pointer-events-none block h-auto w-full select-none"
          />
        </div>

        {/* Dream haze that lifts as the scene comes into focus */}
        {inView && (
          <div
            className="animate-dream-mist pointer-events-none absolute inset-0 z-[5]"
            style={{
              background:
                "radial-gradient(60% 80% at 30% 60%, rgba(245, 232, 210, 0.5), transparent 70%), radial-gradient(50% 70% at 75% 35%, rgba(230, 201, 143, 0.35), transparent 70%)",
            }}
            aria-hidden="true"
          />
        )}

        {/* Occasional shooting star */}
        {inView && (
          <span
            className="animate-dream-shooting pointer-events-none absolute top-[12%] right-[24%] z-[15] h-px w-[150px] bg-gradient-to-r from-transparent via-white/60 to-white"
            aria-hidden="true"
          />
        )}

        {/* Celestial Star Dust Particles */}
        <DreamParticles />

        {/* Subtle atmospheric vignette on the far left to ensure crisp text contrast */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(90deg, rgba(10, 9, 8, 0.75) 0%, rgba(10, 9, 8, 0.45) 24%, rgba(10, 9, 8, 0.08) 42%, rgba(10, 9, 8, 0) 55%)",
          }}
          aria-hidden="true"
        />

        {/* Content layer positioned proportionally over the background matching IMAGE 2 */}
        <div className="pointer-events-auto absolute inset-0 z-20">
          {/* Left Column: Eyebrow, Heading, Subtitle, Description, CTA */}
          <div ref={textParallaxRef} className="absolute top-[22%] bottom-[7.5%] left-[8.5%] z-20 flex w-[31%] max-w-[460px] flex-col justify-between">
            <SlideIn from="left" distance="10vw">
              <DreamContent inView={inView} />
            </SlideIn>
          </div>

          {/* Right Area: Exactly Two Editorial Portrait Cards with Staggered Viewport Reveal */}
          {/* Card 1: THE DAYDREAM (Ivory floral gown) */}
          <div ref={card1ParallaxRef} className="absolute top-[22%] bottom-[7.5%] left-[65%] z-20 w-[14.5%] will-change-transform">
            <SlideIn from="right" distance="16vw" delay={0} rotate={5} className="h-full w-full">
              <DreamCard
                titleLines={["THE", "DAYDREAM"]}
                descriptionLines={["Light as a thought,", "bold as a beginning."]}
                imageSrc="/images/daydream.webp"
                imageAlt="Maison D'Vine The Daydream Ivory Floral Gown"
                className="h-full w-full"
                inView={inView}
                delayMs={220}
              />
            </SlideIn>
          </div>

          {/* Card 2: THE AWAKENING (Black gown) */}
          <div ref={card2ParallaxRef} className="absolute top-[22%] bottom-[7.5%] left-[81.5%] z-20 w-[14.5%] will-change-transform">
            <SlideIn from="right" distance="26vw" delay={180} rotate={7} className="h-full w-full">
              <DreamCard
                titleLines={["THE", "AWAKENING"]}
                descriptionLines={["For the girl who", "chose herself."]}
                imageSrc="/images/awakening.webp"
                imageAlt="Maison D'Vine The Awakening Noir Silk Gown"
                className="h-full w-full"
                inView={inView}
                delayMs={400}
              />
            </SlideIn>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. MOBILE & TABLET LAYOUT (< 1024px)
          Adaptive editorial presentation:
          - Keeps cinematic background centered on the woman
          - Editorial typography stacked with luxury breathing room
          - Two portrait cards displayed side-by-side or stacked
          ======================================================== */}
      <div className="relative block w-full overflow-hidden bg-[#0c0b0a] px-6 py-20 sm:px-10 sm:py-24 lg:hidden">
        {/* Background photo anchored to keep the woman visible */}
        <div className={`absolute inset-0 z-0 ${inView ? "animate-dream-wake" : "opacity-0"}`}>
          <Image
            src="/images/dream-bg.png"
            alt="Maison D'Vine The Dream Collection"
            fill
            loading="lazy"
            unoptimized
            sizes="100vw"
            className="pointer-events-none object-cover object-[48%_center] opacity-35"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0908]/90 via-[#0a0908]/70 to-[#0a0908]/95"
            aria-hidden="true"
          />
        </div>

        {/* Celestial Star Particles on Mobile */}
        <DreamParticles />

        {/* Content Container */}
        <div className="relative z-10 mx-auto flex max-w-2xl flex-col space-y-12">
          {/* Left Editorial Content */}
          <DreamContent inView={inView} />

          {/* Two Editorial Cards */}
          <div className="grid grid-cols-1 gap-6 pt-4 sm:grid-cols-2">
            <DreamCard
              titleLines={["THE", "DAYDREAM"]}
              descriptionLines={["Light as a thought,", "bold as a beginning."]}
              imageSrc="/images/daydream.webp"
              imageAlt="Maison D'Vine The Daydream Ivory Floral Gown"
              className="aspect-[10/16] min-h-[380px] w-full"
              inView={inView}
              delayMs={200}
            />
            <DreamCard
              titleLines={["THE", "AWAKENING"]}
              descriptionLines={["For the girl who", "chose herself."]}
              imageSrc="/images/awakening.webp"
              imageAlt="Maison D'Vine The Awakening Noir Silk Gown"
              className="aspect-[10/16] min-h-[380px] w-full"
              inView={inView}
              delayMs={350}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
