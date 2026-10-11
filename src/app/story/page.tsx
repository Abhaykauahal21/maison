import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/footer";
import { StoryFX } from "@/components/story/StoryFX";

const tornPaperClip = (() => {
  const points: string[] = [];
  const steps = 120;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 100;
    const n =
      (Math.sin(i * 0.91 + 1.2) * 0.5 +
        Math.sin(i * 2.37 + 0.4) * 0.3 +
        Math.sin(i * 5.13 + 2.1) * 0.2 +
        1) /
      2;
    points.push(`${x.toFixed(2)}% ${(2 + n * 11).toFixed(1)}px`);
  }
  for (let i = steps; i >= 0; i--) {
    const x = (i / steps) * 100;
    const n =
      (Math.sin(i * 1.07 + 0.7) * 0.5 +
        Math.sin(i * 2.61 + 1.8) * 0.3 +
        Math.sin(i * 4.73 + 0.3) * 0.2 +
        1) /
      2;
    points.push(`${x.toFixed(2)}% calc(100% - ${(2 + n * 12).toFixed(1)}px)`);
  }
  return `polygon(${points.join(", ")})`;
})();

const tornBottomPaperClip = (() => {
  const points = ["0 0", "100% 0"];
  const steps = 120;
  for (let i = steps; i >= 0; i--) {
    const x = (i / steps) * 100;
    const n =
      (Math.sin(i * 1.07 + 0.7) * 0.5 +
        Math.sin(i * 2.61 + 1.8) * 0.3 +
        Math.sin(i * 4.73 + 0.3) * 0.2 +
        1) /
      2;
    points.push(`${x.toFixed(2)}% calc(100% - ${(2 + n * 12).toFixed(1)}px)`);
  }
  return `polygon(${points.join(", ")})`;
})();

const echoChapters = [
  {
    number: "01",
    title: "The Echo",
    image: "/images/story/Golden%20Window%20Reverie.webp",
    alt: "A woman beside a sunlit window",
    id: "chapter-1",
  },
  {
    number: "02",
    title: "The Search",
    image: "/images/story/CrimsonGownAmongSunlitRuins.webp",
    alt: "A woman in a crimson gown among old stone ruins",
    id: "chapter-2",
  },
  {
    number: "03",
    title: "The In Between",
    image: "/images/story/Golden%20HourReadingNookOverlookingFlorence.webp",
    alt: "A woman reading in a sunlit room overlooking Florence",
    id: "chapter-3",
  },
  {
    number: "04",
    title: "The Realization",
    image: "/images/story/storyHero.webp",
    alt: "A woman looking out over the city at sunset",
    id: "chapter-4",
  },
];

export const metadata: Metadata = {
  title: "Our Story — Maison D'Vine",
  description:
    "Discover the story behind Maison D'Vine: a belief in thoughtful dresses, honest craft, and the stories every woman carries.",
};

