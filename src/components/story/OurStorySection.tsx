"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { OurStoryMobile } from "@/components/story/OurStoryMobile";

export const OurStorySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

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
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="our-story"
      aria-label="Our Story - The Atelier"
      className="relative z-20 w-full select-none bg-[#0e0d0c] -mt-[22vw] md:-mt-16 lg:-mt-22 xl:-mt-28"
    >
      {/* Anchor for About navigation */}
      <div id="about" className="absolute -top-24 left-0 pointer-events-none" />

      {/* ========================================================
          1. DESKTOP & TABLET VIEW (md: 768px+)
          - Direct load of /images/ourStroy.webp (1713 x 918)
          - Natural aspect ratio and 100% full resolution
          - Underlaps beneath IndiaSection (z-20 under z-30 with negative top margin)
          - Center editorial column: OUR STORY, From a Feeling to a Maison., paragraphs, READ FURTHER → button
          - Left handwritten note: "Built on stories. for her."
          - Right handwritten note: "More than a brand. a journey."
          ======================================================== */}
      <div className="relative hidden w-full overflow-hidden md:block">
        {/* Full-width High-Quality Base Atelier Photo */}
        <Image
          src="/images/ourStroy.webp"
          alt="Maison D'Vine - Our Story Atelier"
          width={1713}
          height={918}
          quality={100}
          unoptimized
          priority
          className="pointer-events-none block h-auto w-full select-none"
          style={{
            width: "100%",
            height: "auto",
          }}
        />

        {/* Content Overlay Layer */}
        <div className="pointer-events-auto absolute inset-0 z-20">
          {/* Transparent Blackish Atmospheric Vignette behind Right-Side Text */}
          <div
            className="pointer-events-none absolute top-0 bottom-0 left-[40%] right-[10%] z-10 opacity-90"
            style={{
              background:
                "radial-gradient(ellipse at 42% 44%, rgba(6, 5, 4, 0.75) 0%, rgba(8, 7, 6, 0.48) 55%, transparent 78%)",
            }}
          />

          {/* Left Handwritten Script Note on Desk Paper Box */}
          <div
            className={`absolute top-[48%] left-[6.2%] z-20 w-[14%] max-w-[190px] transition-all duration-[1400ms] delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[8vw]"
            }`}
          >
            <p className="font-allura allura-regular font-script font-cursive text-2xl sm:text-3xl md:text-[1.8vw] lg:text-[2.05vw] leading-[1.12] text-[#34271c] -rotate-[7deg] origin-top-left select-none tracking-wide drop-shadow-[0_1px_1px_rgba(255,255,255,0.25)]">
              Built on
              <br />
              stories.
              <br />
              for her.
            </p>
          </div>

          {/* Center Editorial Content Block: Eyebrow + Heading + Paragraphs + Button */}
          <div
            className={`absolute top-[16.5%] left-[48.2%] z-20 flex w-[35.5%] max-w-[490px] flex-col text-left transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[10vw]"
            }`}
          >
            {/* Local soft radial dark glow directly behind the text block */}
            <div
              className="pointer-events-none absolute -inset-6 sm:-inset-8 md:-inset-10 -z-10 rounded-2xl"
              style={{
                background:
                  "radial-gradient(ellipse at 45% 45%, rgba(6, 5, 4, 0.82) 0%, rgba(8, 7, 6, 0.58) 50%, rgba(10, 8, 7, 0.25) 75%, transparent 100%)",
              }}
            />

            {/* Eyebrow / Subheading */}
            <span className="font-sans text-[11px] sm:text-[12px] md:text-[0.78vw] lg:text-[0.82vw] font-medium tracking-[0.26em] text-[#d6cdc2] uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              OUR STORY
            </span>

            {/* Main Heading */}
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl md:text-[3.1vw] lg:text-[3.4vw] font-normal leading-[1.08] tracking-[0.01em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              From a Feeling
              <br />
              to a Maison.
            </h2>

            {/* Paragraphs */}
            <div className="mt-4 sm:mt-5 space-y-3 font-sans text-xs sm:text-[13px] md:text-[0.9vw] lg:text-[0.93vw] leading-[1.66] text-[#e8e1d7] tracking-[0.01em] max-w-[430px] drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
              <p>
                Maison D&apos;Vine was born from a simple belief &mdash; that every woman carries a story, and what she wears should feel like a part of it.
              </p>
              <p>
                What started as a personal journey has now become a space for stories, emotions and beautifully crafted dresses.
              </p>
            </div>

            {/* Button: READ FURTHER → */}
            <div className="mt-6 sm:mt-7">
              <button
                type="button"
                className="group inline-flex items-center gap-3 bg-[#fdfcfb] px-6 sm:px-7 py-2.5 sm:py-3 text-[11px] sm:text-xs md:text-[0.76vw] font-sans font-medium tracking-[0.2em] text-[#191512] uppercase shadow-[0_4px_16px_rgba(0,0,0,0.35)] transition-all duration-300 hover:bg-[#f2ece2] hover:scale-[1.02] active:scale-[0.99] cursor-pointer"
              >
                <span>READ FURTHER</span>
                <span className="text-xs transition-transform duration-300 group-hover:translate-x-1">
                  &rarr;
                </span>
              </button>
            </div>
          </div>

          {/* Right Handwritten Script Note near Gown */}
          <div
            className={`absolute top-[49%] right-[4.5%] z-20 w-[18%] max-w-[230px] transition-all duration-[1400ms] delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[10vw]"
            }`}
          >
            <p className="font-allura allura-regular font-script font-cursive text-3xl sm:text-4xl md:text-[2.2vw] lg:text-[2.5vw] leading-[1.12] text-[#f2e9dc]/90 -rotate-[6deg] origin-center select-none tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
              More than
              <br />
              a brand.
              <br />
              a journey.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. MOBILE VIEW (< 768px)
          - Full-bleed atelier photo (/images/ourstroy-mobile.webp) with flickering lamp,
            dust, a scroll-drawn gold thread, masked headline and handwritten notes
          ======================================================== */}
      <div className="md:hidden">
        <OurStoryMobile play={inView} />
      </div>
    </section>
  );
};
