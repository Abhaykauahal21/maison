"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { HeroContent } from "@/components/home/HeroContent";
import { ScrollIndicator } from "@/components/home/ScrollIndicator";
import { HeroParticles } from "@/components/home/HeroParticles";
import { FilmModal } from "@/components/home/FilmModal";

export const Hero: React.FC = () => {
  const [isFilmOpen, setIsFilmOpen] = useState(false);
  const desktopContainerRef = useRef<HTMLDivElement | null>(null);

  // Smooth mouse coordinates for subtle parallax & interactive spotlight
  const [mousePos, setMousePos] = useState({
    xPercent: 50,
    yPercent: 40,
    tiltX: 0,
    tiltY: 0,
    isHovered: false,
  });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = desktopContainerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    // Tilt range: -1 to 1
    const tiltX = (x / rect.width - 0.5) * 2;
    const tiltY = (y / rect.height - 0.5) * 2;

    setMousePos({
      xPercent,
      yPercent,
      tiltX,
      tiltY,
      isHovered: true,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos((prev) => ({
      ...prev,
      tiltX: 0,
      tiltY: 0,
      isHovered: false,
    }));
  }, []);

  return (
    <section className="relative w-full bg-[#0e0d0c] select-none">
      {/* ========================================================
          1. DESKTOP & TABLET (md: 768px+)
          Uses natural image in document flow:
          - Zero distortion, exact composition
          - Left editorial text positioned at 6.8vw, middle-lower section
          - Models in center/right remain dominant & un-obscured
          - Subtle warm left-to-right contrast overlay
          - Dynamic interactive spotlight & smooth 3D parallax
          - Floating golden couture dust particles
          ======================================================== */}
      <div
        ref={desktopContainerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative hidden w-full overflow-hidden md:block"
      >
        {/* Full un-cropped hero image with subtle entrance zoom & mouse parallax */}
        <div
          className="relative w-full will-change-transform"
          style={{
            transform: `perspective(1200px) scale(${mousePos.isHovered ? 1.025 : 1.01}) translate3d(${
              mousePos.tiltX * -8
            }px, ${mousePos.tiltY * -6}px, 0)`,
            transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <Image
            src="/images/hero.webp"
            alt="Maison D'Vine Haute Couture Collection"
            width={2048}
            height={1066}
            priority
            unoptimized
            className="pointer-events-none block h-auto w-full select-none animate-ken-burns"
          />
        </div>

        {/* Ambient floating golden couture light particles */}
        <HeroParticles />

        {/* Interactive Mouse Spotlight Light Ray */}
        <div
          className="pointer-events-none absolute inset-0 z-12 transition-opacity duration-700"
          style={{
            opacity: mousePos.isHovered ? 1 : 0.6,
            background: `radial-gradient(750px circle at ${mousePos.xPercent}% ${mousePos.yPercent}%, rgba(235, 205, 150, 0.08) 0%, rgba(235, 205, 150, 0.02) 45%, transparent 75%)`,
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

        {/* Floating Navbar */}
        <Navbar />

        {/* Main Content Layout Overlay */}
        <div className="pointer-events-none absolute inset-0 z-20 w-full">
          {/* Left Editorial Content - Positioned higher to ensure zero overlap with lower sections */}
          <div
            className="pointer-events-auto absolute top-[16%] md:top-[17%] lg:top-[18%] xl:top-[19%] left-[6.8vw] z-20 w-[42%] max-w-[460px] will-change-transform"
            style={{
              transform: `translate3d(${mousePos.tiltX * 12}px, ${mousePos.tiltY * 8}px, 0)`,
              transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <HeroContent onOpenFilm={() => setIsFilmOpen(true)} />
          </div>

          {/* Bottom Right Area: Scroll Indicator */}
          <div className="pointer-events-auto absolute right-[4.5vw] bottom-[4%] z-20">
            <ScrollIndicator />
          </div>
        </div>
      </div>

      {/* ========================================================
          2. MOBILE (< 768px)
          Vertical screen adaptation anchored comfortably above fold
          ======================================================== */}
      <div className="relative block h-[100dvh] min-h-[640px] w-full overflow-hidden md:hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero.webp"
            alt="Maison D'Vine Haute Couture Collection"
            fill
            priority
            unoptimized
            className="pointer-events-none object-cover object-bottom animate-ken-burns"
          />
        </div>

        {/* Floating golden particles on mobile */}
        <HeroParticles />

        <div
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/55 via-black/25 to-black/45"
          aria-hidden="true"
        />

        <Navbar />

        <div className="relative z-20 flex h-full w-full flex-col justify-between px-6 pt-20 pb-16">
          <div className="flex flex-1 items-start pt-3 sm:pt-6">
            <div className="w-full">
              <HeroContent onOpenFilm={() => setIsFilmOpen(true)} />
            </div>
          </div>

          <div className="flex w-full items-end justify-end">
            <ScrollIndicator />
          </div>
        </div>
      </div>

      {/* Cinema / Watch The Film Interactive Modal */}
      <FilmModal isOpen={isFilmOpen} onClose={() => setIsFilmOpen(false)} />
    </section>
  );
};
