/**
 * The Echo — chapter content for /echo.
 *
 * Admin-panel-ready: /echo renders EXCLUSIVELY from this object (via EchoStoryReader), so the
 * same shape can later be returned by the admin panel / an API route and nothing on the page has
 * to change. Every chapter carries the full page content (hero + The Beginning + The Unanswered +
 * The Echo), so switching chapters swaps content only — the layout never changes.
 *
 * Conventions (same as origin-content.ts):
 *  - Plain text fields are `string`.
 *  - Text that needs hard line breaks is `string[]` (one entry per line, rendered with <br/>).
 *  - Images are `{ src, alt }` so alt text is editable too.
 */

import {
  defaultOriginContent,
  type BeginningContent,
  type EchoChapterContent,
  type HeroContent,
  type ImageContent,
  type UnansweredContent,
} from "./origin-content";

export interface EchoStoryChapter {
  /** Anchor id, e.g. "chapter-2". */
  id: string;
  /** Display number, e.g. "02". */
  number: string;
  /** Short chapter name shown on the cards, e.g. "The Search". */
  title: string;
  /** Card thumbnail. */
  image: ImageContent;
  hero: HeroContent;
  beginning: BeginningContent;
  unanswered: UnansweredContent;
  echo: EchoChapterContent;
}

export interface EchoStoryContent {
  meta: { title: string; description: string };
  /** "More from" grid callout (one entry per line). */
  moreFromKicker: string[];
  chapters: EchoStoryChapter[];
}

const frame = "/images/story/photoframe.webp";
const branch = "/images/story/IvoryFloweringBranchCutout.webp";

