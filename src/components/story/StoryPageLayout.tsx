"use client";

import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/footer";
import { StoryFX } from "@/components/story/StoryFX";
import type { ImageContent, OriginContent, TextLines } from "@/data/origin-content";
import { tornBottomPaperClip, tornPaperClip } from "@/lib/torn-paper";

/** Renders authored text: a string, or an array of lines that break exactly as authored. */
const Lines: React.FC<{ value: TextLines }> = ({ value }) => {
  const lines = Array.isArray(value) ? value : [value];
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );
};

export interface ChapterCard {
  id: string;
  number: string;
  title: string;
  image: ImageContent;
}

/** Interactive chapter controls. When present, nav renders as buttons instead of links. */
export interface StoryNav {
  onPrev?: () => void;
  onNext?: () => void;
  /** Switch to a chapter by index (used by the "More from" cards). */
  onSelectChapter?: (index: number) => void;
}

interface StoryPageLayoutProps {
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

/**
 * The full editorial story layout used by /origin and /echo. Renders exclusively from `content`,
 * so the two pages share one design and differ only by their content (and optional chapter cards).
 * In chaptered mode (nav present) the story layer is keyed by `chapterKey` so it remounts — the
 * design stays identical, only the content (and its entrance animation) changes.
 */
export const StoryPageLayout: React.FC<StoryPageLayoutProps> = ({
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
      <section
        id="story"
        aria-labelledby="story-title"
        className="relative isolate flex h-[100svh] max-h-[1100px] min-h-[720px] items-center overflow-hidden bg-[#17100d] text-[#f8f2e8]"
      >
        <Link
          href="/"
          className="absolute top-[76px] left-7 z-30 inline-flex min-h-10 items-center gap-2 border border-[#f1d5a4]/65 bg-[#17100d]/35 px-4 py-2 font-sans text-[9px] font-semibold tracking-[0.18em] text-[#fffaf1] uppercase backdrop-blur-sm transition-colors hover:border-[#f1d5a4] hover:bg-[#f1d5a4]/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f1d5a4] sm:left-12 sm:text-[10px] lg:left-[5.7vw]"
        >
          <span aria-hidden="true" className="text-base leading-none">
            &larr;
          </span>
          Back to Home
        </Link>

        <div data-hero-bg className="pointer-events-none absolute inset-0 -z-20">
          <Image
            src={hero.bg.src}
            alt={hero.bg.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[57%_center]"
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(12,9,8,0.9)_0%,rgba(12,9,8,0.72)_28%,rgba(12,9,8,0.2)_58%,rgba(12,9,8,0.05)_100%),linear-gradient(0deg,rgba(12,9,8,0.42)_0%,transparent_35%)]"
        />

        <div aria-hidden="true" className="fx-flare -z-10" />
        <div
          data-hero-veil
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[#0c0908] opacity-0"
        />

        <div className="relative mx-auto w-full max-w-[1600px] px-7 pt-16 sm:px-12 lg:px-[5.7vw]">
          <div data-hero-copy className="max-w-[660px] will-change-transform">
            <p
              data-fx="rise"
              data-delay="1.4"
              className="font-sans text-[10px] font-semibold tracking-[0.34em] text-[#f1d5a4] uppercase sm:text-[12px]"
            >
              {hero.eyebrow}
            </p>
            <p
              data-fx="rise"
              data-delay="1.6"
              className="mt-5 font-sans text-[10px] font-medium tracking-[0.3em] text-white/80 uppercase sm:mt-7 sm:text-[12px]"
            >
              {hero.stageLabel}
            </p>
            <h1
              id="story-title"
              data-fx="chars"
              data-delay="1.7"
              className="font-bodoni mt-3 text-[clamp(52px,9.6vw,132px)] leading-[0.9] font-normal tracking-[0.015em] text-[#fffaf1] uppercase"
            >
              {hero.title}
            </h1>

            <div data-fx="rise" data-delay="2.3" className="mt-7 flex items-center gap-5 sm:mt-9">
              <span className="font-allura text-[25px] text-[#f1d5a4] sm:text-[32px]">
                {hero.chapterLabel}
              </span>
              <span
                aria-hidden="true"
                data-fx="line"
                data-delay="2.6"
                className="h-px w-20 bg-[#f1d5a4]/70 sm:w-32"
              />
            </div>

            <p
              data-fx="rise"
              data-delay="2.5"
              className="mt-7 max-w-[530px] font-serif text-[clamp(19px,2.3vw,30px)] leading-[1.45] text-white/95 sm:mt-9"
            >
              <Lines value={hero.subtitle} />
            </p>
          </div>
        </div>

        <p
          data-parallax="0.18"
          data-fx="rise"
          data-delay="2.8"
          className="font-allura pointer-events-none absolute top-[25%] right-[8%] hidden -rotate-6 text-right text-[clamp(25px,3.4vw,46px)] leading-[1.25] text-[#3b3028]/90 lg:block"
        >
          <Lines value={hero.sideNote} />
        </p>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[5.5%] bottom-8 hidden flex-col items-center gap-3 text-white/80 sm:flex"
        >
          <span className="font-sans text-[9px] tracking-[0.24em] uppercase">
            {hero.scrollLabel}
          </span>
          <span className="h-14 w-px bg-white/65" />
        </div>
      </section>

      <section
        aria-labelledby="beginning-title"
        className="relative isolate z-40 -mt-4 min-h-[980px] overflow-hidden bg-[#f3ead9] text-[#211b16] md:-mt-6 md:aspect-[2.08/1] md:max-h-[820px] md:min-h-[380px] lg:-mt-8"
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

        <div className="relative z-10 mx-auto grid min-h-[980px] max-w-[1700px] grid-rows-[auto_1fr] px-7 pt-20 pb-12 sm:px-12 md:absolute md:inset-0 md:min-h-0 md:grid-cols-[48%_52%] md:grid-rows-1 md:items-center md:px-[7%] md:pt-8 md:pb-4">
          <div data-slide="left" className="relative z-20 max-w-[560px] self-start md:self-center">
            <div data-fx="rise" className="flex items-center gap-4">
              <span className="flex h-[22px] w-[22px] items-center justify-center border border-[#3a3026]/45 [font-family:Arial,Helvetica,sans-serif] text-[8px] tracking-[0.04em] text-[#302820] sm:h-6 sm:w-6 sm:text-[9px]">
                {beginning.number}
              </span>
              <span className="[font-family:Arial,Helvetica,sans-serif] text-[8px] font-semibold tracking-[0.23em] text-[#51463c] uppercase sm:text-[10px]">
                {beginning.kicker}
              </span>
            </div>

            <h2
              id="beginning-title"
              data-fx="words"
              className="mt-3 max-w-[590px] font-serif text-[clamp(29px,3.55vw,52px)] leading-[1.06] font-normal tracking-[-0.035em] text-[#201b17] sm:mt-4"
            >
              <Lines value={beginning.heading} />
            </h2>

            <span
              aria-hidden="true"
              data-fx="line"
              className="mt-3 block h-px w-11 bg-[#8a6a3b]/60 sm:mt-4 sm:w-16"
            />

            <div
              data-fx="rise"
              data-delay="0.35"
              className="mt-3 max-w-[530px] space-y-3 [font-family:Arial,Helvetica,sans-serif] text-[13px] leading-[1.35] text-[#51483f] sm:mt-4 sm:space-y-4 sm:text-[15px] md:text-[clamp(13px,1.55vw,18px)]"
            >
              {beginning.paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <span
              aria-hidden="true"
              data-fx="line"
              className="mt-5 block h-px w-16 bg-[#8a6a3b]/45 sm:mt-6 sm:w-20"
            />
          </div>

          <div
            data-slide="right"
            className="relative z-10 mt-2 flex min-h-[470px] w-full translate-x-2 items-center justify-center self-center sm:min-h-[590px] md:absolute md:inset-y-0 md:right-[1%] md:mt-0 md:min-h-0 md:w-[55%]"
          >
            <div
              data-fx="zoom"
              className="relative aspect-square w-full max-w-[590px] drop-shadow-[0_18px_18px_rgba(48,33,18,0.18)] md:size-[min(96%,46vw)] md:max-w-none"
            >
              <div
                data-scrub-img
                className="absolute inset-0 overflow-hidden"
                style={{
                  clipPath: "polygon(31% 5.5%, 87% 8.2%, 84% 76%, 23% 75.5%)",
                }}
              >
                <Image
                  src={beginning.portrait.src}
                  alt={beginning.portrait.alt}
                  fill
                  sizes="(max-width: 767px) 100vw, 55vw"
                  className="object-cover object-center"
                />
              </div>
              <Image
                src={beginning.frame}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 767px) 100vw, 55vw"
                className="pointer-events-none object-contain"
              />
            </div>
          </div>

          <p
            data-parallax="0.12"
            data-fx="rise"
            data-delay="0.3"
            className="font-allura pointer-events-none absolute right-[7%] bottom-[29%] z-20 hidden -rotate-6 text-right text-[clamp(22px,2vw,34px)] leading-[1.25] text-[#55483a]/80 lg:block"
          >
            <Lines value={beginning.sideNote} />
          </p>
        </div>
      </section>

      <section
        aria-labelledby="unanswered-title"
        className="relative z-30 -mt-10 min-h-[850px] w-full overflow-hidden bg-[#f3ead9] text-[#211b16] md:-mt-14 md:aspect-[1.88/1] md:min-h-[440px] lg:-mt-16"
        style={{ clipPath: tornBottomPaperClip }}
      >
        <div data-scrub-img className="absolute inset-0 hidden overflow-hidden md:block">
          <Image
            src={unanswered.desktopBg}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-x-0 top-0 h-[46%] md:hidden">
          <Image
            src={unanswered.mobileTop.src}
            alt={unanswered.mobileTop.alt}
            fill
            sizes="100vw"
            className="object-cover object-[34%_center]"
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[56%] md:hidden">
          <Image
            src={unanswered.mobileBottom}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 767px) 100vw, 46vw"
            className="object-contain mix-blend-lighten"
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 flex min-h-[56%] flex-col justify-center px-7 py-8 sm:px-12 md:inset-y-0 md:right-0 md:left-auto md:min-h-0 md:w-[46%] md:pr-[5%] md:pl-[11%] md:py-6">
          <div data-slide="right" data-dist="220" className="w-full max-w-[520px]">
            <div data-fx="rise" className="flex items-center gap-4">
              <span className="flex h-[22px] w-[22px] items-center justify-center border border-[#3a3026]/45 [font-family:Arial,Helvetica,sans-serif] text-[8px] tracking-[0.04em] text-[#302820] sm:h-6 sm:w-6 sm:text-[9px]">
                {unanswered.number}
              </span>
              <span className="[font-family:Arial,Helvetica,sans-serif] text-[8px] font-semibold tracking-[0.23em] text-[#51463c] uppercase sm:text-[10px]">
                {unanswered.kicker}
              </span>
            </div>

            <h2
              id="unanswered-title"
              data-fx="words"
              className="mt-4 max-w-[480px] font-serif text-[clamp(33px,3.5vw,52px)] leading-[1.08] font-normal tracking-[-0.035em] text-[#201b17] sm:mt-5"
            >
              <Lines value={unanswered.heading} />
            </h2>

            <p
              data-fx="rise"
              data-delay="0.35"
              className="mt-5 max-w-[490px] [font-family:Arial,Helvetica,sans-serif] text-[14px] leading-[1.55] text-[#716b61] sm:mt-6 sm:text-[17px] md:text-[clamp(13px,1.55vw,19px)]"
            >
              {unanswered.paragraph}
            </p>

            <span
              aria-hidden="true"
              data-fx="line"
              className="mt-6 block h-px w-16 bg-[#8a6a3b]/55 sm:mt-7"
            />

            <p
              data-fx="rise"
              data-delay="0.5"
              className="font-allura mt-5 max-w-[260px] -rotate-6 text-[clamp(25px,2.3vw,38px)] leading-[1.18] text-[#55483a]/80 sm:mt-6"
            >
              <Lines value={unanswered.note} />
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="echo-title"
        className="relative isolate z-20 -mt-8 min-h-[1050px] overflow-hidden bg-[#F0DEC6] text-[#211b16] md:-mt-12 md:aspect-[2.08/1] md:max-h-[820px] md:min-h-[480px] lg:-mt-14"
      >
        <div className="relative z-10 mx-auto grid min-h-[1050px] max-w-[1700px] grid-rows-[auto_1fr] px-7 pt-24 pb-14 sm:px-12 md:absolute md:inset-0 md:min-h-0 md:grid-cols-[48%_52%] md:grid-rows-1 md:items-center md:px-[7%] md:pt-9 md:pb-6">
          <div
            data-slide="left"
            data-dist="240"
            className="relative z-20 max-w-[560px] self-start md:self-center"
          >
            <div data-fx="rise" className="flex items-center gap-4">
              <span className="flex h-[22px] w-[22px] items-center justify-center border border-[#3a3026]/45 [font-family:Arial,Helvetica,sans-serif] text-[8px] tracking-[0.04em] text-[#302820] sm:h-6 sm:w-6 sm:text-[9px]">
                {echo.number}
              </span>
              <span className="[font-family:Arial,Helvetica,sans-serif] text-[8px] font-semibold tracking-[0.23em] text-[#51463c] uppercase sm:text-[10px]">
                {echo.kicker}
              </span>
            </div>

            <h2
              id="echo-title"
              data-fx="words"
              className="mt-4 max-w-[590px] font-serif text-[clamp(32px,3.5vw,52px)] leading-[1.06] font-normal tracking-[-0.035em] text-[#201b17] sm:mt-5"
            >
              {echo.heading}
            </h2>

            <p
              data-scrub-words
              className="mt-5 max-w-[500px] [font-family:Arial,Helvetica,sans-serif] text-[14px] leading-[1.5] text-[#716b61] sm:mt-6 sm:text-[17px] md:text-[clamp(13px,1.45vw,18px)]"
            >
              {echo.paragraph}
            </p>

            <Link
              href={echo.cta.href}
              data-fx="rise"
              data-delay="0.55"
              className="mt-7 inline-flex min-h-12 items-center gap-5 bg-[#211b18] px-7 py-3 font-sans text-[9px] font-medium tracking-[0.2em] text-[#f8f2e8] uppercase transition-colors hover:bg-[#41352b] sm:mt-8 sm:px-8 sm:text-[10px]"
            >
              <span>{echo.cta.label}</span>
              <span aria-hidden="true" className="text-base leading-none">
                &rarr;
              </span>
            </Link>
          </div>

          <div
            data-slide="right"
            data-dist="260"
            className="relative z-10 mt-10 aspect-auto w-full max-w-[540px] self-center sm:mt-12 md:absolute md:top-1/2 md:right-[8%] md:mt-0 md:aspect-[0.95/1] md:w-[43%] md:max-w-none md:-translate-y-1/2"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-[8%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(171,122,70,0.2)_0%,rgba(171,122,70,0)_72%)] blur-2xl"
            />
            <div
              data-fx="mask"
              data-scrub-img
              className="relative z-10 mx-[3%] aspect-[0.95/1] overflow-hidden border-[9px] border-[#fbf4e7] bg-[#e8d3b7] shadow-[0_22px_42px_rgba(48,33,18,0.25)] sm:border-[12px] md:absolute md:inset-x-[3%] md:inset-y-[2%] md:mx-0"
            >
              <Image
                src={echo.photo.src}
                alt={echo.photo.alt}
                fill
                sizes="(max-width: 767px) 90vw, 43vw"
                className="object-cover object-center"
              />
            </div>

