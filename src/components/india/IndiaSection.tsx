"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { IndiaRoutes, IndiaCompass } from "@/components/india/IndiaRoutes";
import { IndiaMobileMap } from "@/components/india/IndiaMobileMap";
import { IndiaStoryCard } from "@/components/india/IndiaStoryCard";
import { useParallax } from "@/hooks/use-parallax";
import { SlideIn } from "@/components/common/SlideIn";

export const IndiaSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  // pin whose story is shown on the right; null = the original collage
  const [story, setStory] = useState<number | null>(null);
  const textParallaxRef = useParallax<HTMLDivElement>(0.03, 16);
  const collageParallaxRef = useParallax<HTMLDivElement>(0.06, 30);


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
      id="journey"
      className="relative z-30 w-full select-none bg-transparent -mt-[13vw] md:-mt-4 lg:-mt-6 xl:-mt-8"
    >
      {/* ========================================================
          1. DESKTOP & TABLET VIEW (md: 768px+)
          - Direct load of /images/India-web.webp (1853 x 849)
          - Overlaps Garden section with high z-index (z-30) and negative top margin
          - quality={100}, unoptimized, natural dimensions for pixel-for-pixel fidelity
          - Left column text matching the reference mockup
          ======================================================== */}
      <div className="relative hidden w-full overflow-x-clip md:block">
        {/* Full-width High-Quality Base Parchment Map */}
        <Image
          src="/images/India-web.webp"
          alt="Maison D'Vine Stories Across India"
          width={1853}
          height={849}
          quality={100}
          unoptimized
          className="pointer-events-none block h-auto w-full select-none drop-shadow-[0_-8px_20px_rgba(0,0,0,0.35)] drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)]"
          style={{
            objectFit: "cover",
            width: "100%",
            height: "auto",
          }}
        />

        {/* Animated connectivity between the pins on the map */}
        <IndiaRoutes onSelect={setStory} />

        {/* Slow warm light drifting across the map */}
        {inView && (
          <div
            className="animate-hero-glow pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                "radial-gradient(28vw circle at 44% 45%, rgba(240, 214, 160, 0.22) 0%, rgba(240, 214, 160, 0.06) 50%, transparent 75%)",
            }}
            aria-hidden="true"
          />
        )}

        {/* Compass rose that draws itself beside the map */}
        {inView && (
          <IndiaCompass className="absolute top-[58%] left-[64%] z-10 w-[7%] opacity-80" />
        )}

        {/* Content Overlay Layer: Left Text Column */}
        <div className="pointer-events-none absolute inset-0 z-20">
          <div
            ref={textParallaxRef}
            className="pointer-events-auto absolute top-[18%] bottom-[12%] left-[6.8%] z-20 w-[28%] max-w-[420px] text-left"
          >
            <SlideIn from="left" distance="9vw" className="flex h-full flex-col justify-between">
            {/* Top Text Group: Eyebrow + Heading + Paragraph */}
            <div className="flex flex-col">
              {/* Eyebrow with a rule that draws itself in */}
              <span
                className={`flex items-center gap-3 font-sans text-[11px] sm:text-[12px] md:text-[0.88vw] font-semibold tracking-[0.24em] text-[#554a3e] uppercase transition-all duration-700 ${
                  inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                }`}
              >
                <span
                  className="block h-px bg-gradient-to-r from-[#8a6a3a] to-[#8a6a3a]/0 transition-[width] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                  style={{ width: inView ? "2.6em" : "0em", transitionDelay: "150ms" }}
                  aria-hidden="true"
                />
                OUR STORIES ACROSS INDIA
              </span>

              {/* Main Heading: each word slides up out of a mask */}
              <h2 className="mt-2.5 font-serif text-4xl sm:text-5xl md:text-[3.9vw] lg:text-[4.2vw] font-normal leading-[0.94] tracking-[0.01em] text-[#191512]">
                {["Growing", "Together"].map((word, i) => (
                  <span key={word} className="block overflow-hidden pb-[0.08em]">
                    <span
                      className="block transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                      style={{
                        transform: inView ? "translateY(0)" : "translateY(115%)",
                        transitionDelay: inView ? `${250 + i * 180}ms` : "0ms",
                      }}
                    >
                      {word}
                    </span>
                  </span>
                ))}
              </h2>

              {/* Gold underline drawn after the heading */}
              <span
                className="mt-3 block h-px bg-gradient-to-r from-[#8a6a3a] via-[#b8862d]/80 to-transparent transition-[width] duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                style={{ width: inView ? "62%" : "0%", transitionDelay: "900ms" }}
                aria-hidden="true"
              />

              {/* Description Paragraph */}
              <p
                className={`mt-4 sm:mt-5 font-sans text-xs sm:text-[13px] md:text-[0.98vw] leading-[1.62] text-[#42372c] tracking-[0.01em] max-w-[340px] transition-all duration-1000 delay-[650ms] ease-out ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                Right now, our stories live in and around NCR &mdash; with incredible women who made them their own. We&apos;re on our way to more cities, more stories, more you.
              </p>
            </div>

            {/* Bottom Handwritten Script Note: written line by line */}
            <div className="pt-4 pb-1">
              <p className="font-allura allura-regular font-script font-cursive text-3xl sm:text-4xl md:text-[2.5vw] lg:text-[2.7vw] leading-[1.18] text-[#2c231b] -rotate-6 origin-bottom-left select-none tracking-wide">
                {[
                  ["More cities.", ""],
                  ["More stories.", ""],
                  ["Soon...", "pl-5"],
                ].map(([line, pad], i) => (
                  <span
                    key={line}
                    className={`block ${pad} ${inView ? "animate-india-script" : "opacity-0"}`}
                    style={{ "--i": i } as React.CSSProperties}
                  >
                    {line}
                  </span>
                ))}
              </p>
            </div>
            </SlideIn>
          </div>

          {/* Right Collage Layer: IndiaPage-right-collage.webp */}
          <div
            ref={collageParallaxRef}
            className="pointer-events-auto absolute top-[10.5%] right-[5.2%] z-20 w-[25.2%]"
          >
            {/* lands like a photo dropped on the map, then floats gently */}
            <div className={inView ? "animate-india-collage" : "opacity-0"}>
              <div className="animate-india-float">
                {story === null ? (
                  <div className="relative w-full h-auto drop-shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition-transform duration-500 hover:scale-[1.015]">
                    <Image
                      src="/images/IndiaPage-right-collage.webp"
                      alt="Mehak S. - Choreographer Story across India"
                      width={1047}
                      height={1503}
                      quality={100}
                      unoptimized
                      className="pointer-events-none block h-auto w-full select-none"
                    />
                  </div>
                ) : (
                  <div className="drop-shadow-[0_10px_24px_rgba(0,0,0,0.22)]">
                    <IndiaStoryCard key={story} index={story} onClose={() => setStory(null)} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. MOBILE VIEW (< 768px)
          - Torn parchment sheet: copy left, hand-drawn map right (india-mobile-sheet.webp)
          - Live routes, city names and a spotlight tour over the map
          - Scrapbook photo laid over the lower half, on a blurred garden backdrop
          ======================================================== */}
      <div className="relative block w-full overflow-hidden pb-10 md:hidden">
        {/* Backdrop only behind the lower part, so the wavy top edge lets the page above show through */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[35%] bottom-0 bg-[#0d0c0a]"
          style={{
            WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 30%, #000 72%, transparent 100%)",
            maskImage: "linear-gradient(180deg, transparent 0%, #000 30%, #000 72%, transparent 100%)",
          }}
        >
          <Image
            src="/images/story-mobile.webp"
            alt=""
            fill
            unoptimized
            sizes="100vw"
            className="scale-110 object-cover opacity-55 blur-[7px] select-none"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(13,12,10,0) 0%, rgba(13,12,10,0.35) 30%, rgba(13,12,10,0.35) 82%, rgba(13,12,10,0.35) 100%)",
            }}
          />
        </div>

        <div className="relative w-full">
          <IndiaMobileMap />
        </div>
      </div>
    </section>
  );
};
