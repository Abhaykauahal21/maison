"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { smoothScrollTo } from "@/lib/smooth-scroll";
import { X } from "lucide-react";
import { GRAIN, PAPER, tornPage } from "@/components/editorial/EchoStory";

/** The founder's letter, turned one page at a time. The last page closes the letter and scrolls on to the next section. */
const PAGES: { kicker: string; title: string; paragraphs: string[] }[] = [
  {
    kicker: "Chapter one",
    title: "It began with a feeling",
    paragraphs: [
      "Long before there was a Maison, there was a quiet feeling I could not name. A thought at midnight, a hope I was too shy to say out loud, a feeling that something beautiful was waiting for me to make it.",
      "I did not set out to build a brand. I set out to hold on to that feeling, and the only way I knew how was to give it a shape I could wear.",
    ],
  },
  {
    kicker: "Chapter two",
    title: "Every dress holds a story",
    paragraphs: [
      "So I began to sew my stories into silk. A morning when I finally felt like myself. A letter I never sent. A dream I was not ready to tell anyone.",
      "Each dress came out of one of those moments, and each one carries it still: in the fall of the fabric, in a petal, in a pleat held back like a breath.",
    ],
  },
  {
    kicker: "Chapter three",
    title: "Now, it is yours too",
    paragraphs: [
      "Maison D’Vine is that personal journey, opened up to everyone who has ever dreamed, felt and changed. Her story, your story, and the dresses that remember them.",
      "Before every dream, there is an echo. This is where mine begins. Turn the page, and I will tell you the rest.",
    ],
  },
];

interface HeroStoryProps {
  open: boolean;
  onClose: () => void;
}

export const HeroStory: React.FC<HeroStoryProps> = ({ open, onClose }) => {
  const [page, setPage] = useState(0);
  const [closing, setClosing] = useState(false);

  const close = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      setPage(0);
      onClose();
    }, 1050);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") setPage((p) => Math.min(p + 1, PAGES.length - 1));
      else if (e.key === "ArrowLeft") setPage((p) => Math.max(p - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, closing]);

  if (!open) return null;

  const current = PAGES[page];
  const last = page === PAGES.length - 1;
  const btn =
    "group inline-flex cursor-pointer items-center gap-2.5 border px-6 py-2.5 font-sans text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-300";

  return createPortal(
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 [perspective:1400px] sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="My story"
    >
      <div
        onClick={close}
        aria-hidden="true"
        className="absolute inset-0 bg-[#0c0b0a]/60 backdrop-blur-md transition-opacity duration-700"
        style={{ opacity: closing ? 0 : 1 }}
      />

      <div
        className={`relative w-full max-w-[720px] ${closing ? "echo-story-out" : "echo-story-in"}`}
        style={{ filter: "drop-shadow(0 12px 22px rgba(30,20,10,0.38))" }}
      >
        <div
          className="relative max-h-[90vh] overflow-y-auto text-[#1c1815] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            clipPath: tornPage,
            backgroundColor: "#f3ead9",
            backgroundImage: `${GRAIN}, ${PAPER}`,
            backgroundBlendMode: "multiply, normal",
          }}
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="echo-story-shine absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent" />
          </div>

          <div
            className="relative flex min-h-[460px] flex-col px-7 py-10 sm:px-14 sm:py-14"
            style={{ opacity: closing ? 0 : 1, transition: "opacity 0.25s ease" }}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close story"
              className="group absolute top-5 right-6 z-10 p-2 text-[#1c1815]/70 transition-colors hover:text-[#1c1815] sm:top-7 sm:right-9"
            >
              <X className="h-6 w-6 stroke-[1.3] transition-transform duration-500 group-hover:rotate-90" />
            </button>

            {/* the page being read; keyed so every turn fades up afresh */}
            <div key={page} className="nav-link-rise flex flex-1 flex-col justify-center text-center">
              <span className="font-sans text-[11px] font-semibold tracking-[0.28em] text-[#7a6140] uppercase">
                {current.kicker}
              </span>
              <h2 className="font-allura allura-regular font-script font-cursive mt-3 text-[clamp(38px,6vw,60px)] leading-[1.05] text-[#8a6a3b]">
                {current.title}
              </h2>
              <span aria-hidden="true" className="mx-auto mt-4 block h-px w-16 bg-[#8a6a3b]/50" />
              <div className="mx-auto mt-6 max-w-[540px] space-y-4">
                {current.paragraphs.map((para, i) => (
                  <p key={i} className="font-serif text-[16px] leading-[1.8] text-[#2e2418] sm:text-[18px]">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* page dots + turn-the-page controls */}
            <div className="mt-8 flex flex-col items-center gap-5">
              <div className="flex items-center gap-2.5" aria-hidden="true">
                {PAGES.map((_, i) => (
                  <span
                    key={i}
                    className={`block h-1.5 rounded-full transition-all duration-500 ${
                      i === page ? "w-6 bg-[#8a6a3b]" : "w-1.5 bg-[#8a6a3b]/30"
                    }`}
                  />
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {page > 0 && (
                  <button
                    type="button"
                    onClick={() => setPage(page - 1)}
                    className={`${btn} border-[#1c1815]/30 text-[#2e2418] hover:border-[#1c1815] hover:bg-[#1c1815]/5`}
                  >
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1.5">
                      &larr;
                    </span>
                    Back
                  </button>
                )}
                {last ? (
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      window.setTimeout(() => smoothScrollTo(document.getElementById("story")), 1100);
                    }}
                    className={`${btn} border-[#1c1815] bg-[#1c1815] text-[#f2e7db] hover:bg-[#8a6a3b] hover:border-[#8a6a3b]`}
                  >
                    Continue the story
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">
                      &rarr;
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPage(page + 1)}
                    className={`${btn} border-[#1c1815] bg-[#1c1815] text-[#f2e7db] hover:bg-[#8a6a3b] hover:border-[#8a6a3b]`}
                  >
                    Next page
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">
                      &rarr;
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* steel pin holding the page up */}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 96"
          className={`pointer-events-none absolute -top-9 left-1/2 z-10 h-[78px] w-auto -translate-x-1/2 drop-shadow-[2px_4px_3px_rgba(40,28,16,0.4)] ${closing ? "echo-story-pin-out" : "echo-story-pin"}`}
        >
          <defs>
            <linearGradient id="heroPinSteel" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#5f6870" />
              <stop offset="0.45" stopColor="#f2f5f7" />
              <stop offset="1" stopColor="#7d868e" />
            </linearGradient>
            <radialGradient id="heroPinHead" cx="0.35" cy="0.3" r="0.8">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.5" stopColor="#c3cad0" />
              <stop offset="1" stopColor="#6c757d" />
            </radialGradient>
          </defs>
          <path d="M12 12 C7 28 17 42 11 58 C7 70 14 82 12 94" fill="none" stroke="url(#heroPinSteel)" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M12.6 14 C8 29 17.6 43 11.8 59" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="0.7" strokeLinecap="round" />
          <rect x="9.2" y="10" width="5.6" height="3.2" rx="1.2" fill="#8d969d" />
          <circle cx="12" cy="6.5" r="5.4" fill="url(#heroPinHead)" stroke="#5b646c" strokeWidth="0.8" />
          <circle cx="10.2" cy="4.8" r="1.5" fill="#fff" fillOpacity="0.85" />
        </svg>
      </div>
    </div>,
    document.body
  );
};
