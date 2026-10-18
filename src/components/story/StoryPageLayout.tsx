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
 * The full editorial story layout used by /origin. Renders exclusively from `content`.
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
      <StoryHero hero={hero} />

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