export const defaultEchoStory: EchoStoryContent = {
  meta: {
    title: "The Echo — Maison D'Vine",
    description:
      "The Echo — the quiet life before the dream took shape. Moments, feelings, and unspoken desires that lived within.",
  },

  moreFromKicker: ["More from", "Stage 0 — The Echo"],

  chapters: [
    {
      id: "chapter-1",
      number: "01",
      title: "The Echo",
      image: {
        src: "/images/story/Golden%20Window%20Reverie.webp",
        alt: "A woman in a floral dress standing by a sunlit window",
      },
      hero: { ...defaultOriginContent.hero, title: "The Echo", chapterLabel: "Chapter 1" },
      beginning: { ...defaultOriginContent.beginning, frame },
      unanswered: defaultOriginContent.unanswered,
      echo: { ...defaultOriginContent.echo, branch },
    },

    {
      id: "chapter-2",
      number: "02",
      title: "The Search",
      image: {
        src: "/images/story/CrimsonGownAmongSunlitRuins.webp",
        alt: "A woman in a flowing crimson gown among sunlit stone ruins and flowers",
      },
      hero: {
        ...defaultOriginContent.hero,
        title: "The Search",
        chapterLabel: "Chapter 2",
        subtitle: ["I searched for a reflection", "that finally felt like mine."],
        sideNote: ["Looking,", "always", "looking."],
        bg: {
          src: "/images/story/CrimsonGownAmongSunlitRuins.webp",
          alt: "A woman in a flowing crimson gown among sunlit stone ruins",
        },
      },
      beginning: {
        ...defaultOriginContent.beginning,
        number: "01",
        kicker: "The Beginning",
        heading: [
          "I tried on versions",
          "of myself — some",
          "borrowed, some that",
          "were never mine.",
        ],
        paragraphs: [
          "I moved through rooms and seasons in dresses that were almost right, hoping one would finally introduce me to myself.",
          "Every hem and every colour was a question I didn't yet know how to ask out loud.",
        ],
        portrait: {
          src: "/images/story/Golden%20HourReadingNookOverlookingFlorence.webp",
          alt: "A woman reading in a sunlit room overlooking Florence",
        },
        frame,
        sideNote: ["Trying on", "who I could", "become."],
      },
      unanswered: {
        ...defaultOriginContent.unanswered,
        number: "02",
        kicker: "The Unanswered",
        heading: ["Every mirror asked", "something I", "couldn't answer."],
        paragraph:
          "The reflection looked right, and still I waited — for a feeling, not an outfit, to fit.",
        note: ["Still", "searching."],
        desktopBg: "/images/story/GoldenRuinsandRoseParchment.webp",
        mobileTop: {
          src: "/images/story/storyHero.webp",
          alt: "A woman in a floral dress watching the sunset over the city",
        },
        mobileBottom: "/images/story/VintageCathedralScrapbookCollage.webp",
      },
      echo: {
        ...defaultOriginContent.echo,
        number: "03",
        kicker: "The Echo",
        heading:
          "The search was never for a dress — it was for a self I could finally recognise.",
        paragraph:
          "Somewhere between the borrowed and the chosen, I began to hear my own voice growing louder than the room.",
        photo: {
          src: "/images/story/Golden%20Window%20Reverie.webp",
          alt: "A woman in a floral dress standing by a sunlit window",
        },
        note: ["Almost,", "almost", "there."],
        branch,
      },
    },

    {
      id: "chapter-3",
      number: "03",
      title: "The In Between",
      image: {
        src: "/images/story/Golden%20HourReadingNookOverlookingFlorence.webp",
        alt: "A woman reading in a sunlit room overlooking Florence",
      },
      hero: {
        ...defaultOriginContent.hero,
        title: "The In Between",
        chapterLabel: "Chapter 3",
        subtitle: ["In the quiet between", "who I was and who I'd be."],
        sideNote: ["A pause,", "a breath,", "a becoming."],
        bg: {
          src: "/images/story/Golden%20HourReadingNookOverlookingFlorence.webp",
          alt: "A woman reading in a sunlit room overlooking Florence",
        },
      },
      beginning: {
        ...defaultOriginContent.beginning,
        number: "01",
        kicker: "The Beginning",
        heading: ["Somewhere in the quiet,", "the noise", "began to settle."],
        paragraphs: [
          "Between the woman I had been and the one I was becoming, there was a stillness I had never let myself sit in.",
          "It was there, in that hush, that I started to hear what I actually wanted.",
        ],
        portrait: {
          src: "/images/story/storyHero.webp",
          alt: "A woman in a floral dress watching the sunset over the city",
        },
        frame,
        sideNote: ["Listening", "for the", "first time."],
      },
      unanswered: {
        ...defaultOriginContent.unanswered,
        number: "02",
        kicker: "The Unanswered",
        heading: ["Was I becoming,", "or simply", "waiting?"],
        paragraph:
          "The question no longer frightened me. I let it sit beside me like an old friend, and slowly it answered itself.",
        note: ["Becoming,", "not", "waiting."],
        desktopBg: "/images/story/GoldenRuinsandRoseParchment.webp",
        mobileTop: {
          src: "/images/story/VintageCathedralScrapbookCollage.webp",
          alt: "A vintage cathedral scrapbook collage",
        },
        mobileBottom: "/images/story/VintageCathedralScrapbookCollage.webp",
      },
      echo: {
        ...defaultOriginContent.echo,
        number: "03",
        kicker: "The Echo",
        heading: "The in-between is where I stopped performing and started living.",
        paragraph:
          "No longer dressing for the room — dressing for the life I was quietly building for myself.",
        photo: {
          src: "/images/story/Golden%20HourReadingNookOverlookingFlorence.webp",
          alt: "A woman reading in a sunlit room overlooking Florence",
        },
        note: ["Same place,", "new", "perspectives."],
        branch,
      },
    },

    {
      id: "chapter-4",
      number: "04",
      title: "The Realization",
      image: {
        src: "/images/story/VintageCathedralScrapbookCollage.webp",
        alt: "A vintage cathedral scrapbook collage",
      },
      hero: {
        ...defaultOriginContent.hero,
        title: "The Realization",
        chapterLabel: "Chapter 4",
        subtitle: ["The dress was never the point —", "I was."],
        sideNote: ["Coming", "home", "to myself."],
        bg: {
          src: "/images/story/VintageCathedralScrapbookCollage.webp",
          alt: "A vintage cathedral scrapbook collage",
        },
      },
      beginning: {
        ...defaultOriginContent.beginning,
        number: "01",
        kicker: "The Beginning",
        heading: ["It was never about", "being seen —", "it was about", "seeing myself."],
        paragraphs: [
          "Every dress I had ever loved was a page in a story I was still writing, pointing me gently back toward my own reflection.",
          "The moment I stopped looking for permission, the whole wardrobe made sense.",
        ],
        portrait: {
          src: "/images/story/CrimsonGownAmongSunlitRuins.webp",
          alt: "A woman in a flowing crimson gown among sunlit stone ruins and flowers",
        },
        frame,
        sideNote: ["The story", "was always", "mine."],
      },
      unanswered: {
        ...defaultOriginContent.unanswered,
        number: "02",
        kicker: "The Unanswered",
        heading: ["Nothing was", "missing.", "Nothing."],
        paragraph:
          "The answers had been waiting in the quiet all along — stitched into every choice I finally made for myself.",
        note: ["Answered,", "at last."],
        desktopBg: "/images/story/GoldenRuinsandRoseParchment.webp",
        mobileTop: {
          src: "/images/story/CrimsonGownAmongSunlitRuins.webp",
          alt: "A woman in a flowing crimson gown among sunlit stone ruins and flowers",
        },
        mobileBottom: "/images/story/VintageCathedralScrapbookCollage.webp",
      },
      echo: {
        ...defaultOriginContent.echo,
        number: "03",
        kicker: "The Echo",
        heading:
          "I finally wore the truth in daylight — and, for the first time, it fit.",
        paragraph:
          "Not just dresses, but stories. This is the one I chose to tell about myself.",
        photo: {
          src: "/images/story/storyHero.webp",
          alt: "A woman in a floral dress watching the sunset over the city",
        },
        note: ["Not just", "dresses,", "but stories."],
        branch,
      },
    },
  ],
};
