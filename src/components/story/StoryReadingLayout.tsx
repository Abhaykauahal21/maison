"use client";

import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/footer";
import { StoryFX } from "@/components/story/StoryFX";
import { StoryHero } from "@/components/story/StoryHero";
import { StoryNextChapter, type ChapterCard, type StoryNav } from "@/components/story/StoryNextChapter";
import { Lines } from "@/components/story/StoryLines";
import type { OriginContent } from "@/data/origin-content";
import { tornBottomPaperClip, tornPaperClip } from "@/lib/torn-paper";

export type { ChapterCard, StoryNav };

interface StoryReadingLayoutProps {
  content: OriginContent;
  /** Optional "More from" chapter cards rendered at the very end. */
  chapterCards?: ChapterCard[];
  /** Callout for the chapter-cards grid (one entry per line). */
  moreFromKicker?: string[];
  /** Changing this remounts the animated story layer so reveals replay on chapter change. */
  chapterKey?: string | number;
  /** Play the one-time cinematic intro (letterbox + dark hero push-in). Off on chapter swaps. */
  intro?: boolean;
  nav?: StoryNav;
  /** Index of the chapter currently shown (highlights the matching card). */
  activeChapterIndex?: number;
}

/** Small numbered tag + kicker that opens every story movement (same mark as the rest of the site). */
const MovementMark: React.FC<{ number: string; kicker: string; center?: boolean }> = ({
  number,
  kicker,
  center,
}) => (
  <div data-fx="rise" className={`flex items-center gap-4 ${center ? "justify-center" : ""}`}>
    <span className="flex h-[22px] w-[22px] items-center justify-center border border-[#3a3026]/45 [font-family:Arial,Helvetica,sans-serif] text-[8px] tracking-[0.04em] text-[#302820] sm:h-6 sm:w-6 sm:text-[9px]">
      {number}
    </span>
    <span className="[font-family:Arial,Helvetica,sans-serif] text-[8px] font-semibold tracking-[0.23em] text-[#51463c] uppercase sm:text-[10px]">
      {kicker}
    </span>
  </div>
);

/** Book-like body copy: comfortable measure, generous leading, drop cap on the opening line. */
const bodyText =
  "mt-7 max-w-[640px] font-serif text-[clamp(16px,1.35vw,19px)] leading-[1.85] text-[#463c32] sm:mt-9";
const dropCap =
  "first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:font-serif first-letter:text-[clamp(46px,5vw,68px)] first-letter:leading-[0.76] first-letter:text-[#8a6a3b]";

/**
 * The reading story layout used by /echo. The cinematic hero (big image + variable copy) is
 * shared with the editorial layout; everything below it is a single-column "manuscript" built
 * for reading a written story: an opening drop cap, quiet serif body text at a comfortable
 * measure, pull-quote interludes, matted photo plates with script captions, and one slow
 * picture band to breathe between movements.
 */
