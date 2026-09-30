"use client";

import React from "react";
import { JournalBackground } from "./JournalBackground";
import { BlogMobile } from "./BlogMobile";
import { BlogDesktop } from "./BlogDesktop";
import { useMatches } from "@/hooks/use-matches";

export const BlogSection: React.FC = () => {
  const wide = useMatches("(min-width: 768px)");

  return (
    <section
      id="blog"
      aria-label="Blogposts and Journal"
      className="relative z-20 w-full select-none bg-[#0e0d0c] -mt-[10vw] md:-mt-16 lg:-mt-22 xl:-mt-28 overflow-clip"
    >
      {/* Anchor for journal navigation */}
      <div id="journal" className="absolute -top-24 left-0 pointer-events-none" />

      {/* ========================================================
          1. DESKTOP & TABLET (md: 768px+)
          - A magazine spread over the rose-garden photograph (/images/BlogPage-web.webp):
            the featured story as a taped print, its headline, and the numbered index of stories
          - Torn paper top edge + botanical line-art from JournalBackground
          - Underlaps beneath FAQ section above (z-20 under z-30)
          ======================================================== */}
      {wide !== false && (
        <div className="hidden md:block">
          <JournalBackground />
          <BlogDesktop />
        </div>
      )}

      {/* ========================================================
          2. MOBILE (< 768px): header, then the three stories as a pinned deck that swipes left
          ======================================================== */}
      {wide !== true && (
        <div className="md:hidden">
          <BlogMobile />
        </div>
      )}
    </section>
  );
};

export const BlogPage = BlogSection;
