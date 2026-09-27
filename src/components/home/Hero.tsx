"use client";

import React from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { HeroContent } from "@/components/home/HeroContent";
import { ScrollIndicator } from "@/components/home/ScrollIndicator";

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full bg-[#0e0d0c] select-none">
      {/* ========================================================
          1. DESKTOP & TABLET (md: 768px+)
          Uses natural image in document flow:
          - Zero distortion, exact composition
          - Left editorial text positioned at 6.8vw, middle-lower section
          - Models in center/right remain dominant & un-obscured
          - Subtle warm left-to-right contrast overlay
          ======================================================== */}
      <div className="relative hidden w-full overflow-hidden md:block">
        {/* Full un-cropped hero image preserving complete bottom transition area */}
        <Image
          src="/images/hero.webp"
          alt="Maison D'Vine Haute Couture Collection"
          width={2048}
          height={1066}
          priority
          unoptimized
          className="pointer-events-none block h-auto w-full select-none"
        />

        {/* Subtle cinematic left-to-right contrast overlay matching IMAGE 1 */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: `
              linear-gradient(90deg, rgba(8, 7, 6, 0.42) 0%, rgba(8, 7, 6, 0.20) 28%, rgba(8, 7, 6, 0.04) 48%, transparent 65%),
              linear-gradient(180deg, rgba(8, 7, 6, 0.35) 0%, transparent 15%, transparent 85%, rgba(8, 7, 6, 0.2) 100%)
            `,
          }}
          aria-hidden="true"
        />

        {/* Floating Navbar */}
        <Navbar />

        {/* Main Content Layout Overlay */}
        <div className="pointer-events-none absolute inset-0 z-20 w-full">
          {/* Left Editorial Content - Positioned matching IMAGE 1 at left ~6.8vw, middle-lower section */}
          <div className="pointer-events-auto absolute top-[30%] left-[6.8vw] z-20 w-[38%] max-w-[460px]">
            <HeroContent />
          </div>

          {/* Bottom Right Area: Scroll Indicator */}
          <div className="pointer-events-auto absolute right-[4.5vw] bottom-[4%] z-20">
            <ScrollIndicator />
          </div>
        </div>
      </div>

      {/* ========================================================
          2. MOBILE (< 768px)
          Vertical screen adaptation anchored at bottom
          ======================================================== */}
      <div className="relative block h-[100dvh] min-h-[640px] w-full overflow-hidden md:hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero.webp"
            alt="Maison D'Vine Haute Couture Collection"
            fill
            priority
            unoptimized
            className="pointer-events-none object-cover object-bottom"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-black/20 to-black/40"
          aria-hidden="true"
        />

        <Navbar />

        <div className="relative z-20 flex h-full w-full flex-col justify-between px-6 pt-24 pb-8">
          <div className="flex flex-1 items-center">
            <div className="w-full">
              <HeroContent />
            </div>
          </div>

          <div className="flex w-full items-end justify-end">
            <ScrollIndicator />
          </div>
        </div>
      </div>
    </section>
  );
};
