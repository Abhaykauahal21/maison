"use client";

import React from "react";
import Image from "next/image";
import { INDIA_PIN_NAMES } from "@/components/india/IndiaPinTag";

export interface CityStory {
  /** Three photos: the big one, then the two small prints underneath. */
  photos: [string, string, string];
  name: string;
  role: string;
  quote: string;
}

/**
 * The story shown on the right of the India map for each pin (same order as INDIA_PIN_NAMES).
 * PLACEHOLDER COPY: the photos are existing look shots and the names / roles / quotes are stand-ins.
 * Replace them with each city's real customer, photo and words.
 */
export const CITY_STORIES: CityStory[] = [
  {
    photos: ["/images/solace.webp", "/images/daydream.webp", "/images/reverie.webp"],
    name: "Simran K.",
    role: "Fashion student",
    quote: "I wore it to my first exhibition, and for once I did not hide at the edge of the room.",
  },
  {
    photos: ["/images/daydream.webp", "/images/awakening.webp", "/images/longing.webp"],
    name: "Ira T.",
    role: "Travel writer",
    quote: "It moved like the hills at dusk: quiet, then suddenly everything at once.",
  },
  {
    photos: ["/images/longing.webp", "/images/solace.webp", "/images/daydream.webp"],
    name: "Zoya A.",
    role: "Poet",
    quote: "Some dresses are worn. This one was remembered, long before I put it on.",
  },
  {
    photos: ["/images/hero-single-girl.webp", "/images/solace.webp", "/images/longing.webp"],
    name: "Mehak S.",
    role: "Choreographer",
    quote: "It turned the air into a conversation. Every turn I took, the dress finished the sentence.",
  },
  {
    photos: ["/images/reverie.webp", "/images/longing.webp", "/images/awakening.webp"],
    name: "Anushka R.",
    role: "Textile designer",
    quote: "I notice every seam for a living, and I could not find a single one I wanted to change.",
  },
  {
    photos: ["/images/awakening.webp", "/images/reverie.webp", "/images/solace.webp"],
    name: "Pooja M.",
    role: "Doctor",
    quote: "After long shifts, this is the one thing that makes me feel like myself again.",
  },
  {
    photos: ["/images/solace.webp", "/images/longing.webp", "/images/hero-single-girl.webp"],
    name: "Kavya D.",
    role: "Entrepreneur",
    quote: "I wore it to close my biggest deal. The dress did not ask for permission, and neither did I.",
  },
  {
    photos: ["/images/longing.webp", "/images/awakening.webp", "/images/solace.webp"],
    name: "Shreya R.",
    role: "Film editor",
    quote: "It has the pacing of a good cut: a pause, a swell, and then it simply lets you be seen.",
  },
  {
    photos: ["/images/daydream.webp", "/images/reverie.webp", "/images/longing.webp"],
    name: "Nisha V.",
    role: "Architect",
    quote: "The drape is pure structure and pure softness. I have not stopped studying it.",
  },
  {
    photos: ["/images/awakening.webp", "/images/daydream.webp", "/images/solace.webp"],
    name: "Divya N.",
    role: "Classical singer",
    quote: "I sang in it, and the fabric breathed with every note. That is rare.",
  },
];

const Print: React.FC<{
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  sizes: string;
}> = ({ src, alt, className = "", style, sizes }) => (
  <div
    className={`absolute bg-[#faf5ea] p-[1.7%] shadow-[0_8px_18px_rgba(40,24,10,0.28)] ${className}`}
    style={style}
  >
    <div className="relative h-full w-full overflow-hidden">
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" style={{ objectPosition: "50% 20%" }} />
    </div>
  </div>
);

