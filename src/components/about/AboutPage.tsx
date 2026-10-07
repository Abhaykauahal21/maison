"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeroDepth, useHeroProgress, StoryScene } from "@/components/about/scenes";

const PAPER = "radial-gradient(120% 90% at 0% 0%, #fbf5e9 0%, #f3ead9 55%, #ebdfc9 100%)";
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .35 0 0 0 0 .27 0 0 0 0 .18 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.3'/%3E%3C/svg%3E\")";
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/** Hand-torn edge as a polygon (deterministic, so server and client markup match). */
const torn = () => {
  const pts: string[] = [];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const n =
      (Math.sin(i * 0.9 + 1.2) * 0.5 + Math.sin(i * 2.3 + 0.4) * 0.3 + Math.sin(i * 5.1 + 2.1) * 0.2 + 1) / 2;
    const x = ((i / steps) * 100).toFixed(2);
    pts.push(`${x}% ${(n * 14).toFixed(1)}px`);
  }
  return `polygon(${pts.join(", ")}, 100% 100%, 0 100%)`;
};
const TORN_TOP = torn();

/** Fades and rises into place the first time it scrolls into view. */
const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  from?: "up" | "left" | "right";
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, from = "up", className = "", style }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const off =
    from === "left" ? "translate3d(-48px,0,0)" : from === "right" ? "translate3d(48px,0,0)" : "translate3d(0,36px,0)";
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: on ? 1 : 0,
        transform: on ? "none" : off,
        transition: `opacity 1s ease ${delay}s, transform 1.2s ${EASE} ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** A headline line that rises out of its own mask once it is on screen. */
const Line: React.FC<{ children: React.ReactNode; delay?: number; on: boolean }> = ({ children, delay = 0, on }) => (
  <span className="block overflow-hidden pb-[0.1em]">
    <span
      className="block will-change-transform"
      style={{
        transform: on ? "none" : "translate3d(0,112%,0)",
        transition: `transform 1.1s ${EASE} ${delay}s`,
      }}
    >
      {children}
    </span>
  </span>
);

const useOnce = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, on] as const;
};

/** A photograph pinned to the page: paper border, a strip of tape and a soft shadow. */
const Print: React.FC<{
  src: string;
  alt: string;
  rotate: number;
  className?: string;
  sizes: string;
  pos?: string;
  caption?: string;
}> = ({ src, alt, rotate, className = "", sizes, pos = "50% 30%", caption }) => (
  <div
    className={`relative bg-[#fbf6ea] p-2.5 pb-3 shadow-[0_3px_10px_rgba(40,28,16,0.2),0_18px_34px_rgba(40,28,16,0.22)] ring-1 ring-[#3a3026]/10 sm:p-3 sm:pb-4 ${className}`}
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    <span
      aria-hidden="true"
      className="absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 -rotate-2 bg-[#e6c98f]/80 shadow-[0_2px_5px_rgba(40,24,10,0.2)]"
    />
    <div className="relative h-full w-full overflow-hidden bg-[#e0d6c8]">
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" style={{ objectPosition: pos }} />
    </div>
    {caption && (
      <p className="font-allura allura-regular font-script font-cursive absolute right-4 -bottom-7 text-[26px] leading-none text-[#8a6a3b]">
        {caption}
      </p>
    )}
  </div>
);

const BELIEFS = [
  { title: "Slow", text: "Trust is earned, not demanded. We would rather take nine months than rush a single seam." },
  { title: "Conscious", text: "Made in small, honest batches, with the true cost of the work left visible, never hidden." },
  { title: "Story-first", text: "A dress is not the end of the story. It is the part you get to wear." },
];