export const StoryReadingLayout: React.FC<StoryReadingLayoutProps> = ({
  content,
  chapterCards,
  moreFromKicker,
  chapterKey,
  intro,
  nav,
  activeChapterIndex,
}) => {
  const { hero, beginning, unanswered, echo, nextChapter } = content;

  return (
    <main className="story-fx relative min-h-screen w-full max-w-full min-w-0 overflow-x-clip bg-[#0e0d0c]">
      <Navbar />
      <Fragment key={chapterKey ?? "story"}>
      <StoryFX intro={intro} />
      <StoryHero hero={hero} />

      {/* ---- Movement I: The Beginning — the story opens on the page ---- */}
      <section
        aria-labelledby="beginning-title"
        className="relative isolate z-40 -mt-4 overflow-hidden bg-[#f3ead9] text-[#211b16] md:-mt-6 lg:-mt-8"
        style={{ clipPath: tornPaperClip }}
      >
        <Image
          src="/images/echo-bg-mobile.webp"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="pointer-events-none -z-20 object-fill"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[#f5edde]/45"
        />

        <div className="relative z-10 mx-auto max-w-[780px] px-7 pt-20 pb-16 sm:px-12 sm:pt-24 md:pt-28 md:pb-24">
          <MovementMark number={beginning.number} kicker={beginning.kicker} />

          <h2
            id="beginning-title"
            data-fx="words"
            className="mt-5 max-w-[650px] font-serif text-[clamp(29px,3.9vw,54px)] leading-[1.1] font-normal tracking-[-0.03em] text-[#201b17] italic sm:mt-6"
          >
            <Lines value={beginning.heading} />
          </h2>

          <span
            aria-hidden="true"
            data-fx="line"
            className="mt-6 block h-px w-16 bg-[#8a6a3b]/60 sm:w-24"
          />

          <div className={bodyText}>
            {beginning.paragraphs.map((paragraph, i) => (
              <p
                key={i}
                data-fx="rise"
                data-delay={i === 0 ? "0.15" : undefined}
                className={i > 0 ? "mt-6 sm:mt-7" : dropCap}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <figure
            data-slide="right"
            data-dist="160"
            className="relative mx-auto mt-12 w-full max-w-[520px] sm:mt-16"
          >
            <div
              data-fx="mask"
              data-scrub-img
              className="relative aspect-[0.92/1] overflow-hidden border-[10px] border-[#fbf4e7] bg-[#e8d3b7] shadow-[0_22px_42px_rgba(48,33,18,0.22)] sm:border-[14px]"
            >
              <Image
                src={beginning.portrait.src}
                alt={beginning.portrait.alt}
                fill
                sizes="(max-width: 767px) 90vw, 520px"
                className="object-cover object-center"
              />
            </div>
            <figcaption
              data-fx="rise"
              data-delay="0.2"
              className="font-allura mx-auto mt-5 w-fit max-w-[240px] -rotate-[2deg] text-center text-[clamp(23px,2.1vw,31px)] leading-[1.2] text-[#55483a]/90"
            >
              <Lines value={beginning.sideNote} />
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ---- Movement II: The Unanswered — the question, centred like a pull-quote ---- */}
      <section
        aria-labelledby="unanswered-title"
        className="relative z-30 -mt-10 w-full overflow-hidden bg-[#efe4d0] text-[#211b16] md:-mt-14 lg:-mt-16"
        style={{ clipPath: tornBottomPaperClip }}
      >
        <div className="relative z-10 mx-auto max-w-[880px] px-7 pt-20 text-center sm:px-12 sm:pt-24 md:pt-28">
          <MovementMark number={unanswered.number} kicker={unanswered.kicker} center />

          <h2
            id="unanswered-title"
            data-fx="words"
            className="mx-auto mt-6 max-w-[740px] font-serif text-[clamp(30px,4.3vw,58px)] leading-[1.12] font-normal tracking-[-0.03em] text-[#201b17] italic"
          >
            <Lines value={unanswered.heading} />
          </h2>

          <span
            aria-hidden="true"
            data-fx="line"
            className="mx-auto mt-7 block h-px w-20 bg-[#8a6a3b]/60"
          />

          <p
            data-fx="rise"
            data-delay="0.25"
            className="mx-auto mt-8 max-w-[620px] font-serif text-[clamp(16px,1.35vw,19px)] leading-[1.85] text-[#463c32] sm:mt-10"
          >
            {unanswered.paragraph}
          </p>

          <p
            data-fx="rise"
            data-delay="0.4"
            className="font-allura mx-auto mt-9 w-fit max-w-[300px] -rotate-[1.5deg] text-center text-[clamp(26px,2.6vw,38px)] leading-[1.2] text-[#55483a]/85"
          >
            <Lines value={unanswered.note} />
          </p>
        </div>

        {/* the story pauses on a picture: one wide, slow band before the last movement */}
        <div data-scrub-img className="relative mt-14 h-[clamp(220px,30vw,420px)] w-full overflow-hidden sm:mt-16">
          <div className="absolute inset-0 md:hidden">
            <Image
              src={unanswered.mobileTop.src}
              alt={unanswered.mobileTop.alt}
              fill
              sizes="100vw"
              className="object-cover object-[38%_center]"
            />
          </div>
          <div className="absolute inset-0 hidden md:block">
            <Image
              src={unanswered.desktopBg}
              alt=""
              aria-hidden="true"
              fill
              sizes="100vw"
              className="object-cover object-[center_40%]"
            />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(239,228,208,0.9)_0%,rgba(239,228,208,0)_24%,rgba(239,228,208,0)_68%,rgba(240,222,198,0.75)_100%)]"
          />
        </div>
      </section>

      {/* ---- Movement III: The Echo — the story closes and hands the reader onward ---- */}
      <section
        aria-labelledby="echo-title"
        className="relative isolate z-20 -mt-8 overflow-hidden bg-[#F0DEC6] text-[#211b16] md:-mt-12 lg:-mt-14"
      >
        <Image
          src={echo.branch}
          alt=""
          aria-hidden="true"
          width={340}
          height={640}
          sizes="(max-width: 767px) 32vw, 15vw"
          data-parallax="0.14"
          className="pointer-events-none absolute right-[-6%] bottom-2 z-0 w-[32%] rotate-[-7deg] object-contain opacity-90 drop-shadow-[0_8px_8px_rgba(48,33,18,0.2)] sm:w-[24%] md:right-[2%] md:bottom-[-2%] md:w-[15%]"
        />

        <div className="relative z-10 mx-auto max-w-[780px] px-7 pt-20 pb-20 sm:px-12 sm:pt-24 md:pt-28 md:pb-28">
          <MovementMark number={echo.number} kicker={echo.kicker} />

          <h2
            id="echo-title"
            data-fx="words"
            className="mt-5 max-w-[660px] font-serif text-[clamp(29px,3.8vw,52px)] leading-[1.12] font-normal tracking-[-0.03em] text-[#201b17] italic sm:mt-6"
          >
            {echo.heading}
          </h2>

          <span
            aria-hidden="true"
            data-fx="line"
            className="mt-6 block h-px w-16 bg-[#8a6a3b]/60 sm:w-24"
          />

          <p
            data-scrub-words
            className="mt-7 max-w-[640px] font-serif text-[clamp(16px,1.35vw,19px)] leading-[1.85] text-[#463c32] sm:mt-9"
          >
            {echo.paragraph}
          </p>

          <figure className="relative mx-auto mt-14 w-full max-w-[500px] sm:mt-16">
            <div
              data-fx="mask"
              data-scrub-img
              className="relative aspect-[0.95/1] overflow-hidden border-[10px] border-[#fbf4e7] bg-[#e8d3b7] shadow-[0_22px_42px_rgba(48,33,18,0.22)] sm:border-[14px]"
            >
              <Image
                src={echo.photo.src}
                alt={echo.photo.alt}
                fill
                sizes="(max-width: 767px) 90vw, 500px"
                className="object-cover object-center"
              />
            </div>
            <p
              data-fx="rise"
              data-delay="0.2"
              className="font-allura absolute -bottom-7 right-1 w-[clamp(132px,18vw,182px)] -rotate-3 border border-[#d8c8ad] bg-[#f7f0e2]/95 px-4 py-4 text-center text-[clamp(21px,1.9vw,27px)] leading-[1.15] text-[#55483a]/90 shadow-[0_8px_18px_rgba(48,33,18,0.14)] sm:right-[-20px] sm:py-5"
            >
              <Lines value={echo.note} />
            </p>
          </figure>

          <div className="mt-16 text-center sm:mt-20">
            <Link
              href={echo.cta.href}
              data-fx="rise"
              className="group inline-flex min-h-12 items-center gap-5 bg-[#211b18] px-7 py-3 font-sans text-[9px] font-medium tracking-[0.2em] text-[#f8f2e8] uppercase transition-colors hover:bg-[#41352b] sm:px-8 sm:text-[10px]"
            >
              <span>{echo.cta.label}</span>
              <span
                aria-hidden="true"
                className="text-base leading-none transition-transform group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </Link>
          </div>
        </div>
      </section>

      <StoryNextChapter
        nextChapter={nextChapter}
        chapterCards={chapterCards}
        moreFromKicker={moreFromKicker}
        nav={nav}
        activeChapterIndex={activeChapterIndex}
      />
      </Fragment>
      <Footer />
    </main>
  );
};
