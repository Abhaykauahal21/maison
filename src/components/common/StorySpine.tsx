"use client";

import React, { useEffect, useState } from "react";

interface Chapter {
  id: string;
  number: string;
  name: string;
  quote: string;
}

const chapters: Chapter[] = [
  {
    id: "hero",
    number: "00",
    name: "PROLOGUE",
    quote: "Not Just Dresses, But Stories",
  },
  {
    id: "story",
    number: "01",
    name: "THE ECHO",
    quote: "Before every dream, there is an echo",
  },
  {
    id: "dream",
    number: "02",
    name: "THE DREAM",
    quote: "Where her story begins to take shape",
  },
  {
    id: "step-1",
    number: "03",
    name: "THE BEGINNING",
    quote: "A single step can change everything",
  },
  {
    id: "whispers",
    number: "04",
    name: "THE WHISPERS",
    quote: "Real Stories. Real Women.",
  },
  {
    id: "journey",
    number: "05",
    name: "THE JOURNEY",
    quote: "Woven Across Every Corner of India",
  },
  {
    id: "our-story",
    number: "06",
    name: "OUR STORY",
    quote: "Crafted with Intention and Soul",
  },
  {
    id: "faq",
    number: "07",
    name: "FAQS",
    quote: "Every Question Whispered & Answered",
  },
  {
    id: "blog",
    number: "08",
    name: "JOURNAL",
    quote: "The Living Archive & Editorial Stories",
  },
  {
    id: "closer",
    number: "09",
    name: "CLOSER",
    quote: "The Epilogue — The Final Stitch",
  },
];

export const StorySpine: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) return;

      const currentScroll = window.scrollY;
      const progress = Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100));
      setScrollProgress(progress);

      // Detect active section based on scroll offset
      const sectionElements = chapters.map((ch) =>
        ch.id === "hero" ? document.body : document.getElementById(ch.id)
      );

      const scrollPosition = window.scrollY + window.innerHeight * 0.4;

      for (let i = chapters.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el) {
          const top = chTop(el);
          if (scrollPosition >= top) {
            setActiveChapter(i);
            break;
          }
        }
      }
    };

    function chTop(el: HTMLElement): number {
      if (el === document.body) return 0;
      let top = 0;
      let curr: HTMLElement | null = el;
      while (curr) {
        top += curr.offsetTop;
        curr = curr.offsetParent as HTMLElement | null;
      }
      return top;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToChapter = (id: string) => {
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside
      className="pointer-events-none fixed right-4 sm:right-6 md:right-8 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end select-none md:flex"
      aria-label="Story Chapters Navigation"
    >
      {/* Chapter Marker Group */}
      <div className="pointer-events-auto relative flex flex-col items-center gap-7 py-3">
        {/* Background Vertical Hairline Thread */}
        <div className="absolute top-2 bottom-2 left-1/2 w-[1px] -translate-x-1/2 bg-white/15">
          {/* Active Golden Liquid Fill along Thread */}
          <div
            className="w-full bg-gradient-to-b from-[#e5c9a5] via-[#f7e0be] to-[#dfc098] transition-all duration-300"
            style={{ height: `${scrollProgress}%` }}
          />
        </div>

        {chapters.map((ch, idx) => {
          const isActive = activeChapter === idx;
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={ch.id}
              className="group relative flex items-center justify-center"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Flyout Story Tooltip on Hover or when Active */}
              <div
                className={`pointer-events-none absolute right-7 flex flex-col items-end whitespace-nowrap rounded-[1px] border border-[#4a3e33]/50 bg-[#120f0c]/90 px-3 py-1.5 backdrop-blur-md shadow-xl transition-all duration-300 ${
                  isHovered || (isActive && hoveredIdx === null)
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-2"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-[#cfb799]">{ch.number}</span>
                  <span className="font-bodoni text-[11px] font-normal tracking-[0.2em] text-white uppercase">
                    {ch.name}
                  </span>
                </div>
                <span className="font-serif text-[10px] italic text-[#b5a796] tracking-wide">
                  &ldquo;{ch.quote}&rdquo;
                </span>
              </div>

              {/* Interactive Node Button */}
              <button
                type="button"
                onClick={() => scrollToChapter(ch.id)}
                className="relative z-10 flex h-6 w-6 cursor-pointer items-center justify-center focus-visible:outline-none"
                aria-label={`Scroll to ${ch.name}`}
              >
                {/* Active Outer Ring / Diamond */}
                {isActive && (
                  <span
                    className="absolute h-5 w-5 rounded-full border border-[#f5dfb8]/60 animate-ping opacity-60"
                    aria-hidden="true"
                  />
                )}

                {/* Node Center Dot */}
                <span
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? "scale-125 bg-[#f7e0be] shadow-[0_0_10px_#f7e0be]"
                      : "bg-white/40 hover:bg-white hover:scale-110"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