            <p
              data-parallax="0.1"
              data-fx="rise"
              data-delay="0.5"
              className="font-allura relative z-20 -mt-2 ml-auto w-[145px] -rotate-3 border border-[#d8c8ad] bg-[#f7f0e2]/95 px-4 py-4 text-center text-[24px] leading-[1.15] text-[#55483a]/90 shadow-[0_8px_18px_rgba(48,33,18,0.14)] sm:w-[170px] sm:py-5 sm:text-[29px] md:absolute md:top-[18%] md:right-[-14%] md:mt-0"
            >
              <Lines value={echo.note} />
            </p>
          </div>

          <Image
            src={echo.branch}
            alt=""
            aria-hidden="true"
            width={340}
            height={640}
            sizes="(max-width: 767px) 34vw, 20vw"
            data-parallax="0.14"
            className="pointer-events-none absolute right-[-4%] bottom-[-2%] z-0 w-[25%] rotate-[-7deg] object-contain drop-shadow-[0_8px_8px_rgba(48,33,18,0.2)] sm:right-[-6%] md:right-[1%] md:bottom-[-4%] md:z-20 md:w-[14%]"
          />
        </div>
      </section>

      <section
        aria-labelledby="next-chapter-title"
        className="relative z-30 -mt-8 bg-[#F0DEC6] px-6 pt-16 pb-20 text-[#211b16] sm:px-10 sm:pt-20 md:-mt-12 md:px-[7%] md:pt-24 md:pb-24"
        style={{ clipPath: tornBottomPaperClip }}
      >
        <div className="relative mx-auto max-w-[1500px]">
          <Image
            src={nextChapter.ornament}
            alt=""
            aria-hidden="true"
            width={220}
            height={220}
            sizes="220px"
            className="pointer-events-none absolute top-[-1.5rem] left-[2%] z-0 hidden h-[190px] w-[190px] -rotate-[18deg] object-contain opacity-80 lg:block"
          />
          <Image
            src={nextChapter.ornament}
            alt=""
            aria-hidden="true"
            width={220}
            height={220}
            sizes="220px"
            className="pointer-events-none absolute top-[-1.5rem] right-[2%] z-0 hidden h-[190px] w-[190px] scale-x-[-1] rotate-[18deg] object-contain opacity-80 lg:block"
          />

