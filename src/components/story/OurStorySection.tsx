"use client";

import React, { useRef, useState, useEffect } from "react";
import { OurStoryMobile } from "@/components/story/OurStoryMobile";
import { OurStoryDesktop } from "@/components/story/OurStoryDesktop";
import { useMatches } from "@/hooks/use-matches";

export const OurStorySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const wide = useMatches("(min-width: 768px)");

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
          - Sticky full-screen stage: the scroll moves a camera through the atelier photograph
            (designer -> wall of sketches -> gown) while the story is told in three chapters
          - Underlaps beneath IndiaSection (z-20 under z-30 with negative top margin)
          ======================================================== */}
      {wide !== false && (
        <div className="hidden md:block">
          <OurStoryDesktop />
        </div>
      )}

      {/* ========================================================
          2. MOBILE VIEW (< 768px)
          - Full-bleed atelier photo (/images/ourstroy-mobile.webp) with flickering lamp,
            dust, a scroll-drawn gold thread, masked headline and handwritten notes
          ======================================================== */}
      {wide !== true && (
        <div className="md:hidden">
          <OurStoryMobile play={inView} />
        </div>
      )}
    </section>
  );
};
