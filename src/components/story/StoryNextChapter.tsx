import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { tornBottomPaperClip } from "@/lib/torn-paper";
import type { ImageContent, NextChapterContent } from "@/data/origin-content";

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

interface StoryNextChapterProps {
  nextChapter: NextChapterContent;
  /** Optional "More from" chapter cards rendered at the very end. */
  chapterCards?: ChapterCard[];
  /** Callout for the chapter-cards grid (one entry per line). */
  moreFromKicker?: string[];
  nav?: StoryNav;
  /** Index of the chapter currently shown (highlights the matching card). */
  activeChapterIndex?: number;
}

/**
 * The closing "next chapter" panel (heading, prev/next controls, chapter cards) shared by the
 * editorial (/origin) and reading (/echo) story layouts.
 */
export const StoryNextChapter: React.FC<StoryNextChapterProps> = ({
  nextChapter,
  chapterCards,
  moreFromKicker,
  nav,
  activeChapterIndex,
}) => (
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
          {nextChapter.heading.map((line, i) => (
            <Fragment key={i}>
              {line}
              {i < nextChapter.heading.length - 1 && <br />}
            </Fragment>
          ))}
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
);
