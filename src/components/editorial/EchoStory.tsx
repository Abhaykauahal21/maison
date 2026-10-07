"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { echoDetails } from "@/components/editorial/EchoModal";

/** The look's story, told in her own voice. Index matches `echoDetails`. */
const STORIES: { quote: string; paragraphs: string[]; sign: string }[] = [
  {
    quote: "In the moments I find myself.",
    paragraphs: [
      "There was a morning I woke before the world did. The light came through the curtains softly, and for the first time in a long while I wasn't rushing toward anyone. I put on Solace, hand-printed floral silk that moves like breath, and walked out into the courtyard just to hear my own footsteps. Nothing was asked of me. Nothing needed fixing.",
      "That is what Solace means to me: not a dress for being seen, but a dress for coming home to myself. Every petal on the silk is a small promise I made that morning, to slow down, to listen, to stay.",
    ],
    sign: "Solace, at dawn",
  },
  {
    quote: "In what lives between our hearts.",
    paragraphs: [
      "I wrote his name on a letter and never sent it. The night I wore Longing, I finally understood that wanting is its own kind of beauty. The crimson tulle gathers, releases, gathers again, exactly like my heartbeat on the stairs outside that door.",
      "I did not say everything I felt. I let the dress say it for me: every pleat a word held back, every flounce a breath I couldn't quite let go. If you have ever loved quietly, you already know this red.",
    ],
    sign: "Longing, after dusk",
  },
  {
    quote: "For the dreams I don't say out loud.",
    paragraphs: [
      "At midnight, when the house is silent, I become someone no one has met. I wear Reverie then, noir satin and gold lace like the thin light of old stars, and I tell the dark my dreams. The ones I never say out loud.",
      "I'm not hiding. I am gathering. Each dream is a stitch in something I am still becoming, and this dress is the quiet promise that one day I'll wear them all in daylight.",
    ],
    sign: "Reverie, at midnight",
  },
];

/** Hand-torn outline on all four edges, as a % polygon so it scales with the page. */
export const tornPage = (() => {
  const wob = (t: number, seed: number) =>
    (Math.sin(t * 0.9 + seed) * 0.5 + Math.sin(t * 2.3 + seed * 2) * 0.3 + Math.sin(t * 5.1 + seed * 3) * 0.2 + 1) / 2;
  const pts: string[] = [];
  for (let i = 0; i <= 50; i++) pts.push(`${(i * 2).toFixed(1)}% ${(wob(i, 1.1) * 1.4).toFixed(2)}%`);
  for (let i = 1; i <= 40; i++) pts.push(`${(100 - wob(i, 2.4) * 1.1).toFixed(2)}% ${(i * 2.5).toFixed(1)}%`);
  for (let i = 50; i >= 0; i--) pts.push(`${(i * 2).toFixed(1)}% ${(100 - wob(i, 3.7) * 1.4).toFixed(2)}%`);
  for (let i = 39; i >= 1; i--) pts.push(`${(wob(i, 4.9) * 1.1).toFixed(2)}% ${(i * 2.5).toFixed(1)}%`);
  return `polygon(${pts.join(", ")})`;
})();

export const PAPER = "radial-gradient(120% 90% at 0% 0%, #fbf5e9 0%, #f3ead9 55%, #ebdfc9 100%)";
export const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .35 0 0 0 0 .27 0 0 0 0 .18 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.3'/%3E%3C/svg%3E\")";

interface EchoStoryProps {
  /** Index into the looks; null = closed. */
  index: number | null;
  onClose: () => void;
}

/** Words that surface one by one (blur to sharp), starting at `start` seconds. */
const Words: React.FC<{ text: string; start: number; step: number }> = ({ text, start, step }) => (
  <>
    {text.split(" ").map((w, i) => (
      <span key={i} className="echo-word inline-block" style={{ animationDelay: `${(start + i * step).toFixed(2)}s` }}>
        {w}
        {"\u00a0"}
      </span>
    ))}
  </>
);

const WORD_START = 1.7;
const WORD_STEP = 0.028;

