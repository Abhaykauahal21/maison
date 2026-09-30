"use client";

import React from "react";
import { CloserChapterMobile } from "@/components/closer/CloserChapterMobile";
import { CloserChapterDesktop } from "@/components/closer/CloserChapterDesktop";
import { useMatches } from "@/hooks/use-matches";

export const CloserChapterSection: React.FC = () => {
  const wide = useMatches("(min-width: 768px)");

  return (
    <section
      id="closer"
      aria-label="A Closer Chapter"
      className="closeChapter relative z-30 w-full max-w-full select-none bg-transparent -mt-[20vw] md:-mt-16 lg:-mt-22 xl:-mt-28 overflow-x-clip"
    >
      {/* Anchor for navigation */}
      <div id="epilogue" className="absolute -top-24 left-0 pointer-events-none" />

      {/* ========================================================
          1. DESKTOP & TABLET VIEW (md: 768px+)
          - Sticky full-screen stage over the parchment (/images/closer-chapter-bg.webp): the
            private archive opens as you scroll
          ======================================================== */}
      {wide !== false && (
        <div className="hidden md:block">
          <CloserChapterDesktop />
        </div>
      )}

      {/* ========================================================
          2. MOBILE VIEW (< 768px)
          - Full-bleed torn parchment (closechapter-mobile.webp) with the scrapbook frame and
            photo laid on it, scroll-scrubbed reveals throughout
          ======================================================== */}
      {wide !== true && (
        <div className="md:hidden">
          <CloserChapterMobile />
        </div>
      )}
    </section>
  );
};

export const CloseChapter = CloserChapterSection;
export const CloserChapterPage = CloserChapterSection;
export default CloserChapterSection;
