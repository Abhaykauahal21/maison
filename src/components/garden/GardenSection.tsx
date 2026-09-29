"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { GardenParticles } from "@/components/garden/GardenParticles";

export interface TestimonialItem {
  id: string;
  quote: string;
  body: string;
  author: string;
  location: string;
  rating: number;
  leftNoteLines: string[];
  rightNoteLines: string[];
}

export const initialTestimonials: TestimonialItem[] = [
  {
    id: "ritika",
    quote:
      "It felt like the dress understood a part of me I had never been able to put into words.”",
    body: "Not just a piece of clothing, but a feeling I carry with me. Maison D'Vine doesn't just create dresses, they create moments.",
    author: "RITIKA M.",
    location: "Noida",
    rating: 5,
    leftNoteLines: ["Confidence", "feels different", "now."],
    rightNoteLines: ["A story", "I'll always", "wear."],
  },
  {
    id: "ananya",
    quote:
      "When I wore it, I wasn't just walking into a room — I was walking into who I truly am.”",
    body: "The delicate drape and silent elegance made me stand taller. It felt like poetry tailored purely for me.",
    author: "ANANYA S.",
    location: "Mumbai",
    rating: 5,
    leftNoteLines: ["Grace in", "every fold.", "Always."],
    rightNoteLines: ["Quiet", "dreams in", "motion."],
  },
  {
    id: "meera",
    quote:
      "There is an unspoken grace in every seam. I have never felt so completely myself.”",
    body: "From the fabric to the silhouette, everything breathed quiet luxury. A memory woven forever.",
    author: "MEERA K.",
    location: "Delhi",
    rating: 5,
    leftNoteLines: ["A feeling", "you always", "remember."],
    rightNoteLines: ["Pure", "timeless", "art."],
  },
];

export interface GardenSectionProps {
  testimonials?: TestimonialItem[];
}