          <div className="mx-auto max-w-[760px] text-center">
            <h2
              id="next-chapter-title"
              data-scrub-words
              className="font-serif text-[clamp(31px,4.2vw,58px)] leading-[1.1] font-normal tracking-[-0.035em] text-[#28211b] italic"
            >
              <Lines value={nextChapter.heading} />
            </h2>
            <span
              aria-hidden="true"
              data-fx="line"
              className="mx-auto mt-6 block h-px w-14 bg-[#8a6a3b]/55"
            />
          </div>

          <nav
            aria-label="Story chapter navigation"
            data-fx="rise"
            className="mt-8 grid items-center gap-5 sm:mt-10 md:grid-cols-[1fr_auto_1fr] md:gap-7"
          >
            {nav?.onPrev ? (
              <button
                type="button"
                onClick={nav.onPrev}
                data-slide="left"
                data-dist="140"
                className="inline-flex min-h-[64px] cursor-pointer items-center justify-center gap-3 border border-[#756555]/50 px-5 py-4 font-sans text-[10px] font-medium tracking-[0.2em] text-[#302820] uppercase transition-colors hover:bg-[#e8d4b9] sm:justify-self-start sm:px-8"
              >
                <span aria-hidden="true" className="text-base">
                  &larr;
                </span>
                {nextChapter.prev.label}
              </button>
            ) : (
              <Link
                href={nextChapter.prev.href}
                data-slide="left"
                data-dist="140"
                className="inline-flex min-h-[64px] items-center justify-center gap-3 border border-[#756555]/50 px-5 py-4 font-sans text-[10px] font-medium tracking-[0.2em] text-[#302820] uppercase transition-colors hover:bg-[#e8d4b9] sm:justify-self-start sm:px-8"
              >
                <span aria-hidden="true" className="text-base">
                  &larr;
                </span>
                {nextChapter.prev.label}
              </Link>
            )}

