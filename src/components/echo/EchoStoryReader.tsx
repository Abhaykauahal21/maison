"use client";

import { useCallback, useEffect, useState } from "react";
import { StoryPageLayout, type ChapterCard } from "@/components/story/StoryPageLayout";
import { defaultEchoStory } from "@/data/echo-story";
import { defaultOriginContent, type OriginContent } from "@/data/origin-content";

const story = defaultEchoStory;

const nextChapterHeading = ["Some chapters don't end.", "They just lead you to the next."];

type VeilState = "idle" | "in" | "out";

/**
 * Owns the current chapter index for /echo and feeds StoryPageLayout one chapter's worth of
 * content at a time. The layout (design) never changes — only the data does, so the same shape
 * can be served from the admin panel / an API.
 *
 * Chapter changes are covered by a warm, on-brand veil (so the swap never flashes black) and the
 * new chapter's story layer remounts with `intro={false}` — no replay of the dark intro.
 */
export function EchoStoryReader() {
  const [index, setIndex] = useState(0);
  const [veil, setVeil] = useState<VeilState>("idle");
  const [pending, setPending] = useState<number | null>(null);
  // The cinematic intro plays once, on first load — never on a chapter swap.
  const [intro, setIntro] = useState(true);

  const total = story.chapters.length;
  const chapter = story.chapters[index];

  const changeChapter = useCallback(
    (i: number) => {
      const target = Math.max(0, Math.min(total - 1, i));
      if (target === index || veil !== "idle") return;
      setPending(target);
      setVeil("in");
    },
    [index, total, veil]
  );

  // Sequence: veil in -> swap content at the top -> veil out.
  useEffect(() => {
    if (veil === "in") {
      const t = window.setTimeout(() => {
        if (pending !== null) {
          setIntro(false);
          setIndex(pending);
          window.scrollTo({ top: 0, behavior: "auto" });
        }
        setVeil("out");
      }, 460);
      return () => window.clearTimeout(t);
    }
    if (veil === "out") {
      const t = window.setTimeout(() => {
        setVeil("idle");
        setPending(null);
      }, 560);
      return () => window.clearTimeout(t);
    }
  }, [veil, pending]);

  const chapterCards: ChapterCard[] = story.chapters.map((c) => ({
    id: c.id,
    number: c.number,
    title: c.title,
    image: c.image,
  }));

  const content: OriginContent = {
    meta: story.meta,
    hero: chapter.hero,
    beginning: chapter.beginning,
    unanswered: chapter.unanswered,
    echo: chapter.echo,
    nextChapter: {
      heading: nextChapterHeading,
      prev: {
        label: index === 0 ? "The Origin" : "Previous",
        href: "/origin",
      },
      next: {
        label:
          index === total - 1
            ? "Explore the Echo Collection"
            : `Continue to Chapter ${Number(story.chapters[index + 1].number)}`,
        href: index === total - 1 ? "/#story" : `#${story.chapters[index + 1].id}`,
        thumb:
          index === total - 1 ? chapter.echo.photo.src : story.chapters[index + 1].image.src,
      },
      ornament: defaultOriginContent.nextChapter.ornament,
    },
  };

  const veilChapter = pending !== null ? story.chapters[pending] : null;
  const veilVisible = veil === "in";

  return (
    <>
      <StoryPageLayout
        content={content}
        intro={intro}
        chapterKey={chapter.id}
        chapterCards={chapterCards}
        moreFromKicker={story.moreFromKicker}
        activeChapterIndex={index}
        nav={{
          onPrev: index === 0 ? undefined : () => changeChapter(index - 1),
          onNext: index === total - 1 ? undefined : () => changeChapter(index + 1),
          onSelectChapter: changeChapter,
        }}
      />

      <div
        aria-hidden="true"
        className={`fixed inset-0 z-[120] flex items-center justify-center bg-[radial-gradient(120%_80%_at_50%_38%,rgba(241,213,164,0.12),transparent_62%),linear-gradient(180deg,#1a1410_0%,#0e0d0c_100%)] transition-opacity duration-500 ease-out ${
          veilVisible ? "opacity-100" : "opacity-0"
        } ${veil === "idle" ? "pointer-events-none" : "pointer-events-auto"}`}
      >
        <div className="flex flex-col items-center gap-5 px-6 text-center">
          <span className="font-sans text-[10px] font-semibold tracking-[0.34em] text-[#f1d5a4] uppercase">
            {veilChapter ? `Chapter ${Number(veilChapter.number)}` : ""}
          </span>
          <span className="font-serif text-[clamp(28px,5vw,54px)] leading-[1.05] tracking-[-0.02em] text-[#fffaf1]">
            {veilChapter?.title ?? ""}
          </span>
          <span
            className="mt-1 block h-7 w-7 animate-spin rounded-full border border-[#f1d5a4]/25 border-t-[#f1d5a4]"
            aria-hidden="true"
          />
        </div>
      </div>
    </>
  );
}