export default function StoryRoute() {
  return (
    <main className="story-fx relative min-h-screen w-full max-w-full min-w-0 overflow-x-clip bg-[#0e0d0c]">
      <Navbar />
      <StoryFX />
      <section
        id="story"
        aria-labelledby="story-title"
        className="relative isolate flex h-[100svh] max-h-[1100px] min-h-[720px] items-center overflow-hidden bg-[#17100d] text-[#f8f2e8]"
      >
        <div data-hero-bg className="pointer-events-none absolute inset-0 -z-20">
          <Image
            src="/images/story/storyHero.webp"
            alt="A woman in a floral dress watching the sunset over the city"
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
              The Story
            </p>
            <p
              data-fx="rise"
              data-delay="1.6"
              className="mt-5 font-sans text-[10px] font-medium tracking-[0.3em] text-white/80 uppercase sm:mt-7 sm:text-[12px]"
            >
              Stage 01
            </p>
            <h1
              id="story-title"
              data-fx="chars"
              data-delay="1.7"
              className="font-bodoni mt-3 text-[clamp(52px,9.6vw,132px)] leading-[0.9] font-normal tracking-[0.015em] text-[#fffaf1] uppercase"
            >
              The Echo
            </h1>

            <div data-fx="rise" data-delay="2.3" className="mt-7 flex items-center gap-5 sm:mt-9">
              <span className="font-allura text-[25px] text-[#f1d5a4] sm:text-[32px]">
                Chapter 1
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
              Before I knew what I wanted,
              <br className="hidden sm:block" /> I wore what I knew.
            </p>
          </div>
        </div>

        <p
          data-parallax="0.18"
          data-fx="rise"
          data-delay="2.8"
          className="font-allura pointer-events-none absolute top-[25%] right-[8%] hidden -rotate-6 text-right text-[clamp(25px,3.4vw,46px)] leading-[1.25] text-[#3b3028]/90 lg:block"
        >
          A whispered
          <br />
          beginning,
          <br />
          every creation.
        </p>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[5.5%] bottom-8 hidden flex-col items-center gap-3 text-white/80 sm:flex"
        >
          <span className="font-sans text-[9px] tracking-[0.24em] uppercase">Scroll</span>
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
                01
              </span>
              <span className="[font-family:Arial,Helvetica,sans-serif] text-[8px] font-semibold tracking-[0.23em] text-[#51463c] uppercase sm:text-[10px]">
                The Beginning
              </span>
            </div>

            <h2
              id="beginning-title"
              data-fx="words"
              className="mt-3 max-w-[590px] font-serif text-[clamp(29px,3.55vw,52px)] leading-[1.06] font-normal tracking-[-0.035em] text-[#201b17] sm:mt-4"
            >
              Before the dream,
              <br className="hidden md:block" /> there was simply me —
              <br />
              trying to find a place
              <br />
              for myself in the world.
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
              <p>
                I wore what was already mine, what I could borrow, and what I believed might finally
                make me feel like the woman I wanted to be.
              </p>
              <p>
                There were days I dressed to fit in, days I dressed to feel braver, and days I
                dressed just to feel like me — even if just for a moment.
              </p>
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
                  src="/images/story/Golden%20Window%20Reverie.webp"
                  alt="A woman in a floral dress standing by a sunlit window"
                  fill
                  sizes="(max-width: 767px) 100vw, 55vw"
                  className="object-cover object-center"
                />
              </div>
              <Image
                src="/images/story/photoframe.webp"
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
            Different outfits,
            <br />
            same girl
            <br />
            searching for more.
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
            src="/images/story/GoldenRuinsandRoseParchment.webp"
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-x-0 top-0 h-[46%] md:hidden">
          <Image
            src="/images/story/CrimsonGownAmongSunlitRuins.webp"
            alt="A woman in a flowing crimson gown among sunlit stone ruins and flowers"
            fill
            sizes="100vw"
            className="object-cover object-[34%_center]"
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[56%] md:hidden">
          <Image
            src="/images/story/VintageCathedralScrapbookCollage.webp"
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
                02
              </span>
              <span className="[font-family:Arial,Helvetica,sans-serif] text-[8px] font-semibold tracking-[0.23em] text-[#51463c] uppercase sm:text-[10px]">
                The Unanswered
              </span>
            </div>

            <h2
              id="unanswered-title"
              data-fx="words"
              className="mt-4 max-w-[480px] font-serif text-[clamp(33px,3.5vw,52px)] leading-[1.08] font-normal tracking-[-0.035em] text-[#201b17] sm:mt-5"
            >
              But with each one,
              <br />
              something stayed
              <br />
              unanswered.
            </h2>

            <p
              data-fx="rise"
              data-delay="0.35"
              className="mt-5 max-w-[490px] [font-family:Arial,Helvetica,sans-serif] text-[14px] leading-[1.55] text-[#716b61] sm:mt-6 sm:text-[17px] md:text-[clamp(13px,1.55vw,19px)]"
            >
              They dressed me, but they never quite reached me. There was always a part of me
              waiting — untouched, unspoken.
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
              Beautiful
              <br />
              outfits.
              <br />
              Unanswered
              <br />
              questions.
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
                03
              </span>
              <span className="[font-family:Arial,Helvetica,sans-serif] text-[8px] font-semibold tracking-[0.23em] text-[#51463c] uppercase sm:text-[10px]">
                The Echo
              </span>
            </div>

            <h2
              id="echo-title"
              data-fx="words"
              className="mt-4 max-w-[590px] font-serif text-[clamp(32px,3.5vw,52px)] leading-[1.06] font-normal tracking-[-0.035em] text-[#201b17] sm:mt-5"
            >
              Echo is that beginning — the quiet life before I knew I was looking for something
              more.
            </h2>

            <p
              data-scrub-words
              className="mt-5 max-w-[500px] [font-family:Arial,Helvetica,sans-serif] text-[14px] leading-[1.5] text-[#716b61] sm:mt-6 sm:text-[17px] md:text-[clamp(13px,1.45vw,18px)]"
            >
              It&apos;s a collection of moments, feelings, and unspoken desires that lived within
              me, long before the dream took shape.
            </p>

            <Link
              href="/#story"
              data-fx="rise"
              data-delay="0.55"
              className="mt-7 inline-flex min-h-12 items-center gap-5 bg-[#211b18] px-7 py-3 font-sans text-[9px] font-medium tracking-[0.2em] text-[#f8f2e8] uppercase transition-colors hover:bg-[#41352b] sm:mt-8 sm:px-8 sm:text-[10px]"
            >
              <span>Explore the Echo Collection</span>
              <span aria-hidden="true" className="text-base leading-none">
                &rarr;
              </span>
            </Link>
          </div>

          <div
            data-slide="right"
            data-dist="260"
            className="relative z-10 mt-10 aspect-[0.95/1] w-full max-w-[540px] self-center sm:mt-12 md:absolute md:top-1/2 md:right-[8%] md:mt-0 md:w-[43%] md:max-w-none md:-translate-y-1/2"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-[8%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(171,122,70,0.2)_0%,rgba(171,122,70,0)_72%)] blur-2xl"
            />
            <div
              data-fx="mask"
              data-scrub-img
              className="absolute inset-x-[3%] inset-y-[2%] z-10 overflow-hidden border-[9px] border-[#fbf4e7] bg-[#e8d3b7] shadow-[0_22px_42px_rgba(48,33,18,0.25)] sm:border-[12px]"
            >
              <Image
                src="/images/story/Golden%20HourReadingNookOverlookingFlorence.webp"
                alt="A woman reading in a sunlit room overlooking Florence"
                fill
                sizes="(max-width: 767px) 90vw, 43vw"
                className="object-cover object-center"
              />
            </div>

            <p
              data-parallax="0.1"
              data-fx="rise"
              data-delay="0.5"
              className="font-allura absolute top-[10%] right-0 z-20 w-[145px] -rotate-3 border border-[#d8c8ad] bg-[#f7f0e2]/95 px-4 py-4 text-center text-[24px] leading-[1.15] text-[#55483a]/90 shadow-[0_8px_18px_rgba(48,33,18,0.14)] sm:right-[-2%] sm:w-[170px] sm:py-5 sm:text-[29px] md:top-[18%] md:right-[-14%]"
            >
              Same place,
              <br />
              new
              <br />
              perspectives.
            </p>
          </div>

          <Image
            src="/images/story/IvoryFloweringBranchCutout.webp"
            alt=""
            aria-hidden="true"
            width={340}
            height={640}
            sizes="(max-width: 767px) 34vw, 20vw"
            data-parallax="0.14"
            className="pointer-events-none absolute right-[-4%] bottom-[-2%] z-20 w-[25%] rotate-[-7deg] object-contain drop-shadow-[0_8px_8px_rgba(48,33,18,0.2)] sm:right-[-6%] md:right-[1%] md:bottom-[-4%] md:w-[14%]"
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
            src="/images/story/SepiaWatercolorBranchIllustration.webp"
            alt=""
            aria-hidden="true"
            width={220}
            height={220}
            sizes="220px"
            className="pointer-events-none absolute top-[-1.5rem] left-[2%] z-0 hidden h-[190px] w-[190px] -rotate-[18deg] object-contain opacity-80 lg:block"
          />
          <Image
            src="/images/story/SepiaWatercolorBranchIllustration.webp"
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
              Some chapters don&apos;t end.
              <br />
              They just lead you to the next.
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
            <Link
              href="#unanswered-title"
              data-slide="left"
              data-dist="140"
              className="inline-flex min-h-[64px] items-center justify-center gap-3 border border-[#756555]/50 px-5 py-4 font-sans text-[10px] font-medium tracking-[0.2em] text-[#302820] uppercase transition-colors hover:bg-[#e8d4b9] sm:justify-self-start sm:px-8"
            >
              <span aria-hidden="true" className="text-base">
                &larr;
              </span>
              Previous
            </Link>

            <span
              aria-hidden="true"
              className="hidden h-px w-full min-w-16 bg-[#756555]/40 md:block"
            />

            <Link
              href="#chapter-2"
              data-slide="right"
              data-dist="140"
              className="group inline-flex min-h-[64px] items-center justify-between gap-4 bg-[#211b18] py-2 pr-2 pl-6 font-sans text-[10px] font-medium tracking-[0.19em] text-[#f8f2e8] uppercase transition-colors hover:bg-[#41352b] sm:pl-8 md:justify-self-end"
            >
              <span>Continue to Chapter 2</span>
              <span
                aria-hidden="true"
                className="px-2 text-base transition-transform group-hover:translate-x-1"
              >
                &rarr;
              </span>
              <Image
                src="/images/story/CrimsonGownAmongSunlitRuins.webp"
                alt=""
                aria-hidden="true"
                width={96}
                height={60}
                className="h-12 w-20 object-cover"
              />
            </Link>
          </nav>

          <div className="mt-14 grid gap-x-8 gap-y-10 sm:mt-16 sm:grid-cols-2 lg:mt-20 lg:grid-cols-[0.9fr_repeat(4,minmax(0,1fr))] lg:gap-x-7">
            <p className="font-sans text-[10px] leading-[2] font-semibold tracking-[0.2em] text-[#51463c] uppercase sm:col-span-2 lg:col-span-1">
              More from
              <br />
              Stage 0 — The Echo
            </p>

            {echoChapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`#${chapter.id}`}
                id={chapter.id}
                aria-label={`Chapter ${chapter.number}: ${chapter.title}`}
                data-fx="rise"
                data-delay={(echoChapters.indexOf(chapter) * 0.14).toFixed(2)}
                className="group block scroll-mt-24"
              >
                <div className="relative aspect-[1.55/1] overflow-hidden border border-[#756555]/45 bg-[#e8d4b9] shadow-[0_5px_12px_rgba(48,33,18,0.12)]">
                  <Image
                    src={chapter.image}
                    alt={chapter.alt}
                    fill
                    sizes="(max-width: 639px) 90vw, (max-width: 1023px) 44vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <p className="mt-4 font-sans text-[9px] font-semibold tracking-[0.2em] text-[#51463c] uppercase">
                  Chapter {chapter.number}
                </p>
                <h3 className="mt-1 font-serif text-[clamp(21px,1.8vw,27px)] leading-tight text-[#28211b] transition-colors group-hover:text-[#8a6a3b]">
                  {chapter.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