export const EchoStory: React.FC<EchoStoryProps> = ({ index, onClose }) => {
  const [closing, setClosing] = useState(false);
  const open = index !== null;

  const close = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      onClose();
    }, 1050);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, closing]);

  if (index === null) return null;
  const look = echoDetails[index];
  const story = STORIES[index];
  if (!look || !story) return null;

  // running word offsets so the paragraphs read in sequence
  const counts = story.paragraphs.map((para) => para.split(" ").length);
  const paraStarts = counts.map(
    (_, i) => WORD_START + counts.slice(0, i).reduce((a, n) => a + n, 0) * WORD_STEP
  );
  const factsDelay = WORD_START + counts.reduce((a, n) => a + n, 0) * WORD_STEP + 0.3;

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 [perspective:1400px] sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${look.title}: the story`}
    >
      {/* the rest of the page: dimmed + blurred */}
      <div
        onClick={close}
        aria-hidden="true"
        className="absolute inset-0 bg-[#0c0b0a]/55 backdrop-blur-md transition-opacity duration-700"
        style={{ opacity: closing ? 0 : 1 }}
      />

      {/* torn paper page, hung from a steel pin: it swings down, settles and sways. drop-shadow lives outside the clip */}
      <div
        className={`relative w-full max-w-[1000px] ${closing ? "echo-story-out" : "echo-story-in"}`}
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
            className="grid gap-6 px-6 py-9 sm:px-10 md:grid-cols-[0.82fr_1fr] md:gap-10 md:px-14 md:py-12"
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

            {/* the look, as a pinned print */}
            <div className="relative mx-auto w-full max-w-[340px] self-start md:max-w-none">
              <div className="echo-story-print -rotate-2 bg-gradient-to-b from-[#fdf9ef] to-[#f5ecda] p-2.5 pb-8 shadow-[0_3px_10px_rgba(40,28,16,0.2),0_14px_30px_rgba(40,28,16,0.18)] ring-1 ring-[#3a3026]/10 sm:p-3 sm:pb-10">
                <div className="relative aspect-[0.78/1] w-full overflow-hidden bg-[#e0d6c8] ring-1 ring-black/10">
                  <Image
                    src={look.imageSrc}
                    alt={look.imageAlt}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 80vw, 420px"
                    className="object-cover"
                    style={{ objectPosition: "50% 15%" }}
                  />
                </div>
                <p className="font-allura allura-regular font-script font-cursive mt-3 text-center text-[26px] leading-none text-[#8a6a3b] sm:text-[30px]">
                  {story.sign}
                </p>
              </div>
            </div>

            {/* her story */}
            <div className="flex flex-col justify-center">
              <span className="nav-link-rise font-sans text-[11px] font-semibold tracking-[0.28em] text-[#7a6140] uppercase" style={{ animationDelay: "0.95s" }}>
                {look.subtitle}
              </span>
              <div className="mt-2 overflow-hidden pb-1">
                <h2 className="echo-story-title font-bodoni text-4xl leading-[0.95] tracking-[0.04em] text-[#14100c] uppercase sm:text-5xl">
                  {look.title}
                </h2>
              </div>
              <p
                className="echo-story-ink font-allura allura-regular font-script font-cursive mt-3 text-[28px] leading-tight text-[#8a6a3b] sm:text-[34px]"
              >
                &ldquo;{story.quote}&rdquo;
              </p>

              <div className="mt-4 space-y-3.5">
                {story.paragraphs.map((para, i) => (
                  <p
                    key={i}
                    className="font-serif text-[15px] leading-[1.75] text-[#2e2418] sm:text-[16.5px]"
                  >
                    <Words text={para} start={paraStarts[i]} step={WORD_STEP} />
                  </p>
                ))}
              </div>

              <dl
                className="nav-link-rise mt-6 grid gap-3 border-t border-[#1c1815]/15 pt-4 font-sans text-[12.5px] leading-snug text-[#2e2418] sm:grid-cols-2"
                style={{ animationDelay: `${factsDelay.toFixed(2)}s` }}
              >
                <div>
                  <dt className="mb-0.5 text-[10px] font-semibold tracking-[0.24em] text-[#7a6140] uppercase">Fabric</dt>
                  <dd>{look.fabric}</dd>
                </div>
                <div>
                  <dt className="mb-0.5 text-[10px] font-semibold tracking-[0.24em] text-[#7a6140] uppercase">Silhouette</dt>
                  <dd>{look.silhouette}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* steel pin holding the page up: stabs in when the page lands, pulls out when it is dismissed */}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 96"
          className={`pointer-events-none absolute -top-9 left-1/2 z-10 h-[78px] w-auto -translate-x-1/2 drop-shadow-[2px_4px_3px_rgba(40,28,16,0.4)] ${closing ? "echo-story-pin-out" : "echo-story-pin"}`}
        >
          <defs>
            <linearGradient id="storyPinSteel" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#5f6870" />
              <stop offset="0.45" stopColor="#f2f5f7" />
              <stop offset="1" stopColor="#7d868e" />
            </linearGradient>
            <radialGradient id="storyPinHead" cx="0.35" cy="0.3" r="0.8">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.5" stopColor="#c3cad0" />
              <stop offset="1" stopColor="#6c757d" />
            </radialGradient>
          </defs>
          <path d="M12 12 C7 28 17 42 11 58 C7 70 14 82 12 94" fill="none" stroke="url(#storyPinSteel)" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M12.6 14 C8 29 17.6 43 11.8 59" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="0.7" strokeLinecap="round" />
          <rect x="9.2" y="10" width="5.6" height="3.2" rx="1.2" fill="#8d969d" />
          <circle cx="12" cy="6.5" r="5.4" fill="url(#storyPinHead)" stroke="#5b646c" strokeWidth="0.8" />
          <circle cx="10.2" cy="4.8" r="1.5" fill="#fff" fillOpacity="0.85" />
        </svg>
      </div>
    </div>
  );
};
