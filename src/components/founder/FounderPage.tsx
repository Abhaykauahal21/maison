"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const PAPER = "radial-gradient(120% 90% at 0% 0%, #fbf5e9 0%, #f3ead9 55%, #ebdfc9 100%)";
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const LETTER = [
  "Sometimes we think no one is watching. We go through our days carrying hopes we never say out loud, and we assume nobody notices.",
  "But our dresses do. They are there at the quiet morning when we finally feel like ourselves, at the letter we never sent, at the midnight dream we are not ready to share. They keep it all, in the fall of the fabric and in every stitch.",
  "That is how Maison D’Vine began: not with a plan to build a brand, but with a wish to give those unspoken moments a shape you could wear. Every creation here is inspired by a story — of her, of you, of every woman who dreams, feels and evolves.",
  "Our greatest chapters are still being written. And perhaps the most beautiful part is that they never truly end.",
];

/** Fades and rises into place the first time it scrolls into view. */
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children,
  delay = 0,
  className = "",
}) => {
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
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: on ? 1 : 0,
        transform: on ? "none" : "translate3d(0,34px,0)",
        transition: `opacity 1s ease ${delay}s, transform 1.2s ${EASE} ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

export const FounderPage: React.FC = () => (
  <>
    {/* opening: dark, with the title rising line by line */}
    <section className="relative flex min-h-[78svh] w-full items-end justify-center px-6 pt-36 pb-20 text-center">
      <div className="max-w-[900px]">
        <p className="animate-hero-desc font-sans text-[11px] font-medium tracking-[0.34em] text-[#e6c98f] uppercase">
          A letter from the founder
        </p>
        <h1 className="mt-5 font-bodoni text-[clamp(40px,7vw,96px)] leading-[0.98] font-normal text-white">
          <span className="block overflow-hidden pb-1">
            <span className="block animate-hero-line-1">The story</span>
          </span>
          <span className="block overflow-hidden pb-1">
            <span className="block animate-hero-line-2">
              behind <em className="text-[#ecd09a] italic">the dresses.</em>
            </span>
          </span>
        </h1>
      </div>
    </section>

    {/* the letter, on paper */}
    <section className="relative z-10 w-full bg-[#f3ead9]" style={{ backgroundImage: PAPER }}>
      <div className="mx-auto w-full max-w-[760px] px-6 py-24 sm:px-10 lg:py-32">
        <div className="space-y-7">
          {LETTER.map((para, i) => (
            <Reveal key={i} delay={0.05}>
              <p
                className={`font-serif leading-[1.85] text-[#2e2418] ${
                  i === 0 ? "text-[20px] sm:text-[24px]" : "text-[17px] sm:text-[19px]"
                }`}
              >
                {para}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14" delay={0.1}>
          <p className="font-allura allura-regular font-script font-cursive text-[40px] leading-[1.05] text-[#8a6a3b] sm:text-[54px]">
            Virender Rawat
          </p>
          <p className="mt-2 font-sans text-[11px] font-semibold tracking-[0.28em] text-[#7a6140] uppercase">
            Founder, Maison D&rsquo;Vine
          </p>
        </Reveal>

        <Reveal className="mt-14" delay={0.1}>
          <Link
            href="/"
            className="group inline-flex items-center gap-3 border border-[#1c1815] bg-[#1c1815] px-7 py-3 font-sans text-[11px] font-medium tracking-[0.2em] text-[#f2e7db] uppercase transition-colors duration-300 hover:border-[#8a6a3b] hover:bg-[#8a6a3b]"
          >
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1.5">
              &larr;
            </span>
            Back to the Maison
          </Link>
        </Reveal>
      </div>
    </section>
  </>
);
