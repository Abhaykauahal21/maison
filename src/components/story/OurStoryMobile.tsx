"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

/**
 * OUR STORY: mobile (< md).
 * The atelier photograph (/images/ourstroy-mobile.webp, 941 x 1671) runs full-bleed: the
 * designer at his desk, the gown on the form, the lamp and candles glowing. The copy sits in the
 * soft-focus table at the bottom, under a warm dark fade.
 *
 * The photo: drifts with the scroll and settles out of a slow zoom; lamp + candles flicker, dust
 * floats through the light, a gold thread draws itself down the page.
 *
 * The text is scroll-scrubbed (it plays forward AND backward with your thumb):
 *  - headline lines slide in from opposite sides as they reach the reading line
 *  - the paragraphs light up word by word, dim -> bright
 *  - rules draw, the handwritten notes are written in by the scroll
 *  - the headline leans a few degrees with scroll speed and settles when you stop
 */

const STYLES = `
.om-root .om-a { animation-play-state: paused; }
.om-root[data-play="true"] .om-a { animation-play-state: running; }

.om-photo { animation: om-photo 2.6s cubic-bezier(.22,1,.36,1) both; }
@keyframes om-photo { from { opacity: 0; transform: scale(1.14); } to { opacity: 1; transform: scale(1); } }

.om-lamp { animation: om-lamp 5.5s ease-in-out infinite; }
@keyframes om-lamp { 0%,100% { opacity: .55; transform: scale(1); } 40% { opacity: .85; transform: scale(1.08); } 55% { opacity: .62; } 75% { opacity: .9; transform: scale(1.05); } }
.om-candle { animation: om-candle 3.1s ease-in-out infinite; }
@keyframes om-candle { 0%,100% { opacity: .5; } 20% { opacity: .9; } 35% { opacity: .6; } 60% { opacity: 1; } 80% { opacity: .65; } }

.om-mote { position: absolute; border-radius: 9999px; background: radial-gradient(circle, rgba(255,222,150,.95), rgba(255,190,100,0) 70%); opacity: 0; animation: om-mote ease-in-out infinite; }
@keyframes om-mote { 0% { opacity: 0; transform: translate3d(0,8px,0); } 30% { opacity: .85; } 100% { opacity: 0; transform: translate3d(var(--dx, 14px),-46px,0); } }

.om-thread { stroke-dasharray: 1; stroke-dashoffset: var(--off, 1); }

.om-btn { position: relative; overflow: hidden; isolation: isolate; }
.om-btn::before { content: ""; position: absolute; inset: 0; z-index: -1; background: #d9bd83; transform: translateX(-101%); transition: transform .55s cubic-bezier(.22,1,.36,1); }
.om-btn:hover::before, .om-btn:focus-visible::before, .om-btn:active::before { transform: none; }
.om-btn::after { content: ""; position: absolute; top: 0; bottom: 0; width: 38%; left: -60%; background: linear-gradient(100deg, transparent, rgba(255,255,255,.55), transparent); animation: om-shine 4.8s ease-in-out 1s infinite; }
@keyframes om-shine { 0%, 62% { left: -60%; } 100% { left: 140%; } }

@media (prefers-reduced-motion: reduce) {
  .om-photo { animation: none; }
  .om-lamp, .om-candle, .om-mote, .om-btn::after { animation: none; }
  .om-mote { display: none; }
}
`;

const MOTES = Array.from({ length: 16 }, (_, i) => ({
  left: 4 + ((i * 37) % 70),
  top: 18 + ((i * 29) % 52),
  size: 2 + (i % 3),
  dur: 6 + ((i * 5) % 6),
  delay: -((i * 1.9) % 9),
  dx: (i % 2 ? 1 : -1) * (8 + ((i * 7) % 16)),
}));

const PARAS = [
  "Maison D'Vine was born from a simple belief — that every woman carries a story, and what she wears should feel like a part of it.",
  "What started as a personal journey has now become a space for stories, emotions and beautifully crafted dresses.",
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};

/** Scroll-scrubbed line: slides up out of its own mask (data-s="rise"). */
const Rise: React.FC<{
  lag?: number;
  className?: string;
  children: React.ReactNode;
  from?: "up" | "left" | "right";
}> = ({ lag = 0, className = "", children, from = "up" }) => (
  <span
    data-s="rise"
    data-from={from}
    data-lag={lag}
    className={`block overflow-hidden pb-[0.12em] -mb-[0.12em] ${className}`}
  >
    <span data-inner className="block will-change-transform" style={{ transform: "translateY(110%)" }}>
      {children}
    </span>
  </span>
);

