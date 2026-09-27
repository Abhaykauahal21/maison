"use client";

import React from "react";
import Image from "next/image";
import { DreamContent } from "@/components/dream/DreamContent";
import { DreamCard } from "@/components/dream/DreamCard";

export const DreamSection: React.FC = () => {
  return (
    <section
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
        {/* Exact background asset (IMAGE 1) in normal flow */}
        <Image
          src="/images/dream-bg.png"
          alt="Maison D'Vine The Dream Collection"
          width={2048}
          height={822}
          priority
          unoptimized
          className="pointer-events-none block h-auto w-full select-none"
        />

        {/* Subtle atmospheric vignette on the far left to ensure crisp text contrast */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(90deg, rgba(10, 9, 8, 0.70) 0%, rgba(10, 9, 8, 0.40) 24%, rgba(10, 9, 8, 0.05) 42%, rgba(10, 9, 8, 0) 55%)",
          }}
          aria-hidden="true"
        />

        {/* Content layer positioned proportionally over the background matching IMAGE 2 */}
        <div className="pointer-events-auto absolute inset-0 z-20">
          {/* Left Column: Eyebrow, Heading, Subtitle, Description, CTA */}
          <div className="absolute top-[23%] bottom-[11%] left-[9.9%] z-20 flex w-[23.5%] flex-col justify-between">
            <DreamContent />
          </div>

          {/* Right Area: Exactly Two Editorial Portrait Cards matching IMAGE 2 */}
          {/* Card 1: THE DAYDREAM (Ivory floral gown) */}
          <div className="absolute top-[20%] bottom-[2.5%] left-[62%] z-20 w-[16.1%]">
            <DreamCard
              titleLines={["THE", "DAYDREAM"]}
              descriptionLines={["Light as a thought,", "bold as a beginning."]}
              imageSrc="/images/daydream.webp"
              imageAlt="Maison D'Vine The Daydream Ivory Floral Gown"
              className="h-full w-full"
            />
          </div>

          {/* Card 2: THE AWAKENING (Black gown) */}
          <div className="absolute top-[20%] bottom-[2.5%] left-[79.7%] z-20 w-[15.7%]">
            <DreamCard
              titleLines={["THE", "AWAKENING"]}
              descriptionLines={["For the girl who", "chose herself."]}
              imageSrc="/images/awakening.webp"
              imageAlt="Maison D'Vine The Awakening Noir Silk Gown"
              className="h-full w-full"
            />
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
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/dream-bg.png"
            alt="Maison D'Vine The Dream Collection"
            fill
            unoptimized
            sizes="100vw"
            className="pointer-events-none object-cover object-[48%_center] opacity-35"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0908]/90 via-[#0a0908]/70 to-[#0a0908]/95"
            aria-hidden="true"
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 mx-auto flex max-w-2xl flex-col space-y-12">
          {/* Left Editorial Content */}
          <DreamContent />

          {/* Two Editorial Cards */}
          <div className="grid grid-cols-1 gap-6 pt-4 sm:grid-cols-2">
            <DreamCard
              titleLines={["THE", "DAYDREAM"]}
              descriptionLines={["Light as a thought,", "bold as a beginning."]}
              imageSrc="/images/daydream.webp"
              imageAlt="Maison D'Vine The Daydream Ivory Floral Gown"
              className="aspect-[10/16] min-h-[380px] w-full"
            />
            <DreamCard
              titleLines={["THE", "AWAKENING"]}
              descriptionLines={["For the girl who", "chose herself."]}
              imageSrc="/images/awakening.webp"
              imageAlt="Maison D'Vine The Awakening Noir Silk Gown"
              className="aspect-[10/16] min-h-[380px] w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
