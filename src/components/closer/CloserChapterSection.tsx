"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Heart, Gift, BookOpen } from "lucide-react";
import { useParallax } from "@/hooks/use-parallax";
import { SlideIn } from "@/components/common/SlideIn";
import { CloserChapterMobile } from "@/components/closer/CloserChapterMobile";

interface BenefitItem {
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  text: string;
}

const benefits: BenefitItem[] = [
  {
    icon: Sparkles,
    text: "Early access to new collections",
  },
  {
    icon: Heart,
    text: "Exclusive member-only drops",
  },
  {
    icon: Gift,
    text: "Special offers & experiences",
  },
  {
    icon: BookOpen,
    text: "Stories, notes and behind the scenes",
  },
];

/**
 * Headline whose letters start spread apart and blurred, then converge ("a closer chapter").
 * Each line is a block; letters fan out from the line's centre.
 */
const ConvergeText: React.FC<{ lines: string[]; inView: boolean; baseDelay?: number }> = ({
  lines,
  inView,
  baseDelay = 150,
}) => (
  <>
    {lines.map((line, li) => {
      const chars = Array.from(line);
      const centre = (chars.length - 1) / 2;
      return (
        <span key={line} className="block" aria-hidden="true">
          {chars.map((ch, i) => (
            <span
              key={i}
              className="inline-block transition-[opacity,transform,filter] duration-[1700ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateX(0)" : `translateX(${((i - centre) * 0.55).toFixed(2)}em)`,
                filter: inView ? "blur(0px)" : "blur(9px)",
                transitionDelay: inView ? `${baseDelay + li * 260 + i * 30}ms` : "0ms",
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </span>
      );
    })}
  </>
);

/** Deterministic golden dust motes (no Math.random, so server/client markup always agree). */
const Motes: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 z-[15]" aria-hidden="true">
    {Array.from({ length: 18 }, (_, i) => (
      <span
        key={i}
        className="animate-closer-mote absolute rounded-full bg-[#e6c98f]"
        style={
          {
            left: `${((i * 37 + 13) % 90) + 5}%`,
            top: `${((i * 53 + 7) % 78) + 12}%`,
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            boxShadow: "0 0 8px 1px rgba(230, 201, 143, 0.7)",
            animationDuration: `${6 + (i % 5) * 1.5}s`,
            animationDelay: `${1 + (i % 7) * 0.8}s`,
            "--dx": `${(i % 2 === 0 ? 1 : -1) * (8 + (i % 4) * 6)}px`,
          } as React.CSSProperties
        }
      />
    ))}
  </div>
);

export const CloserChapterSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const frameParallaxRef = useParallax<HTMLDivElement>(0.06, 40);
  const noteParallaxRef = useParallax<HTMLParagraphElement>(-0.05, 30);

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
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="closer"
      aria-label="A Closer Chapter"
      className="closeChapter relative z-30 w-full max-w-full select-none bg-transparent -mt-[20vw] md:-mt-16 lg:-mt-22 xl:-mt-28 overflow-x-clip"
    >
      {/* Anchor for navigation */}
      <div id="epilogue" className="absolute -top-24 left-0 pointer-events-none" />

      {/* ========================================================
          1. DESKTOP & TABLET VIEW (md: 768px+)
          - Direct load of existing /images/closer-chapter-bg.webp (1983 x 793)
          - Full natural width and height with 100% pixel fidelity
          - Background remains completely untouched
          - Content layered cleanly on top
          ======================================================== */}
      <div className="relative hidden w-full max-w-full overflow-hidden md:block">
        {/* The untouched existing background */}
        <div
          className={`relative w-full transition-opacity duration-1000 ease-out ${
            inView ? "opacity-100" : "opacity-95"
          }`}
        >
          <Image
            src="/images/closer-chapter-bg.webp"
            alt="Maison D'Vine - Closer Chapter"
            width={1983}
            height={793}
            quality={100}
            unoptimized
            priority
            className="pointer-events-none block h-auto w-full select-none drop-shadow-[0_-12px_24px_rgba(0,0,0,0.5)]"
            style={{
              width: "100%",
              height: "auto",
            }}
          />

          {/* One-off sweep of light as the archive opens, then drifting dust */}
          {inView && (
            <>
              <div
                className="animate-closer-sweep pointer-events-none absolute inset-y-0 -left-1/3 z-[25] w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent"
                aria-hidden="true"
              />
              <Motes />
            </>
          )}

          {/* ====================================================
              LAYERED CONTENT (Desktop / Tablet)
              ==================================================== */}
          <div className="pointer-events-auto absolute inset-0 z-20 flex items-center justify-center">
            <div className="w-full max-w-[1540px] h-full mx-auto px-4 md:px-8 lg:px-12 xl:px-16 flex items-center justify-between">
              
              {/* ------------------------------------------------
                  LEFT SIDE: photoframeclosechapter + Photo (~45%)
                  ------------------------------------------------ */}
              <div
                className={`relative w-[44%] lg:w-[45%] xl:w-[46%] h-[88%] max-h-[720px] flex items-center justify-center ${
                  inView ? "animate-closer-frame" : "opacity-0"
                }`}
              >
                {/* Scrapbook Frame Container preserving 1096 x 1436 aspect ratio */}
                <div
                  ref={frameParallaxRef}
                  className="relative w-full h-full max-w-[540px] flex items-center justify-center will-change-transform"
                  style={{ aspectRatio: "1096 / 1436" }}
                >
                  {/* Photo inside frame (Main photo area: aligned with deckle edge) */}
                  <div
                    className="absolute overflow-hidden shadow-[0_4px_18px_rgba(40,30,20,0.22)]"
                    style={{
                      top: "9.89%",
                      left: "38.14%",
                      width: "33.30%",
                      height: "55.71%",
                      transform: "rotate(5.2deg)",
                      transformOrigin: "0 0",
                      zIndex: 15,
                    }}
                  >
                    <Image
                      src="/images/close-chapter-photo.webp"
                      alt="Private Archive"
                      fill
                      sizes="(max-width: 768px) 60vw, (max-width: 1200px) 25vw, 365px"
                      quality={100}
                      priority
                      className={`object-cover ${inView ? "animate-closer-iris" : "opacity-0"}`}
                    />
                  </div>

                  {/* photoframeclosechapter primary scrapbook frame decoration */}
                  <div className="relative w-full h-full z-10 pointer-events-none select-none">
                    <Image
                      src="/images/photoFrameclosechapter.webp"
                      alt="Private Archive Scrapbook Frame"
                      fill
                      sizes="(max-width: 768px) 85vw, (max-width: 1200px) 45vw, 540px"
                      quality={100}
                      priority
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------
                  RIGHT SIDE: Editorial Typography, Benefits, CTA (~55%)
                  ------------------------------------------------ */}
              <div className="relative w-[54%] lg:w-[53%] xl:w-[52%] h-full flex items-center justify-between pl-3 lg:pl-6 xl:pl-10 pr-2 lg:pr-4 overflow-hidden">
                
                {/* Main Content Column */}
                <SlideIn
                  from="right"
                  distance="9vw"
                  className="flex-1 min-w-0 flex flex-col justify-center text-left max-w-[420px] lg:max-w-[480px]"
                >
                  {/* Eyebrow */}
                  <span
                    className={`flex items-center gap-3 font-serif text-[10px] md:text-[0.78vw] lg:text-[12px] xl:text-[12.5px] font-medium tracking-[0.28em] text-[#635548] uppercase transition-all duration-700 ${
                      inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                    }`}
                  >
                    <span
                      className="block h-px bg-gradient-to-r from-[#8a6a3a] to-[#8a6a3a]/0 transition-[width] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                      style={{ width: inView ? "2.6em" : "0em", transitionDelay: "150ms" }}
                      aria-hidden="true"
                    />
                    THE PRIVATE ARCHIVE
                  </span>

                  {/* Main Heading */}
                  <h2
                    aria-label="A CLOSER CHAPTER"
                    className="mt-2 md:mt-2.5 lg:mt-3 font-serif text-3xl md:text-[3.2vw] lg:text-[46px] xl:text-[58px] 2xl:text-[66px] font-normal leading-[0.93] tracking-[-0.01em] text-[#191411]"
                  >
                    <ConvergeText lines={["A CLOSER", "CHAPTER"]} inView={inView} />
                  </h2>

                  {/* Description Paragraph */}
                  <p
                    className={`mt-3 md:mt-3.5 lg:mt-4 font-serif text-xs md:text-[0.88vw] lg:text-[14px] xl:text-[15px] leading-[1.62] text-[#55473c] font-normal tracking-[0.01em] max-w-[390px] xl:max-w-[420px] transition-all duration-1000 delay-[900ms] ease-out ${
                      inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                  >
                    An exclusive space for early access, special drops, and stories that we share only with our closest community.
                  </p>

                  {/* Benefits Rows */}
                  <ul className="mt-4 md:mt-5 lg:mt-6 space-y-2 md:space-y-2.5 lg:space-y-3 xl:space-y-3.5">
                    {benefits.map((benefit, idx) => {
                      const d = 1100 + idx * 160;
                      const IconComponent = benefit.icon;
                      return (
                        <li
                          key={benefit.text}
                          className="flex items-center gap-3 sm:gap-3.5"
                          style={{
                            clipPath: inView ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
                            opacity: inView ? 1 : 0,
                            transform: inView ? "translateX(0)" : "translateX(-14px)",
                            transition: `clip-path 900ms cubic-bezier(0.65, 0, 0.35, 1) ${d}ms, opacity 700ms ease-out ${d}ms, transform 900ms cubic-bezier(0.16, 1, 0.3, 1) ${d}ms`,
                          }}
                        >
                          <div
                            className="flex-shrink-0 text-[#42362c]"
                            style={{
                              transform: inView ? "scale(1) rotate(0deg)" : "scale(0) rotate(-90deg)",
                              transition: `transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1) ${d + 250}ms`,
                            }}
                          >
                            <IconComponent
                              strokeWidth={1.3}
                              className="w-[17px] h-[17px] md:w-[1.25vw] md:h-[1.25vw] lg:w-[19px] lg:h-[19px]"
                            />
                          </div>
                          <span className="font-serif text-[#322a24] text-xs md:text-[0.86vw] lg:text-[13.5px] xl:text-[14.5px] tracking-[0.015em] leading-normal font-normal">
                            {benefit.text}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  {/* CTA Button */}
                  <div
                    className={`mt-5 md:mt-6 lg:mt-7 xl:mt-8 transition-all duration-1000 delay-[1800ms] ease-out ${
                      inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                    }`}
                  >
                    <button
                      type="button"
                      className="group relative inline-flex items-center justify-between gap-5 bg-[#171310] hover:bg-[#2b231d] text-[#f7f3ea] h-[46px] md:h-[48px] lg:h-[54px] xl:h-[58px] px-7 lg:px-9 rounded-none text-[10.5px] md:text-[11px] lg:text-[12.5px] xl:text-[13px] tracking-[0.22em] uppercase font-serif font-medium shadow-[0_4px_18px_rgba(20,15,10,0.32)] transition-colors duration-300 cursor-pointer"
                    >
                      {/* Light that keeps circling the button edge */}
                      <svg
                        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                        aria-hidden="true"
                      >
                        <rect
                          x="0"
                          y="0"
                          width="100%"
                          height="100%"
                          fill="none"
                          stroke="#e6c98f"
                          strokeWidth="1.6"
                          pathLength={1}
                          className="closer-cta-run"
                        />
                      </svg>
                      <span>JOIN THE PRIVATE ARCHIVE</span>
                      <span className="text-[15px] lg:text-[17px] transition-transform duration-300 ease-out group-hover:translate-x-1">
                        &rarr;
                      </span>
                    </button>
                  </div>
                </SlideIn>

                {/* Far Right: Handwritten Script Note with Heart */}
                <div
                  className="flex-shrink-0 flex flex-col items-center justify-center pl-2 lg:pl-4 xl:pl-8 pt-8 lg:pt-12 select-none pointer-events-none"
                >
                  <p ref={noteParallaxRef} className="will-change-transform font-script font-allura font-cursive text-[#493c33] text-[26px] md:text-[2.2vw] lg:text-[34px] xl:text-[38px] leading-[1.08] tracking-normal font-normal text-left -rotate-[6deg]">
                    {["A closer", "chapter", "for our", "inner circle"].map((line, i) => (
                      <span
                        key={line}
                        className={`block ${inView ? "animate-india-script" : "opacity-0"}`}
                        style={{ "--i": i, "--d": "2.2s" } as React.CSSProperties}
                      >
                        {line}
                      </span>
                    ))}
                  </p>

                  {/* Delicate Hand-drawn Heart SVG */}
                  <svg
                    width="26"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`mt-2 text-[#493c33]/85 stroke-current -rotate-[8deg] ${inView ? "closer-heart-beat" : "opacity-0"}`}
                  >
                    <path
                      d="M12 20.5C12 20.5 3.5 15.2 3.5 8.7C3.5 5.8 5.7 3.5 8.5 3.5C10.2 3.5 11.6 4.4 12 5.5C12.4 4.4 13.8 3.5 15.5 3.5C18.3 3.5 20.5 5.8 20.5 8.7C20.5 15.2 12 20.5 12 20.5Z"
                      pathLength={1}
                      className="closer-heart-draw"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. MOBILE VIEW (< 768px)
          - Full-bleed torn parchment (closechapter-mobile.webp) with the scrapbook frame and
            photo laid on it, scroll-scrubbed reveals throughout
          ======================================================== */}
      <div className="md:hidden">
        <CloserChapterMobile />
      </div>
    </section>
  );
};

export const CloseChapter = CloserChapterSection;
export const CloserChapterPage = CloserChapterSection;
export default CloserChapterSection;