export const OurStoryMobile: React.FC<{ play: boolean }> = ({ play }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const q = <T extends HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T>(sel));
    const risers = q("[data-s='rise']");
    const fades = q("[data-s='fade']");
    const rules = q("[data-s='rule']");
    const inks = q("[data-s='ink']");
    const paras = q("[data-words]").map((el) => ({
      el,
      words: Array.from(el.querySelectorAll<HTMLElement>("[data-w]")),
    }));
    const lean = q("[data-lean]");

    let raf = 0;
    let lastY = window.scrollY;
    let vel = 0;
    let leanNow = 0;

    // e: 0 when the element is still below the reading line, 1 once it has risen `span` above it
    const prog = (el: HTMLElement, lag = 0) => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      return smooth((vh * 1.0 - r.top - lag) / (vh * 0.17));
    };

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;

      // Section progress: photo drift + thread
      const rr = root.getBoundingClientRect();
      const t = clamp01((vh - rr.top) / (vh + rr.height));
      root.style.setProperty("--sp", t.toFixed(4));
      root.style.setProperty("--off", (1 - clamp01((t - 0.18) / 0.5)).toFixed(4));

      risers.forEach((el) => {
        const inner = el.querySelector<HTMLElement>("[data-inner]");
        if (!inner) return;
        const e = prog(el, Number(el.dataset.lag || 0));
        const from = el.dataset.from;
        if (from === "left" || from === "right") {
          const dir = from === "left" ? -1 : 1;
          inner.style.transform = `translate3d(${(dir * (1 - e) * 16).toFixed(2)}vw, ${((1 - e) * 40).toFixed(1)}%, 0)`;
        } else {
          inner.style.transform = `translate3d(0, ${((1 - e) * 110).toFixed(1)}%, 0)`;
        }
        inner.style.opacity = String(0.35 + 0.65 * e);
      });

      fades.forEach((el) => {
        const e = prog(el, Number(el.dataset.lag || 0));
        el.style.opacity = String(0.25 + 0.75 * e);
        el.style.transform = `translate3d(0, ${((1 - e) * 14).toFixed(1)}px, 0)`;
      });

      rules.forEach((el) => {
        el.style.transform = `scaleX(${prog(el, Number(el.dataset.lag || 0)).toFixed(3)})`;
      });

      inks.forEach((el) => {
        const e = prog(el, Number(el.dataset.lag || 0));
        el.style.clipPath = `inset(0 ${((1 - e) * 104).toFixed(1)}% 0 0)`;
      });

      // Paragraphs: words light up one after another as the block passes the reading line
      paras.forEach(({ el, words }) => {
        const r = el.getBoundingClientRect();
        const start = vh * 0.98;
        const end = vh * 0.62;
        const p = clamp01((start - r.top) / (start - end + r.height * 0.25));
        const n = words.length;
        words.forEach((w, i) => {
          const e = smooth(p * (n + 7) - i - 1);
          w.style.opacity = String(0.42 + 0.58 * e);
          w.style.transform = `translate3d(0, ${((1 - e) * 5).toFixed(1)}px, 0)`;
          w.style.color = e > 0.5 ? "#f6efe4" : "#cfc4b2";
        });
      });

      // Scroll speed: the headline leans into the movement and settles when you stop
      const y = window.scrollY;
      vel = vel * 0.75 + (y - lastY) * 0.25;
      lastY = y;
      const target = Math.max(-4, Math.min(4, -vel * 0.18));
      leanNow += (target - leanNow) * 0.25;
      lean.forEach((el) => {
        el.style.transform = `skewY(${leanNow.toFixed(2)}deg)`;
      });

      if (Math.abs(vel) > 0.05 || Math.abs(leanNow) > 0.02) {
        raf = requestAnimationFrame(update);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      data-play={play}
      className="om-root relative w-full overflow-hidden bg-[#0e0d0c] text-left"
    >
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* ===== Photograph: drifts with the scroll ===== */}
      <div
        className="absolute inset-x-0 -top-[5%] -bottom-[5%] will-change-transform"
        style={{ transform: "translate3d(0, calc((var(--sp, 0.5) - 0.5) * -34px), 0)" }}
      >
        <div className="om-photo om-a absolute inset-0">
          <Image
            src="/images/ourstroy-mobile.webp"
            alt="Maison D'Vine atelier: the designer sketching beside a gown on the form"
            fill
            unoptimized
            priority
            sizes="100vw"
            className="pointer-events-none object-cover object-[62%_20%] select-none"
          />
        </div>

        <div
          aria-hidden="true"
          className="om-lamp pointer-events-none absolute left-[-14%] top-[22%] h-[26%] w-[56%]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,198,110,0.55), rgba(255,160,60,0.16) 55%, transparent 100%)",
            mixBlendMode: "screen",
          }}
        />
        <div
          aria-hidden="true"
          className="om-candle pointer-events-none absolute right-[-2%] top-[14%] h-[14%] w-[42%]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,205,120,0.6), rgba(255,170,70,0.14) 60%, transparent 100%)",
            mixBlendMode: "screen",
          }}
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(180deg, #0e0d0c 0%, rgba(14,13,12,0) 9%, rgba(14,13,12,0) 38%, rgba(14,13,12,0.62) 58%, rgba(14,13,12,0.9) 74%, #0e0d0c 100%)",
        }}
      />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
        {MOTES.map((m, i) => (
          <span
            key={i}
            className="om-mote om-a"
            style={{
              left: `${m.left}%`,
              top: `${m.top}%`,
              width: m.size,
              height: m.size,
              animationDuration: `${m.dur}s`,
              animationDelay: `${m.delay}s`,
              ["--dx" as string]: `${m.dx}px`,
            }}
          />
        ))}
      </div>

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[4] h-full w-full"
      >
        <path
          d="M 96 14 C 74 22, 44 34, 30 48 S 7 62, 4 78 S 28 95, 62 97"
          fill="none"
          stroke="#e6c98f"
          strokeOpacity="0.7"
          strokeWidth="1.1"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          className="om-thread"
        />
      </svg>

      {/* ===== Copy (scroll-scrubbed) ===== */}
      <div className="relative z-10 px-[7%] pt-[112vw] pb-[15vw]">
        {/* Handwritten note beside the gown: written by the scroll */}
        <p
          className="absolute right-[6%] top-[66vw] origin-right -rotate-[7deg] text-right font-allura allura-regular font-script font-cursive leading-[1.08] tracking-wide text-[#f6ead6]/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]"
          style={{ fontSize: "clamp(22px,7.2vw,36px)" }}
        >
          {["More than", "a brand.", "a journey."].map((l, i) => (
            <span
              key={l}
              data-s="ink"
              data-lag={i * 26}
              className="block"
              style={{ clipPath: "inset(0 104% 0 0)" }}
            >
              {l}
            </span>
          ))}
        </p>

        <div className="flex items-center gap-3 font-sans text-[11px] font-medium tracking-[0.3em] text-[#e6c98f] uppercase">
          <span
            data-s="rule"
            className="block h-px w-9 origin-left bg-[#e6c98f]"
            style={{ transform: "scaleX(0)" }}
          />
          <span data-s="fade" style={{ opacity: 0 }}>
            Our Story
          </span>
        </div>

        {/* Headline: lines arrive from opposite sides, and the block leans with scroll speed */}
        <div data-lean className="origin-left will-change-transform">
          <h2
            className="mt-3 font-serif font-normal leading-[1.06] tracking-[0.005em] text-white"
            style={{ fontSize: "clamp(34px,10.6vw,52px)", textShadow: "0 2px 14px rgba(0,0,0,0.7)" }}
          >
            <Rise from="left">From a Feeling</Rise>
            <Rise from="right" lag={22}>
              to a <em className="italic text-[#ecd09a]">Maison.</em>
            </Rise>
          </h2>
        </div>

        <span
          data-s="rule"
          data-lag={40}
          className="mt-4 block h-px w-[42%] origin-left bg-gradient-to-r from-[#e6c98f] to-transparent"
          style={{ transform: "scaleX(0)" }}
        />

        {/* Paragraphs light up word by word */}
        <div
          className="mt-4 max-w-[400px] space-y-3 font-sans text-[13.5px] leading-[1.75]"
          style={{ textShadow: "0 1px 8px rgba(0,0,0,0.75)" }}
        >
          {PARAS.map((para) => (
            <p key={para} data-words>
              {para.split(" ").map((w, i) => (
                <span
                  key={i}
                  data-w
                  className="inline-block will-change-transform"
                  style={{ opacity: 0.42, color: "#cfc4b2", marginRight: "0.28em" }}
                >
                  {w}
                </span>
              ))}
            </p>
          ))}
        </div>

        <div
          data-s="fade"
          data-lag={30}
          className="mt-7 flex items-end justify-between gap-4"
          style={{ opacity: 0 }}
        >
          <button
            type="button"
            className="om-btn group inline-flex cursor-pointer items-center gap-3 bg-[#fdfcfb] px-6 py-3 font-sans text-[11px] font-medium tracking-[0.2em] text-[#191512] uppercase shadow-[0_6px_20px_rgba(0,0,0,0.45)] transition-transform duration-300 active:scale-[0.97]"
          >
            <span>Read Further</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1.5">&rarr;</span>
          </button>

          <p
            className="origin-bottom-right -rotate-[5deg] text-right font-allura allura-regular font-script font-cursive leading-[1.05] tracking-wide text-[#d9cdb9]"
            style={{ fontSize: "clamp(22px,7vw,34px)" }}
          >
            {["Built on stories.", "for her."].map((l, i) => (
              <span
                key={l}
                data-s="ink"
                data-lag={40 + i * 28}
                className="block"
                style={{ clipPath: "inset(0 104% 0 0)" }}
              >
                {l}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
};
