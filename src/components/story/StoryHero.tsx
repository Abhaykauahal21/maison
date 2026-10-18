import Image from "next/image";
import Link from "next/link";
import { Lines } from "@/components/story/StoryLines";
import type { HeroContent } from "@/data/origin-content";

/**
 * The full-bleed story hero (big background image + variable copy) shared by the
 * editorial (/origin) and reading (/echo) story layouts. Renders exclusively from `hero`.
 */
export const StoryHero: React.FC<{ hero: HeroContent }> = ({ hero }) => (
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
);