export const GardenSection: React.FC<GardenSectionProps> = ({
  testimonials = initialTestimonials,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
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

  const nextTestimonial = useCallback(() => {
    changeTestimonial("next");
  }, [changeTestimonial]);

  const prevTestimonial = useCallback(() => {
    changeTestimonial("prev");
  }, [changeTestimonial]);

  const current = testimonials[currentIndex] || testimonials[0];

  return (
    <section
      ref={sectionRef}
      id="whispers"
      className="relative z-10 -mt-6 sm:-mt-8 md:-mt-12 lg:-mt-16 xl:-mt-20 w-full bg-[#0a0806] text-[#1c1815] select-none"
    >
      {/* ========================================================
          1. DESKTOP & TABLET LAYOUT (md: 768px+)
          Full 100vh Viewport High-Fidelity Implementation:
          - Direct load of /public/images/garden-scrapbook.webp (2048 x 1152)
          - Parent container: position: relative; width: 100%; height: 100vh; overflow: hidden;
          - Next/Image: fill, priority, quality={100}, sizes="100vw", objectFit: "cover", objectPosition: "center right"
          - Zero downscaling, zero blur filters, pixel-for-pixel visual fidelity
          ======================================================== */}
      <div
        className="relative hidden md:block w-full overflow-hidden"
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Full width high-resolution 2048x1152 background scrapbook asset */}
        <Image
          src="/images/garden-scrapbook-hd.webp"
          unoptimized
          alt="Garden scrapbook editorial"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="pointer-events-none select-none"
          style={{
            objectFit: "cover",
            objectPosition: "center right",
          }}
        />

        {/* Cinematic dark gradient on left side ensuring white typography remains 100% readable */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(90deg, rgba(8, 7, 6, 0.76) 0%, rgba(8, 7, 6, 0.48) 22%, rgba(8, 7, 6, 0.15) 36%, transparent 50%)",
          }}
          aria-hidden="true"
        />

        {/* Floating Atelier Sunlit Golden Pollen Particles */}
        <GardenParticles />

        {/* Content layer positioned precisely matching reference screenshot */}
        <div className="pointer-events-auto absolute inset-0 z-20">
          {/* ----------------------------------------------------
              A. Left Column: THE WHISPERS, Heading, Description, Buttons
              Occupies approx 30–35% of the viewport width
              ---------------------------------------------------- */}
          <div
            className={`absolute top-[38%] sm:top-[39%] lg:top-[39.5%] left-[3%] z-20 flex w-[33%] max-w-[460px] flex-col text-left transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[9vw]"
            }`}
          >
            {/* Eyebrow */}
            <div className="font-sans text-xs sm:text-[13px] md:text-[0.95vw] font-medium tracking-[0.32em] text-[#e8dfd4] uppercase">
              THE WHISPERS
            </div>

            {/* Main Heading */}
            <div className="mt-2.5 overflow-hidden">
              <h2 className="font-serif text-5xl sm:text-6xl md:text-[4.2vw] lg:text-[4.5vw] xl:text-[4.7vw] font-normal leading-[0.98] tracking-[0.01em] text-white">
                Real Stories.
                <br />
                Real Women.
              </h2>
            </div>

            {/* Description - 4 clean lines */}
            <p className="mt-4 sm:mt-4.5 font-sans text-sm sm:text-[15px] md:text-[1.05vw] leading-[1.62] text-[#ded6cb] tracking-[0.01em] max-w-[285px]">
              Every dress carries a feeling. Here are the women who made them a part of their story.
            </p>

            {/* Circular Interactive Navigation Buttons */}
            <div className="mt-6 sm:mt-8 flex items-center gap-4">
              <button
                type="button"
                onClick={prevTestimonial}
                disabled={isTransitioning}
                className="group flex h-11 w-11 sm:h-12 sm:w-12 md:h-[3.2vw] md:w-[3.2vw] max-h-14 max-w-14 items-center justify-center rounded-full border border-white/50 bg-black/35 text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xl"
                aria-label="Previous testimonial"
              >
                <span className="text-base sm:text-lg md:text-xl transition-transform duration-300 group-hover:-translate-x-0.5">
                  ←
                </span>
              </button>
              <button
                type="button"
                onClick={nextTestimonial}
                disabled={isTransitioning}
                className="group flex h-11 w-11 sm:h-12 sm:w-12 md:h-[3.2vw] md:w-[3.2vw] max-h-14 max-w-14 items-center justify-center rounded-full border border-white/50 bg-black/35 text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xl"
                aria-label="Next testimonial"
              >
                <span className="text-base sm:text-lg md:text-xl transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </button>
            </div>
          </div>

          {/* ----------------------------------------------------
              B. Central Large Parchment Sheet: Interactive Testimonial
              Pixel-perfect match to Reference Image 2:
              - Upper-left curly quotation mark “
              - Headline quote in 3 balanced lines with editorial serif typography
              - Indented supporting reflection text (3 lines, italic)
              - Customer name with dash, location, and 5 gold stars aligned
              - Compact, harmonious vertical rhythm eliminating the empty void
              ---------------------------------------------------- */}
          <div
            className={`absolute top-[40.2%] left-[55.7%] z-20 flex w-[24%] max-w-[360px] flex-col text-left transition-all duration-[1400ms] delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[9vw]"
            }`}
          >
            {/* Dynamic Testimonial Content with Smooth Editorial Transitions */}
            <div
              key={currentIndex}
              className={`flex flex-col transition-all duration-200 ease-out ${
                isTransitioning
                  ? direction === "next"
                    ? "opacity-0 -translate-x-4 blur-[3px]"
                    : "opacity-0 translate-x-4 blur-[3px]"
                  : direction === "next"
                    ? "animate-testimonial-next"
                    : "animate-testimonial-prev"
              }`}
            >
              {/* Upper Section: Left Quotation Mark + 3-line Headline Quote */}
              <div className="flex items-start gap-2.5 sm:gap-3 md:gap-3.5">
                <span className="font-serif text-3xl sm:text-4xl md:text-[2.5vw] lg:text-[2.8vw] font-bold leading-none text-[#16120e] select-none shrink-0 -mt-1 sm:-mt-1.5 md:-mt-2">
                  “
                </span>
                <div className="flex flex-col">
                  {/* Headline Quote (3 lines, editorial serif, enlarged) */}
                  <h3 className="font-serif text-sm sm:text-[15px] md:text-[1.12vw] lg:text-[1.18vw] font-normal leading-[1.32] text-[#16120e] tracking-normal">
                    {current.quote}
                  </h3>

                  {/* Secondary Reflection Body Quote (3 lines, italic, enlarged) */}
                  <p className="mt-2.5 sm:mt-3 md:mt-3.5 font-serif italic text-[10.5px] sm:text-[11.5px] md:text-[0.82vw] lg:text-[0.86vw] leading-[1.5] text-[#46392e] tracking-normal max-w-[335px]">
                    {current.body}
                  </p>

                  {/* Customer Information & Rating */}
                  <div className="mt-3.5 sm:mt-4 md:mt-4.5 flex flex-col pl-4 sm:pl-5 md:pl-[1.4vw] lg:pl-[1.6vw]">
                    <div className="flex items-baseline gap-1.5 font-serif text-[10px] sm:text-[11px] md:text-[0.82vw] lg:text-[0.86vw] font-medium tracking-[0.16em] text-[#1c1815] uppercase">
                      <span className="text-[#3a3027] font-normal select-none">—</span>
                      <span>{current.author}</span>
                    </div>
                    <div className="mt-0.5 pl-3.5 sm:pl-4 md:pl-[1.1vw] font-serif text-[9px] sm:text-[10px] md:text-[0.7vw] lg:text-[0.74vw] tracking-wider text-[#635344]">
                      {current.location}
                    </div>

                    {/* 5 Golden Stars */}
                    <div className="mt-2 pl-3.5 sm:pl-4 md:pl-[1.1vw] flex items-center gap-1 text-[#df9b2d] text-sm sm:text-[15px] md:text-[0.98vw] lg:text-[1.04vw] leading-none">
                      {Array.from({ length: current.rating }).map((_, i) => (
                        <span key={i} className="inline-block select-none">
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------
              C. Left Note over Left Model Photo: "Confidence feels different now."
              (Centered on Left Note: X ~36.2%, Y ~61.5%)
              ---------------------------------------------------- */}
          <div
            className={`pointer-events-none absolute top-[61.5%] left-[36.2%] z-20 flex w-[12.5%] max-w-[190px] flex-col items-center justify-center -rotate-[4.5deg] text-center p-1 transition-all duration-[1400ms] delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              inView ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-90 -translate-x-[6vw]"
            }`}
          >
            <div
              key={currentIndex}
              className={`allura-regular font-allura text-base sm:text-lg md:text-[1.65vw] lg:text-[1.85vw] xl:text-[2.0vw] leading-[1.16] text-[#22180f] select-none transition-all duration-200 ease-out ${
                isTransitioning ? "opacity-0 scale-95 blur-[2px]" : "animate-note-ink"
              }`}
            >
              {current.leftNoteLines.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>

          {/* ----------------------------------------------------
              D. Right Note over Right Model Photo: "A story I'll always wear."
              (Centered on Right Note: X ~84.2%, Y ~61.5%)
              ---------------------------------------------------- */}
          <div
            className={`pointer-events-none absolute top-[61.5%] left-[84.2%] z-20 flex w-[12.5%] max-w-[190px] flex-col items-center justify-center rotate-[2.5deg] text-center p-1 transition-all duration-[1400ms] delay-450 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              inView ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-90 translate-x-[6vw]"
            }`}
          >
            <div
              key={currentIndex}
              className={`allura-regular font-allura text-base sm:text-lg md:text-[1.65vw] lg:text-[1.85vw] xl:text-[2.0vw] leading-[1.16] text-[#22180f] select-none transition-all duration-200 ease-out ${
                isTransitioning ? "opacity-0 scale-95 blur-[2px]" : "animate-note-ink"
              }`}
            >
              {current.rightNoteLines.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. MOBILE EDITORIAL LAYOUT (< 768px)
          Seamless intelligent mobile presentation matching the aesthetic
          ======================================================== */}
      <div className="relative block w-full overflow-hidden md:hidden">
        <div className="relative w-full">
          <Image
            src="/images/garden-scrapbook-hd.webp"
            alt="Garden scrapbook editorial"
            width={2048}
            height={1152}
            priority
            quality={100}
            sizes="100vw"
            className="pointer-events-none block h-auto w-full object-cover select-none"
          />

          {/* Mobile Overlay Card */}
          <div className="pointer-events-auto absolute inset-0 z-20 flex flex-col justify-between p-6 pt-10 pb-8 bg-gradient-to-t from-black/95 via-black/60 to-black/35 text-white text-left">
            <div>
              <div className="font-sans text-[10px] font-medium tracking-[0.25em] text-[#d4cbbf] uppercase">
                THE WHISPERS
              </div>
              <h2 className="mt-1 font-serif text-2xl xs:text-3xl font-normal leading-tight text-white">
                Real Stories.
                <br />
                Real Women.
              </h2>
              <p className="mt-2 font-sans text-xs text-[#d5cbbe] leading-relaxed max-w-[320px]">
                Every dress carries a feeling. Here are the women who made them a part of their
                story.
              </p>
            </div>

            {/* Testimonial Box matching Image 2 visual hierarchy */}
            <div
              key={currentIndex}
              className={`my-3 p-4 sm:p-5 bg-[#fbf6ee]/95 text-[#1c1815] rounded-[2px] shadow-xl transition-all duration-200 ease-out ${
                isTransitioning
                  ? direction === "next"
                    ? "opacity-0 -translate-x-3 blur-[2px]"
                    : "opacity-0 translate-x-3 blur-[2px]"
                  : direction === "next"
                    ? "animate-testimonial-next"
                    : "animate-testimonial-prev"
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="font-serif text-2xl font-bold leading-none text-[#16120e] shrink-0 -mt-0.5 select-none">
                  “
                </span>
                <div className="flex flex-col">
                  <h3 className="font-serif text-xs sm:text-[13px] font-normal leading-snug text-[#16120e]">
                    {current.quote}
                  </h3>
                  <p className="mt-2 font-serif italic text-[10px] sm:text-[10.5px] leading-relaxed text-[#46392e]">
                    {current.body}
                  </p>
                  <div className="mt-3 flex flex-col">
                    <div className="flex items-baseline gap-1 font-serif text-[9.5px] sm:text-[10px] font-medium tracking-wider text-[#1c1815] uppercase">
                      <span>—</span>
                      <span>{current.author}</span>
                    </div>
                    <div className="mt-0.5 pl-3 font-serif text-[8.5px] sm:text-[9px] tracking-wide text-[#635344]">
                      {current.location}
                    </div>
                    <div className="mt-1.5 pl-3 flex items-center gap-0.5 text-[#df9b2d] text-xs leading-none">
                      {Array.from({ length: current.rating }).map((_, i) => (
                        <span key={i} className="select-none">★</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={prevTestimonial}
                disabled={isTransitioning}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                aria-label="Previous story"
              >
                ←
              </button>
              <button
                type="button"
                onClick={nextTestimonial}
                disabled={isTransitioning}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                aria-label="Next story"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
