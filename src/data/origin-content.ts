/**
 * Origin page content — the single source of truth for every piece of copy on /origin.
 *
 * The page (src/app/origin/page.tsx) renders EXCLUSIVELY from this object, so the same
 * shape can later be returned by the admin panel / an API route and nothing on the page
 * has to change. Editing copy = editing this object.
 *
 * Conventions:
 *  - Plain text fields are `string`.
 *  - Text that needs hard line breaks is `string[]` (one entry per line, rendered with <br/>).
 *  - Images are `{ src, alt }` so alt text is editable too.
 */

/** A single line, or several lines that break exactly as authored. */
export type TextLines = string | string[];

export interface ImageContent {
  src: string;
  alt: string;
}

export interface HeroContent {
  eyebrow: string;
  stageLabel: string;
  title: string;
  chapterLabel: string;
  subtitle: TextLines;
  sideNote: string[];
  scrollLabel: string;
  /** Full-bleed background behind the hero. */
  bg: ImageContent;
}

export interface BeginningContent {
  number: string;
  kicker: string;
  heading: string[];
  paragraphs: string[];
  /** Portrait shown inside the hanging frame. */
  portrait: ImageContent;
  /** Decorative frame overlay. */
  frame: string;
  sideNote: string[];
}

export interface UnansweredContent {
  number: string;
  kicker: string;
  heading: string[];
  paragraph: string;
  note: string[];
  /** Wide parchment background (desktop only). */
  desktopBg: string;
  /** Top image on small screens. */
  mobileTop: ImageContent;
  /** Bottom collage on small screens. */
  mobileBottom: string;
}

export interface EchoChapterContent {
  number: string;
  kicker: string;
  heading: string;
  paragraph: string;
  cta: { label: string; href: string };
  photo: ImageContent;
  note: string[];
  /** Botanical branch cutout in the corner. */
  branch: string;
}

export interface NextChapterContent {
  heading: string[];
  prev: { label: string; href: string };
  next: { label: string; href: string; thumb: string };
  /** Decorative sepia branch illustration. */
  ornament: string;
}

export interface OriginContent {
  meta: { title: string; description: string };
  hero: HeroContent;
  beginning: BeginningContent;
  unanswered: UnansweredContent;
  echo: EchoChapterContent;
  nextChapter: NextChapterContent;
}

export const defaultOriginContent: OriginContent = {
  meta: {
    title: "Our Story — Maison D'Vine",
    description:
      "Discover the story behind Maison D'Vine: a belief in thoughtful dresses, honest craft, and the stories every woman carries.",
  },

  hero: {
    eyebrow: "The Story",
    stageLabel: "Stage 01",
    title: "The Origin",
    chapterLabel: "Chapter 0",
    subtitle: ["Before I knew what I wanted,", "I wore what I knew."],
    sideNote: ["A whispered", "beginning,", "every creation."],
    scrollLabel: "Scroll",
    bg: {
      src: "/images/story/storyHero.webp",
      alt: "A woman in a floral dress watching the sunset over the city",
    },
  },

  beginning: {
    number: "01",
    kicker: "The Beginning",
    heading: [
      "Before the dream,",
      "there was simply me —",
      "trying to find a place",
      "for myself in the world.",
    ],
    paragraphs: [
      "I wore what was already mine, what I could borrow, and what I believed might finally make me feel like the woman I wanted to be.",
      "There were days I dressed to fit in, days I dressed to feel braver, and days I dressed just to feel like me — even if just for a moment.",
    ],
    portrait: {
      src: "/images/story/Golden%20Window%20Reverie.webp",
      alt: "A woman in a floral dress standing by a sunlit window",
    },
    frame: "/images/story/photoframe.webp",
    sideNote: ["Different outfits,", "same girl", "searching for more."],
  },

  unanswered: {
    number: "02",
    kicker: "The Unanswered",
    heading: ["But with each one,", "something stayed", "unanswered."],
    paragraph:
      "They dressed me, but they never quite reached me. There was always a part of me waiting — untouched, unspoken.",
    note: ["Beautiful", "outfits.", "Unanswered", "questions."],
    desktopBg: "/images/story/GoldenRuinsandRoseParchment.webp",
    mobileTop: {
      src: "/images/story/CrimsonGownAmongSunlitRuins.webp",
      alt: "A woman in a flowing crimson gown among sunlit stone ruins and flowers",
    },
    mobileBottom: "/images/story/VintageCathedralScrapbookCollage.webp",
  },

  echo: {
    number: "03",
    kicker: "The Echo",
    heading:
      "Echo is that beginning — the quiet life before I knew I was looking for something more.",
    paragraph:
      "It's a collection of moments, feelings, and unspoken desires that lived within me, long before the dream took shape.",
    cta: { label: "Explore the Echo Collection", href: "/#story" },
    photo: {
      src: "/images/story/Golden%20HourReadingNookOverlookingFlorence.webp",
      alt: "A woman reading in a sunlit room overlooking Florence",
    },
    note: ["Same place,", "new", "perspectives."],
    branch: "/images/story/IvoryFloweringBranchCutout.webp",
  },

  nextChapter: {
    heading: ["Some chapters don't end.", "They just lead you to the next."],
    prev: { label: "Previous", href: "#unanswered-title" },
    next: {
      label: "Continue to Chapter 1",
      href: "/echo",
      thumb: "/images/story/CrimsonGownAmongSunlitRuins.webp",
    },
    ornament: "/images/story/SepiaWatercolorBranchIllustration.webp",
  },
};