            <span
              aria-hidden="true"
              className="hidden h-px w-full min-w-16 bg-[#756555]/40 md:block"
            />

            {nav?.onNext ? (
              <button
                type="button"
                onClick={nav.onNext}
                data-slide="right"
                data-dist="140"
                className="group inline-flex min-h-[64px] cursor-pointer items-center justify-between gap-4 bg-[#211b18] py-2 pr-2 pl-6 font-sans text-[10px] font-medium tracking-[0.19em] text-[#f8f2e8] uppercase transition-colors hover:bg-[#41352b] sm:pl-8 md:justify-self-end"
              >
                <span>{nextChapter.next.label}</span>
                <span
                  aria-hidden="true"
                  className="px-2 text-base transition-transform group-hover:translate-x-1"
                >
                  &rarr;
                </span>
                <Image
                  src={nextChapter.next.thumb}
                  alt=""
                  aria-hidden="true"
                  width={96}
                  height={60}
                  className="h-12 w-20 object-cover"
                />
              </button>
            ) : (
              <Link
                href={nextChapter.next.href}
                data-slide="right"
                data-dist="140"
                className="group inline-flex min-h-[64px] items-center justify-between gap-4 bg-[#211b18] py-2 pr-2 pl-6 font-sans text-[10px] font-medium tracking-[0.19em] text-[#f8f2e8] uppercase transition-colors hover:bg-[#41352b] sm:pl-8 md:justify-self-end"
              >
                <span>{nextChapter.next.label}</span>
                <span
                  aria-hidden="true"
                  className="px-2 text-base transition-transform group-hover:translate-x-1"
                >
                  &rarr;
                </span>
                <Image
                  src={nextChapter.next.thumb}
                  alt=""
                  aria-hidden="true"
                  width={96}
                  height={60}
                  className="h-12 w-20 object-cover"
                />
              </Link>
            )}
          </nav>