/** Torn outline for the paper plate (kept the same every render so server and client markup match). */
const PLATE_CLIP =
  "polygon(0% 6%, 3% 3%, 7% 5%, 12% 1%, 18% 4%, 25% 1%, 32% 4%, 40% 0%, 48% 3%, 56% 1%, 64% 4%, 72% 1%, 80% 3%, 88% 0%, 95% 3%, 100% 1%, 99% 20%, 100% 38%, 98.5% 55%, 100% 72%, 99% 90%, 100% 99%, 94% 96%, 87% 99%, 80% 96%, 72% 100%, 64% 97%, 56% 100%, 48% 96%, 40% 99%, 32% 96%, 24% 100%, 16% 96%, 8% 99%, 0% 96%, 1.5% 75%, 0% 52%, 1.5% 30%)";

/**
 * One city's story, laid out like the original collage (big print, torn paper plate, two small prints),
 * but live: every piece drops in with its own motion each time a different pin is chosen.
 */
export const IndiaStoryCard: React.FC<{ index: number; onClose: () => void }> = ({ index, onClose }) => {
  const story = CITY_STORIES[index];
  const city = INDIA_PIN_NAMES[index]?.name ?? "";
  if (!story) return null;
  return (
    <div className="relative w-full" style={{ aspectRatio: "1047 / 1503" }}>
      <Print
        src={story.photos[0]}
        alt={`${story.name}, ${city}`}
        sizes="26vw"
        className="isc-photo"
        style={{ left: "11.4%", top: "2.4%", width: "72.5%", height: "71.4%" }}
      />

      {/* washi-tape label with the city */}
      <span
        className="isc-tape absolute z-20 flex items-center justify-center bg-[#e6c98f]/90 px-[3.2%] py-[0.9%] font-allura text-[clamp(18px,2.4vw,40px)] leading-none text-[#3a2a1a] shadow-[0_3px_8px_rgba(40,24,10,0.25)]"
        style={{ left: "6%", top: "1.2%", rotate: "-4deg", transformOrigin: "0% 50%" }}
      >
        {city}
      </span>

      {/* torn paper plate */}
      <div
        className="isc-plate absolute z-10"
        style={{ left: "36%", top: "45%", width: "60%", height: "29.5%", filter: "drop-shadow(0 8px 14px rgba(40,24,10,0.3))" }}
      >
        <div
          className="absolute inset-0 flex flex-col justify-center bg-[#f6efe0] px-[7%] py-[4%]"
          style={{ clipPath: PLATE_CLIP }}
        >
          <span className="isc-text font-bodoni text-[clamp(15px,1.75vw,30px)] leading-none tracking-[0.04em] text-[#14100c] uppercase" style={{ animationDelay: "0.7s" }}>
            {story.name}
          </span>
          <span className="isc-text mt-[1.5%] font-serif text-[clamp(10px,1vw,17px)] text-[#3a3027]" style={{ animationDelay: "0.8s" }}>
            {story.role}
          </span>
          <span className="isc-rule my-[3%] block h-px w-[34%] origin-left bg-[#3a3027]/70" />
          <p className="isc-text font-serif text-[clamp(10px,0.98vw,16px)] leading-[1.45] text-[#2a2118] italic" style={{ animationDelay: "0.95s" }}>
            &ldquo;{story.quote}&rdquo;
          </p>
        </div>
      </div>

      <Print
        src={story.photos[1]}
        alt=""
        sizes="14vw"
        className="isc-small"
        style={{ left: "12.8%", top: "75.6%", width: "39.5%", height: "20%", ["--d" as string]: "0.55s", ["--r" as string]: "-2.5deg" }}
      />
      <Print
        src={story.photos[2]}
        alt=""
        sizes="14vw"
        className="isc-small"
        style={{ left: "54%", top: "75.6%", width: "34%", height: "20%", ["--d" as string]: "0.72s", ["--r" as string]: "2deg" }}
      />

      <button
        type="button"
        onClick={onClose}
        aria-label="Back to the first story"
        className="absolute top-[0.5%] right-[7%] z-30 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#14100c]/70 text-[#f4efe8] backdrop-blur-sm transition-transform duration-300 hover:rotate-90 hover:bg-[#14100c]"
      >
        <span aria-hidden="true" className="text-lg leading-none">&times;</span>
      </button>
    </div>
  );
};