export const AboutPage: React.FC = () => {
  const [heroRef, heroOn] = useOnce<HTMLDivElement>();
  const [bornRef, bornOn] = useOnce<HTMLDivElement>();
  const [whereRef, whereOn] = useOnce<HTMLDivElement>();
  const [endRef, endOn] = useOnce<HTMLDivElement>();

  const heroSection = useHeroProgress();

  const paper: React.CSSProperties = {
    backgroundColor: "#f3ead9",
    backgroundImage: `${GRAIN}, ${PAPER}`,
    backgroundBlendMode: "multiply, normal",
  };

  return (
    <div className="text-[#1c1815]">
      {/* ================= I. The belief ================= */}
      <section ref={heroSection} className="relative z-10 w-full" style={paper}>
        <HeroDepth />
        <div
          ref={heroRef}
          className="mx-auto grid min-h-[100svh] w-full max-w-[1280px] items-center gap-12 px-6 pt-32 pb-24 sm:px-10 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-14"
        >
          <div>
            <div
              className="flex items-center gap-3"
              style={{ opacity: heroOn ? 1 : 0, transition: "opacity 0.9s ease 0.1s" }}
            >
              <span
                className="block h-px bg-[#8a6a3b]"
                style={{ width: heroOn ? 40 : 0, transition: `width 1s ${EASE} 0.2s` }}
              />
              <span className="font-sans text-[11px] font-semibold tracking-[0.3em] text-[#554a3e] uppercase">
                About the Maison
              </span>
            </div>
            <h1 className="mt-5 font-bodoni text-[clamp(40px,6.4vw,92px)] leading-[0.98] font-normal tracking-[0.01em]">
              <Line on={heroOn} delay={0.25}>Not just dresses,</Line>
              <Line on={heroOn} delay={0.4}>
                but <em className="text-[#8a6a3b] italic">stories.</em>
              </Line>
            </h1>
            <p
              className="mt-7 max-w-[520px] font-serif text-[17px] leading-[1.8] text-[#2e2418] italic sm:text-[19px]"
              style={{
                opacity: heroOn ? 1 : 0,
                transform: heroOn ? "none" : "translate3d(0,20px,0)",
                transition: `opacity 1s ease 0.75s, transform 1.1s ${EASE} 0.75s`,
              }}
            >
              Maison D&rsquo;Vine was born from a simple belief: that every woman carries a story, and what she wears
              should feel like a part of it.
            </p>
          </div>

          {/* pinned prints */}
          <div
            className="relative mx-auto h-[420px] w-full max-w-[520px] sm:h-[520px] lg:h-[600px]"
            style={{
              opacity: heroOn ? 1 : 0,
              transform: heroOn ? "none" : "translate3d(0,40px,0) rotate(2deg)",
              transition: `opacity 1.2s ease 0.5s, transform 1.4s ${EASE} 0.5s`,
            }}
          >
            <Print
              src="/images/ourStroy.webp"
              alt="The atelier desk, sketches pinned to the wall"
              rotate={-3.5}
              sizes="(max-width: 1024px) 80vw, 42vw"
              pos="30% 40%"
              className="absolute top-0 left-0 h-[52%] w-[88%]"
            />
            <Print
              src="/images/blog-1.webp"
              alt="A woman in a floral dress, walking through a sunlit garden"
              rotate={4}
              sizes="(max-width: 1024px) 60vw, 30vw"
              caption="her story"
              className="absolute right-0 bottom-0 h-[58%] w-[56%]"
            />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 translate-y-[1px]" aria-hidden="true" />
      </section>

      {/* ================= II. From a feeling to a Maison ================= */}
      <section className="relative z-10 -mt-3 w-full bg-[#f3ead9]" style={{ ...paper, clipPath: TORN_TOP }}>
        <div
          ref={bornRef}
          className="mx-auto grid w-full max-w-[1280px] items-center gap-14 px-6 py-28 sm:px-10 lg:grid-cols-[0.9fr_1fr] lg:px-14 lg:py-36"
        >
          <Reveal from="left" className="relative mx-auto w-full max-w-[460px]">
            <Print
              src="/images/blog-2.webp"
              alt="An open book with rose petals, and tea"
              rotate={-2.5}
              sizes="(max-width: 1024px) 80vw, 36vw"
              pos="50% 55%"
              className="aspect-[0.86/1] w-full"
            />
          </Reveal>
          <div>
            <h2 className="font-bodoni text-[clamp(34px,4.8vw,68px)] leading-[1] font-normal">
              <Line on={bornOn}>From a feeling</Line>
              <Line on={bornOn} delay={0.14}>
                to a <em className="text-[#8a6a3b] italic">Maison.</em>
              </Line>
            </h2>
            <Reveal delay={0.3}>
              <p className="mt-7 max-w-[540px] font-serif text-[17px] leading-[1.85] text-[#2e2418] sm:text-[18px]">
                What started as a personal journey has now become a space for stories, emotions and beautifully crafted
                dresses. Each one is inspired by a story &mdash; of her, of you, of every woman who dreams, feels, and
                evolves.
              </p>
            </Reveal>
            <Reveal delay={0.45}>
              <p className="font-allura allura-regular font-script font-cursive mt-6 -rotate-3 text-[34px] leading-[1.1] text-[#8a6a3b] sm:text-[44px]">
                Before every dream, there is an echo.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= III. How a dress is made: four scenes, told by the scroll ================= */}
      <StoryScene />

      {/* ================= IV. What we believe ================= */}
      <section className="relative z-10 w-full bg-[#f3ead9]" style={{ ...paper, clipPath: TORN_TOP, marginTop: -14 }}>
        <div className="mx-auto w-full max-w-[1200px] px-6 py-28 sm:px-10 lg:py-36">
          <Reveal className="text-center">
            <span className="font-sans text-[11px] font-semibold tracking-[0.3em] text-[#7a6140] uppercase">
              What we believe
            </span>
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {BELIEFS.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.14}>
                <div className="relative h-full border border-[#3a3026]/20 bg-[#fbf6ea]/55 px-7 py-9 text-center shadow-[0_10px_24px_rgba(40,28,16,0.08)]">
                  <span
                    aria-hidden="true"
                    className="absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 bg-[#e6c98f]/75"
                  />
                  <h3 className="font-bodoni text-[34px] leading-none text-[#14100c] italic">{b.title}</h3>
                  <span className="mx-auto my-4 block h-px w-10 bg-[#8a6a3b]/70" />
                  <p className="font-serif text-[16px] leading-[1.8] text-[#2e2418]">{b.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= V. Where the stories live ================= */}
      <section className="relative z-10 w-full bg-[#14100c] text-[#f4efe8]">
        <div
          ref={whereRef}
          className="mx-auto grid w-full max-w-[1280px] items-center gap-14 px-6 py-28 sm:px-10 lg:grid-cols-[1fr_0.9fr] lg:px-14 lg:py-36"
        >
          <div>
            <h2 className="font-bodoni text-[clamp(32px,4.6vw,64px)] leading-[1.04] font-normal">
              <Line on={whereOn}>Where the stories</Line>
              <Line on={whereOn} delay={0.14}>
                <em className="text-[#ecd09a] italic">live today.</em>
              </Line>
            </h2>
            <Reveal delay={0.3}>
              <p className="mt-7 max-w-[520px] font-serif text-[17px] leading-[1.85] text-[#d9cdb9] sm:text-[18px]">
                Right now, our stories live in and around NCR, with incredible women who made them their own. We&rsquo;re
                on our way to more cities, more stories, more you.
              </p>
            </Reveal>
            <Reveal delay={0.45}>
              <p className="font-allura allura-regular font-script font-cursive mt-8 -rotate-3 text-[38px] leading-[1.12] text-[#f0d9a6] sm:text-[52px]">
                More cities.
                <br />
                More stories.
                <br />
                <span className="pl-8">Soon&hellip;</span>
              </p>
            </Reveal>
          </div>
          <Reveal from="right" className="relative mx-auto w-full max-w-[440px]">
            <Print
              src="/images/blog-3.webp"
              alt="A woman in a crimson gown on a terrace above the city at golden hour"
              rotate={3}
              sizes="(max-width: 1024px) 80vw, 36vw"
              pos="50% 40%"
              className="aspect-[0.8/1] w-full"
            />
          </Reveal>
        </div>
      </section>

      {/* ================= VI. Closing ================= */}
      <section className="relative z-10 w-full bg-[#f3ead9]" style={{ ...paper, clipPath: TORN_TOP, marginTop: -14 }}>
        <div ref={endRef} className="mx-auto w-full max-w-[900px] px-6 py-28 text-center sm:px-10 lg:py-36">
          <p className="font-allura allura-regular font-script font-cursive -rotate-2 text-[clamp(46px,8vw,110px)] leading-[1.05] text-[#1c1815]">
            <span className="block overflow-hidden pb-[0.1em]">
              <span
                className="block"
                style={{
                  transform: endOn ? "none" : "translate3d(0,115%,0)",
                  transition: `transform 1.2s ${EASE}`,
                }}
              >
                More than a brand.
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.1em] pl-[1.2em]">
              <span
                className="block text-[#8a6a3b]"
                style={{
                  transform: endOn ? "none" : "translate3d(0,115%,0)",
                  transition: `transform 1.2s ${EASE} 0.15s`,
                }}
              >
                a journey.
              </span>
            </span>
          </p>
          <Reveal delay={0.35} className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Link
              href="/#closer"
              className="group inline-flex items-center gap-3 border border-[#1c1815] bg-[#1c1815] px-8 py-3.5 font-sans text-[11px] font-medium tracking-[0.22em] text-[#f4efe8] uppercase transition-colors duration-300 hover:bg-transparent hover:text-[#1c1815]"
            >
              Join the Archive
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">
                &rarr;
              </span>
            </Link>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-3 border border-[#1c1815]/60 px-8 py-3.5 font-sans text-[11px] font-medium tracking-[0.22em] text-[#1c1815] uppercase transition-colors duration-300 hover:border-[#1c1815] hover:bg-[#1c1815] hover:text-[#f4efe8]"
            >
              Read the Journal
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">
                &rarr;
              </span>
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