          {chapterCards && chapterCards.length > 0 && (
            <div className="mt-14 grid gap-x-8 gap-y-10 sm:mt-16 sm:grid-cols-2 lg:mt-20 lg:grid-cols-[0.9fr_repeat(4,minmax(0,1fr))] lg:gap-x-7">
              {moreFromKicker && (
                <p className="font-sans text-[10px] leading-[2] font-semibold tracking-[0.2em] text-[#51463c] uppercase sm:col-span-2 lg:col-span-1">
                  {moreFromKicker.map((line, i) => (
                    <Fragment key={i}>
                      {line}
                      {i < moreFromKicker.length - 1 && <br />}
                    </Fragment>
                  ))}
                </p>
              )}

              {chapterCards.map((chapter, i) => {
                const active = i === activeChapterIndex;
                const label = `Chapter ${chapter.number}: ${chapter.title}`;
                const className = "group block w-full scroll-mt-24 text-left";
                const body = (
                  <>
                    <div
                      className={`relative aspect-[1.55/1] overflow-hidden border bg-[#e8d4b9] shadow-[0_5px_12px_rgba(48,33,18,0.12)] ${
                        active ? "border-[#8a6a3b]" : "border-[#756555]/45"
                      }`}
                    >
                      <Image
                        src={chapter.image.src}
                        alt={chapter.image.alt}
                        fill
                        sizes="(max-width: 639px) 90vw, (max-width: 1023px) 44vw, 20vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                    <p
                      className={`mt-4 font-sans text-[9px] font-semibold tracking-[0.2em] uppercase ${
                        active ? "text-[#8a6a3b]" : "text-[#51463c]"
                      }`}
                    >
                      Chapter {chapter.number}
                    </p>
                    <h3 className="mt-1 font-serif text-[clamp(21px,1.8vw,27px)] leading-tight text-[#28211b] transition-colors group-hover:text-[#8a6a3b]">
                      {chapter.title}
                    </h3>
                  </>
                );

                return nav?.onSelectChapter ? (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => nav.onSelectChapter?.(i)}
                    aria-label={label}
                    aria-current={active ? "true" : undefined}
                    data-fx="rise"
                    data-delay={(i * 0.14).toFixed(2)}
                    className={`${className} cursor-pointer`}
                  >
                    {body}
                  </button>
                ) : (
                  <Link
                    key={chapter.id}
                    href={`#${chapter.id}`}
                    id={chapter.id}
                    aria-label={label}
                    data-fx="rise"
                    data-delay={(i * 0.14).toFixed(2)}
                    className={className}
                  >
                    {body}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
      </Fragment>
      <Footer />
    </main>
  );
};
