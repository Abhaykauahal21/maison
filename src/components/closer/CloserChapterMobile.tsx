"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { makeTops, nearViewport } from "@/lib/scrub";
import { Sparkles, Heart, Gift, BookOpen } from "lucide-react";

/**
 * A CLOSER CHAPTER: mobile (< md).
 * One torn parchment sheet (/images/closechapter-mobile.webp, 941 x 1672, full-bleed) with the
 * scrapbook (photoFrameclosechapter.webp) laid on top: the photo sits in the frame's card, the
 * letter, wax seal, dried flowers and film strips around it. The copy is centred below.
 *
 * Every motion is scroll-scrubbed (forward and backward):
 *  - the scrapbook is dropped onto the page: rises, straightens from a tilt and settles
 *  - the photo develops: an iris opens while the image pulls back
 *  - "A CLOSER CHAPTER" letters fan in from the centre and come into focus
 *  - rules draw, the description rises, the four benefits wipe in one after another, icons spin in
 *  - the handwritten note is written by the scroll and its heart draws itself
 *  - the parchment drifts, the wax seal breathes, gold dust floats, a light circles the button
 * All sizes are container units (cqw) so the layout scales exactly like the artwork.
 */

const BENEFITS = [
  { Icon: Sparkles, text: "Early access to new collections" },
  { Icon: Heart, text: "Exclusive member-only drops" },
  { Icon: Gift, text: "Special offers & experiences" },
  { Icon: BookOpen, text: "Stories, notes and behind the scenes" },
];

const NOTE = ["A closer", "chapter", "for our", "inner circle"];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};

const STYLES = `
.cm-float { animation: cm-float 9s ease-in-out infinite; }
@keyframes cm-float { 0%,100% { transform: translate3d(0,0,0) rotate(0deg); } 50% { transform: translate3d(0,-5px,0) rotate(.45deg); } }
.cm-seal { animation: cm-seal 3.6s ease-in-out infinite; }
@keyframes cm-seal { 0%,100% { opacity: .25; transform: scale(.92); } 50% { opacity: .75; transform: scale(1.12); } }
.cm-shine { position: absolute; inset: 0; overflow: hidden; mix-blend-mode: soft-light; }
.cm-shine-band { position: absolute; top: 0; bottom: 0; left: 0; width: 260%; background: linear-gradient(115deg, transparent 38%, rgba(255,240,205,.5) 50%, transparent 62%); will-change: transform; }
.cm-btn::after { content: ""; position: absolute; top: 0; bottom: 0; width: 34%; left: -50%; background: linear-gradient(100deg, transparent, rgba(255,255,255,.22), transparent); animation: cm-sheen 5s ease-in-out 1s infinite; }
@keyframes cm-sheen { 0%, 60% { left: -50%; } 100% { left: 130%; } }
@media (prefers-reduced-motion: reduce) { .cm-float, .cm-seal, .cm-btn::after { animation: none; } }
`;

const MOTES = Array.from({ length: 14 }, (_, i) => ({
  left: ((i * 41 + 9) % 88) + 5,
  top: ((i * 57 + 11) % 80) + 8,
  size: 2 + (i % 3),
  dur: 6 + (i % 5) * 1.4,
  delay: (i % 7) * 0.9,
  dx: (i % 2 === 0 ? 1 : -1) * (8 + (i % 4) * 6),
}));

const Rise: React.FC<{ lag?: number; className?: string; children: React.ReactNode }> = ({
  lag = 0,
  className = "",
  children,
}) => (
  <span
    data-s="rise"
    data-lag={lag}
    className={`-mb-[0.14em] block overflow-hidden pb-[0.14em] ${className}`}
  >
    <span
      data-inner
      className="block will-change-transform"
      style={{ transform: "translateY(112%)" }}
    >
      {children}
    </span>
  </span>
);

