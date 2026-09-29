"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { BLOG_POSTS } from "./types";
import { BlogCard } from "./BlogCard";
import { JournalButton } from "./JournalButton";
import { JournalQuote } from "./JournalQuote";
import { JournalBackground } from "./JournalBackground";
import { SlideIn } from "@/components/common/SlideIn";

const HEADING = "BLOGPOSTS";

export const BlogSection: React.FC = () => {
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
      id="blog"
      aria-label="Blogposts and Journal"
      className="relative z-20 w-full select-none bg-[#0e0d0c] -mt-8 sm:-mt-12 md:-mt-16 lg:-mt-22 xl:-mt-28 overflow-hidden"
    >
      {/* Anchor for journal navigation */}
      <div id="journal" className="absolute -top-24 left-0 pointer-events-none" />

      {/* ========================================================
          1. FULL-WIDTH HIGH-QUALITY BASE ATMOSPHERE BACKGROUND
          - Direct load of /images/BlogPage-web.webp (1983 x 793)
          - Quality 100, unoptimized, priority for maximum sharpness
          - Underlaps beneath FAQ section above (z-20 under z-30)
          ======================================================== */}
      <div
        className={`pointer-events-none absolute inset-0 z-0 overflow-hidden transition-opacity duration-1000 ease-out ${
          inView ? "opacity-100" : "opacity-90"
        }`}
      >
        <Image
          src="/images/BlogPage-web.webp"
          alt="Maison D'Vine Blog and Journal Atmosphere"
          fill
          quality={100}
          unoptimized
          priority
          sizes="100vw"
          className="pointer-events-none select-none object-cover object-center"
        />
        {/* Deep atmospheric overlay for editorial text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e0d0c]/35 via-transparent to-[#0a0807]/75" />
      </div>

      {/* ========================================================
          2. SVG DECORATIVE CANVAS LAYER
          - Scalable torn top paper edge for natural scrapbook underlap
          - Delicate botanical and architectural line-art
          - Subtle vintage film-strip perforation details
          - Soft vignette and parchment texture
          ======================================================== */}
      <JournalBackground />

      {/* ========================================================
          3. REAL HTML / REACT CONTENT LAYER (SHARP, SELECTABLE, EDITABLE)
          - Centered container with desktop-first max-width
          - Upper-left: Eyebrow + BLOGPOSTS heading + description + button
          - Upper-right: Handwritten script decorative quote
          - Lower: 3 equal-width editorial blog cards in one row
          ======================================================== */}
      <div
        className="relative z-20 mx-auto w-full max-w-[1420px] px-6 sm:px-8 md:px-10 lg:px-14 xl:px-16 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-20 sm:pb-24 md:pb-28 lg:pb-32"
      >
        {/* Upper Editorial Row: Header on Left & Script Quote on Right */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-10 pb-12 sm:pb-14 md:pb-16 lg:pb-18">
          {/* Upper Left Header */}
          <SlideIn from="left" distance="9vw" className="flex flex-col text-left max-w-[580px]">
            {/* Eyebrow */}
            <span
              className={`flex items-center gap-3 font-sans text-[11px] sm:text-[12px] font-medium tracking-[0.26em] text-white/85 uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] transition-all duration-700 ${
                inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              }`}
            >
              <span
                className="block h-px bg-gradient-to-r from-[#f0d9a0] to-transparent transition-[width] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                style={{ width: inView ? "2.6em" : "0em", transitionDelay: "150ms" }}
                aria-hidden="true"
              />
              FROM OUR JOURNAL
            </span>

            {/* Heading */}
            <h2
              aria-label={HEADING}
              className="mt-2.5 sm:mt-3 font-serif text-5xl sm:text-6xl md:text-[3.9vw] lg:text-[4.6rem] font-normal leading-[0.92] tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
            >
              {Array.from(HEADING).map((ch, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="inline-block transition-[opacity,transform,filter] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(40%)",
                    filter: inView ? "blur(0px)" : "blur(8px)",
                    transitionDelay: inView ? `${200 + i * 60}ms` : "0ms",
                  }}
                >
                  {ch}
                </span>
              ))}
            </h2>

            {/* Description */}
            <p
              className={`mt-4 sm:mt-5 font-serif text-sm sm:text-base md:text-[1.05vw] lg:text-[1.12rem] font-normal leading-[1.5] text-[#f7efe4] tracking-[0.01em] max-w-[460px] drop-shadow-[0_1px_5px_rgba(0,0,0,0.9)] transition-all duration-1000 delay-[750ms] ease-out ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Stories, style notes, behind the scenes
              <br className="hidden sm:inline" />
              and little pieces of inspiration &mdash;
              <br className="hidden sm:inline" />
              straight from our world to yours.
            </p>

            {/* Rectangular Button */}
            <div
              className={`mt-6 sm:mt-8 transition-all duration-1000 delay-[950ms] ease-out ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <JournalButton href="/blog" />
            </div>
          </SlideIn>

          {/* Upper Right Decorative Handwritten Quote */}
          <SlideIn from="right" distance="9vw" delay={200} rotate={4} className="self-start md:self-auto pt-2 md:pt-4 lg:pt-6">
            <JournalQuote inView={inView} />
          </SlideIn>
        </div>

        {/* Lower Row: Exactly Three Blog Cards in 1 Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 xl:gap-9">
          {BLOG_POSTS.map((post, idx) => (
            <BlogCard key={post.id} post={post} index={idx} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
};

export const BlogPage = BlogSection;