/** Heading line: letters fan out from the line's centre and converge as you scroll. */
const Converge: React.FC<{ line: string }> = ({ line }) => {
  const chars = Array.from(line);
  const centre = (chars.length - 1) / 2;
  return (
    <span className="block" aria-hidden="true">
      {chars.map((ch, i) => (
        <span
          key={i}
          data-s="conv"
          data-off={((i - centre) * 0.55).toFixed(2)}
          data-lag={i * 6}
          className="inline-block will-change-transform"
          style={{ opacity: 0 }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
};

export const CloserChapterMobile: React.FC = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const q = <T extends Element>(sel: string) => Array.from(root.querySelectorAll<T>(sel));
    const risers = q<HTMLElement>("[data-s='rise']");
    const convs = q<HTMLElement>("[data-s='conv']");
    const rules = q<HTMLElement>("[data-s='rule']");
    const fades = q<HTMLElement>("[data-s='fade']");
    const wipes = q<HTMLElement>("[data-s='wipe']");
    const icons = q<HTMLElement>("[data-s='icon']");
    const inks = q<HTMLElement>("[data-s='ink']");
    const draws = q<SVGPathElement>("[data-s='draw']");
    const frame = root.querySelector<HTMLElement>("[data-s='frame']");
    const iris = root.querySelector<HTMLElement>("[data-s='iris']");
    const shine = root.querySelector<HTMLElement>("[data-shine]");

    const drift = root.querySelector<HTMLElement>("[data-drift]");

    let raf = 0;
    const T = makeTops();
    const prog = (el: Element, lag = 0, span = 0.17) => {
      const vh = window.innerHeight;
      return smooth((vh * 0.76 - T.top(el) - lag) / (vh * span));
    };

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const rr = root.getBoundingClientRect();
      // offscreen: nothing to do (this handler runs on every scroll, for every section)
      if (!nearViewport(rr, vh)) return;
      // all reads first (one style/layout pass), then all writes
      T.read([frame, iris], risers, convs, rules, fades, wipes, icons, inks, draws);
      const t = clamp01((vh - rr.top) / (vh + rr.height));
      if (drift) drift.style.transform = `translate3d(0, ${((t - 0.5) * -26).toFixed(1)}px, 0)`;

      if (frame) {
        const e = prog(frame, 0, 0.42);
        frame.style.opacity = String(clamp01(e * 2.2));
        frame.style.transform = `translate3d(0, ${((1 - e) * 110).toFixed(1)}px, 0) rotate(${(-(1 - e) * 7).toFixed(2)}deg) scale(${(0.9 + 0.1 * e).toFixed(4)})`;
      }
      if (iris) {
        const e = prog(iris, -40, 0.36);
        iris.style.clipPath = `circle(${(e * 78).toFixed(1)}% at 50% 50%)`;
        const im = iris.firstElementChild as HTMLElement | null;
        if (im) im.style.transform = `scale(${(1.4 - 0.4 * e).toFixed(4)})`;
      }
      // Same sweep the old background-position animation drew, now a compositor-only transform
      if (shine) shine.style.transform = `translate3d(${(-0.6154 * (120 - t * 240)).toFixed(2)}%, 0, 0)`;

      risers.forEach((el) => {
        const inner = el.querySelector<HTMLElement>("[data-inner]");
        if (!inner) return;
        const e = prog(el, Number(el.dataset.lag || 0));
        inner.style.transform = `translate3d(0, ${((1 - e) * 112).toFixed(1)}%, 0)`;
        inner.style.opacity = String(0.3 + 0.7 * e);
      });
      convs.forEach((el) => {
        const e = prog(el, Number(el.dataset.lag || 0), 0.24);
        el.style.opacity = String(e.toFixed(3));
        el.style.transform = `translate3d(${(Number(el.dataset.off) * (1 - e)).toFixed(3)}em, 0, 0)`;
      });
      rules.forEach((el) => {
        el.style.transform = `scaleX(${prog(el, Number(el.dataset.lag || 0), 0.14).toFixed(3)})`;
      });
      fades.forEach((el) => {
        const e = prog(el, Number(el.dataset.lag || 0), 0.18);
        el.style.opacity = String((0.15 + 0.85 * e).toFixed(3));
        el.style.transform = `translate3d(0, ${((1 - e) * 18).toFixed(1)}px, 0)`;
      });
      wipes.forEach((el) => {
        const e = prog(el, Number(el.dataset.lag || 0), 0.16);
        el.style.clipPath = `inset(-10% ${((1 - e) * 104).toFixed(1)}% -10% 0)`;
        el.style.opacity = String(0.2 + 0.8 * e);
        el.style.transform = `translate3d(${((1 - e) * -16).toFixed(1)}px, 0, 0)`;
      });
      icons.forEach((el) => {
        const e = prog(el, Number(el.dataset.lag || 0) + 30, 0.16);
        el.style.transform = `scale(${e.toFixed(3)}) rotate(${((1 - e) * -90).toFixed(1)}deg)`;
      });
      inks.forEach((el) => {
        const e = prog(el, Number(el.dataset.lag || 0), 0.2);
        el.style.clipPath = `inset(-6% ${((1 - e) * 104).toFixed(1)}% -6% 0)`;
      });
      draws.forEach((el) => {
        el.style.strokeDashoffset = String((1 - prog(el, 0, 0.22)).toFixed(3));
      });
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
    <div ref={rootRef} className="relative w-full overflow-clip text-left">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div
        className="relative w-full"
        style={{ aspectRatio: "941 / 1672", containerType: "inline-size" }}
      >
        {/* ===== Parchment: drifts slowly ===== */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -inset-y-[1%] will-change-transform"
          data-drift
        >
          {/* The shadow filter sits on the static parchment only; the shine moves outside of it */}
          <div
            className="absolute inset-0"
            style={{ filter: "drop-shadow(0 -12px 20px rgba(0,0,0,0.5))" }}
          >
            <Image
              src="/images/closechapter-mobile.webp"
              alt=""
              fill
              unoptimized
              sizes="100vw"
              className="object-fill select-none"
            />
          </div>
          <div
            className="cm-shine"
            style={{
              WebkitMaskImage: "url(/images/closechapter-mobile.webp)",
              maskImage: "url(/images/closechapter-mobile.webp)",
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
            }}
          >
            <div data-shine className="cm-shine-band" />
          </div>
        </div>

        {/* Gold dust */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[15]">
          {MOTES.map((m, i) => (
            <span
              key={i}
              className="animate-closer-mote absolute rounded-full bg-[#c9922f]"
              style={
                {
                  left: `${m.left}%`,
                  top: `${m.top}%`,
                  width: m.size,
                  height: m.size,
                  boxShadow: "0 0 7px 1px rgba(201,146,47,0.55)",
                  animationDuration: `${m.dur}s`,
                  animationDelay: `${m.delay}s`,
                  ["--dx" as string]: `${m.dx}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* ===== The scrapbook: dropped onto the page ===== */}
        <div className="absolute z-10" style={{ left: "4.4%", top: "6.4%", width: "69%" }}>
          <div
            data-s="frame"
            className="will-change-transform"
            style={{ opacity: 0 }}
          >
            <div className="cm-float">
              {/* Crop the trailing flower stem: show the top 81% of the artwork */}
              <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: "1096 / 1160" }}
              >
                <div
                  className="absolute top-0 left-0 w-full"
                  style={{ aspectRatio: "1096 / 1436" }}
                >
                  {/* Photo in the frame's card, developing through an iris */}
                  <div
                    className="absolute z-[4] shadow-[0_4px_16px_rgba(40,30,20,0.3)]"
                    style={{
                      top: "9.89%",
                      left: "38.14%",
                      width: "33.3%",
                      height: "55.71%",
                      transform: "rotate(5.2deg)",
                      transformOrigin: "0 0",
                    }}
                  >
                    <div
                      data-s="iris"
                      className="relative h-full w-full overflow-hidden"
                      style={{ clipPath: "circle(0% at 50% 50%)" }}
                    >
                      <Image
                        src="/images/close-chapter-photo.webp"
                        alt="Private Archive"
                        fill
                        unoptimized
                        sizes="60vw"
                        className="object-cover will-change-transform"
                        style={{ transform: "scale(1.4)" }}
                      />
                    </div>
                  </div>

                  <Image
                    src="/images/photoFrameclosechapter.webp"
                    alt="Private Archive scrapbook frame"
                    fill
                    unoptimized
                    sizes="70vw"
                    className="pointer-events-none z-[3] object-contain select-none"
                    style={{ filter: "drop-shadow(0 2.4cqw 2.6cqw rgba(60,35,12,0.4))" }}
                  />

                  {/* The wax seal breathes */}
                  <span
                    aria-hidden="true"
                    className="cm-seal pointer-events-none absolute z-[5] rounded-full"
                    style={{
                      left: "18.6%",
                      top: "50.2%",
                      width: "24%",
                      height: "18.3%",
                      background:
                        "radial-gradient(closest-side, rgba(255,214,140,0.7), rgba(255,190,100,0) 100%)",
                      mixBlendMode: "screen",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Handwritten note beside the frame */}
        <div className="absolute z-10" style={{ left: "75%", top: "33%", width: "23%" }}>
          <p
            className="font-allura allura-regular font-script font-cursive origin-top-left -rotate-[8deg] leading-[1.08] tracking-normal text-[#493c33]"
            style={{ fontSize: "5.6cqw" }}
          >
            {NOTE.map((l, i) => (
              <span
                key={l}
                data-s="ink"
                data-lag={i * 28}
                className="block whitespace-nowrap"
                style={{ clipPath: "inset(-6% 104% -6% 0)" }}
              >
                {l}
              </span>
            ))}
          </p>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#493c33"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-[1.4cqw] ml-[3cqw] -rotate-[8deg] opacity-85"
            style={{ width: "5.2cqw", height: "5.2cqw" }}
            aria-hidden="true"
          >
            <path
              data-s="draw"
              pathLength={1}
              style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
              d="M12 20.5C12 20.5 3.5 15.2 3.5 8.7C3.5 5.8 5.7 3.5 8.5 3.5C10.2 3.5 11.6 4.4 12 5.5C12.4 4.4 13.8 3.5 15.5 3.5C18.3 3.5 20.5 5.8 20.5 8.7C20.5 15.2 12 20.5 12 20.5Z"
            />
          </svg>
        </div>

        {/* ===== Copy ===== */}
        <div
          className="absolute z-20 text-center"
          style={{ left: "10%", top: "48.4%", width: "80%" }}
        >
          <div
            className="flex items-center justify-center font-serif font-medium tracking-[0.28em] text-[#635548] uppercase"
            style={{ fontSize: "2.2cqw", gap: "2.4cqw" }}
          >
            <span
              data-s="rule"
              className="block h-px origin-right bg-gradient-to-l from-[#8a6a3a] to-transparent"
              style={{ width: "9cqw", transform: "scaleX(0)" }}
            />
            <Rise>The private archive</Rise>
            <span
              data-s="rule"
              className="block h-px origin-left bg-gradient-to-r from-[#8a6a3a] to-transparent"
              style={{ width: "9cqw", transform: "scaleX(0)" }}
            />
          </div>

          <h2
            aria-label="A CLOSER CHAPTER"
            className="font-serif font-normal tracking-[-0.01em] text-[#191411]"
            style={{ fontSize: "9.2cqw", lineHeight: 0.96, marginTop: "2cqw" }}
          >
            <Converge line="A CLOSER" />
            <Converge line="CHAPTER" />
          </h2>

          <p
            data-s="fade"
            className="mx-auto font-serif font-normal text-[#55473c]"
            style={{
              fontSize: "2.95cqw",
              lineHeight: 1.55,
              marginTop: "2.6cqw",
              maxWidth: "88%",
              opacity: 0.15,
            }}
          >
            An exclusive space for early access, special drops, and stories that we share only with
            our closest community.
          </p>

          <ul
            className="mx-auto inline-flex flex-col text-left"
            style={{ marginTop: "3.6cqw", gap: "2.5cqw" }}
          >
            {BENEFITS.map(({ Icon, text }, i) => (
              <li
                key={text}
                data-s="wipe"
                data-lag={i * 14}
                className="flex items-center"
                style={{ gap: "3cqw", clipPath: "inset(-10% 104% -10% 0)", opacity: 0.2 }}
              >
                <span
                  data-s="icon"
                  data-lag={i * 14}
                  className="shrink-0 text-[#42362c] will-change-transform"
                  style={{ transform: "scale(0)" }}
                >
                  <Icon strokeWidth={1.3} style={{ width: "4.4cqw", height: "4.4cqw" }} />
                </span>
                <span
                  className="font-serif text-[#322a24]"
                  style={{ fontSize: "3cqw", letterSpacing: "0.015em" }}
                >
                  {text}
                </span>
              </li>
            ))}
          </ul>

          <div data-s="fade" data-lag={20} style={{ marginTop: "4.4cqw", opacity: 0.15 }}>
            <button
              type="button"
              className="cm-btn group relative flex w-full cursor-pointer items-center justify-between overflow-hidden bg-[#171310] font-serif font-medium tracking-[0.2em] text-[#f7f3ea] uppercase shadow-[0_6px_20px_rgba(20,15,10,0.4)] transition-colors duration-300 active:bg-[#2b231d]"
              style={{ height: "8cqw", padding: "0 5cqw", fontSize: "2.5cqw" }}
            >
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                aria-hidden="true"
              >
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="none"
                  stroke="#e6c98f"
                  strokeWidth="1.6"
                  pathLength={1}
                  className="closer-cta-run"
                />
              </svg>
              <span className="relative">Join the private archive</span>
              <span
                className="relative transition-transform duration-300 group-hover:translate-x-1"
                style={{ fontSize: "3.6cqw" }}
              >
                &rarr;
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
