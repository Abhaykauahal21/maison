"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS, getReadMinutes } from "./types";
import { JournalButton } from "./JournalButton";
import { makeTops } from "@/lib/scrub";

/**
 * BLOGPOSTS: desktop / tablet (md+). No cards: the stories are an oversized typographic index
 * over the rose-garden photograph.
 *  - each story is one huge serif headline on a hairline; hovering one dims the rest, slides the
 *    headline and brings a small print that follows the cursor with a little inertia and tilt
 *  - an outlined ribbon of the journal's categories slides sideways with the scroll
 *  - header, rules and rows are scroll-scrubbed (plays forward AND backward)
 * Touch screens (no hover) get a small thumbnail in every row instead of the cursor print.
 */

const HEADING = "BLOGPOSTS";
const QUOTE = ["More than fashion,", "Stories that", "Stay with you."];
const RIBBON = "Style Guide  ✦  Behind the Scenes  ✦  Inspiration  ✦  Style Guide  ✦  Behind the Scenes  ✦  Inspiration  ✦  ";

const TAPE_CLIP =
  "polygon(0 8%, 4% 0, 8% 10%, 12% 0, 92% 0, 96% 10%, 100% 0, 100% 92%, 96% 100%, 92% 90%, 88% 100%, 8% 100%, 4% 92%, 0 100%)";

const STYLES = `
.bd-row-title { transition: transform .7s cubic-bezier(.16,1,.3,1), color .4s ease; }
.bd-row-arrow { transition: transform .6s cubic-bezier(.16,1,.3,1), background-color .4s ease, border-color .4s ease, color .4s ease; }
.bd-print { transition: opacity .35s ease, transform .55s cubic-bezier(.16,1,.3,1); }
.bd-print-img { transition: opacity .45s ease, clip-path .7s cubic-bezier(.76,0,.24,1); }
@media (prefers-reduced-motion: reduce) { .bd-row-title, .bd-row-arrow, .bd-print, .bd-print-img { transition: none; } }
`;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};

const Rise: React.FC<{
  lag?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ lag = 0, className = "", style, children }) => (
  <span
    data-s="rise"
    data-lag={lag}
    className={`-mb-[0.14em] block overflow-hidden pb-[0.14em] ${className}`}
    style={style}
  >
    <span data-inner className="block will-change-transform" style={{ transform: "translateY(112%)" }}>
      {children}
    </span>
  </span>
);

export const BlogDesktop: React.FC = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const printRef = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const cursor = useRef({ x: 0, y: 0, tx: 0, ty: 0, rot: 0, raf: 0, on: false });

  // Scroll scrub: header, rules, rows, the category ribbon, and the garden drifting behind
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const q = <T extends Element>(sel: string) => Array.from(root.querySelectorAll<T>(sel));
    const risers = q<HTMLElement>("[data-s='rise']");
    const rules = q<HTMLElement>("[data-s='rule']");
    const inks = q<HTMLElement>("[data-s='ink']");
    const fades = q<HTMLElement>("[data-s='fade']");
    const bg = root.querySelector<HTMLElement>("[data-bg]");
    const ribbon = root.querySelector<HTMLElement>("[data-ribbon]");

    let raf = 0;
    const T = makeTops();
    const prog = (el: Element, lag = 0, span = 0.16) => {
      const vh = window.innerHeight;
      return smooth((vh * 0.96 - T.top(el) - lag) / (vh * span));
    };
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const rr = root.getBoundingClientRect();
      if (rr.width === 0 || rr.bottom < -100 || rr.top > vh + 100) return;
      // all reads first (one style/layout pass), then all writes
      T.read(risers, rules, inks, fades);
      const t = clamp01((vh - rr.top) / (vh + rr.height));
      if (bg) bg.style.transform = `translate3d(0, ${((t - 0.5) * -70).toFixed(1)}px, 0) scale(1.1)`;
      if (ribbon) ribbon.style.transform = `translate3d(${(-t * 34).toFixed(2)}%, 0, 0)`;

      risers.forEach((el) => {
        const inner = el.querySelector<HTMLElement>("[data-inner]");
        if (!inner) return;
        const e = prog(el, Number(el.dataset.lag || 0));
        inner.style.transform = `translate3d(0, ${((1 - e) * 112).toFixed(1)}%, 0)`;
        inner.style.opacity = String(0.3 + 0.7 * e);
      });
      rules.forEach((el) => {
        el.style.transform = `scaleX(${prog(el, Number(el.dataset.lag || 0), 0.12).toFixed(3)})`;
      });
      inks.forEach((el) => {
        const e = prog(el, Number(el.dataset.lag || 0), 0.18);
        el.style.clipPath = `inset(-6% ${((1 - e) * 104).toFixed(1)}% -6% 0)`;
      });
      fades.forEach((el) => {
        const e = prog(el, Number(el.dataset.lag || 0), 0.18);
        el.style.opacity = String(0.15 + 0.85 * e);
        el.style.transform = `translate3d(0, ${((1 - e) * 26).toFixed(1)}px, 0)`;
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

  // The print follows the cursor with inertia and leans into the movement
  const loop = () => {
    const c = cursor.current;
    const el = printRef.current;
    if (!el) {
      c.raf = 0;
      return;
    }
    c.x += (c.tx - c.x) * 0.13;
    c.y += (c.ty - c.y) * 0.13;
    const lean = Math.max(-9, Math.min(9, (c.tx - c.x) * 0.07));
    c.rot += (lean - c.rot) * 0.15;
    el.style.transform = `translate3d(${(c.x + 34).toFixed(1)}px, ${(c.y - 200).toFixed(1)}px, 0) rotate(${c.rot.toFixed(2)}deg)`;
    const settled = Math.abs(c.tx - c.x) < 0.4 && Math.abs(c.ty - c.y) < 0.4 && Math.abs(c.rot) < 0.05;
    c.raf = c.on || !settled ? requestAnimationFrame(loop) : 0;
  };
  const onListMove = (e: React.MouseEvent) => {
    const c = cursor.current;
    if (!c.on) {
      c.on = true;
      c.x = c.tx = e.clientX;
      c.y = c.ty = e.clientY;
    }
    c.tx = e.clientX;
    c.ty = e.clientY;
    if (!c.raf) c.raf = requestAnimationFrame(loop);
  };
  const onListLeave = () => {
    cursor.current.on = false;
    setHover(null);
  };
  useEffect(() => {
    const c = cursor.current;
    return () => cancelAnimationFrame(c.raf);
  }, []);

  return (
    <div ref={rootRef} className="relative w-full overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* The rose garden, drifting slowly */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div data-bg className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.1)" }}>
          <Image
            src="/images/BlogPage-web.webp"
            alt=""
            fill
            unoptimized
            sizes="100vw"
            className="object-cover object-center select-none"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e0d0c]/55 via-[#0e0d0c]/45 to-[#0a0807]/85" />
      </div>

      <div className="relative z-20 mx-auto w-full max-w-[1420px] px-8 pt-28 pb-24 lg:px-14 lg:pt-36 lg:pb-28 xl:px-16">
        {/* ===== Header ===== */}
        <div className="flex items-start justify-between gap-10">
          <div className="max-w-[600px]">
            <div className="flex items-center gap-3 font-sans text-[12px] font-medium tracking-[0.26em] text-white/85 uppercase">
              <span
                data-s="rule"
                className="block h-px w-10 origin-left bg-gradient-to-r from-[#f0d9a0] to-[#f0d9a0]/30"
                style={{ transform: "scaleX(0)" }}
              />
              <Rise>From our journal</Rise>
            </div>
            <h2
              aria-label={HEADING}
              className="mt-3 flex font-serif leading-[0.92] font-normal tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
              style={{ fontSize: "clamp(56px, 6vw, 104px)" }}
            >
              {Array.from(HEADING).map((ch, i) => (
                <Rise key={i} lag={i * 12}>
                  <span aria-hidden="true">{ch}</span>
                </Rise>
              ))}
            </h2>
            <p
              className="mt-5 max-w-[470px] font-serif leading-[1.55] text-[#f7efe4] drop-shadow-[0_1px_5px_rgba(0,0,0,0.9)]"
              style={{ fontSize: "clamp(15px, 1.15vw, 19px)" }}
            >
              {[
                "Stories, style notes, behind the scenes",
                "and little pieces of inspiration —",
                "straight from our world to yours.",
              ].map((l, i) => (
                <Rise key={l} lag={30 + i * 18}>
                  {l}
                </Rise>
              ))}
            </p>
            <div data-s="fade" data-lag={20} className="mt-7" style={{ opacity: 0.15 }}>
              <JournalButton href="/blog" />
            </div>
          </div>

          <p
            aria-hidden="true"
            className="font-allura allura-regular font-script font-cursive mt-6 origin-top-left -rotate-[4deg] text-right leading-[1.08] tracking-wide text-white/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)]"
            style={{ fontSize: "clamp(34px, 3.6vw, 62px)" }}
          >
            {QUOTE.map((l, i) => (
              <span
                key={l}
                data-s="ink"
                data-lag={i * 26}
                className="block"
                style={{ clipPath: "inset(-6% 104% -6% 0)", paddingRight: `${(2 - i) * 1.1}em` }}
              >
                {l}
              </span>
            ))}
          </p>
        </div>

        {/* ===== Ribbon: the journal's categories, sliding with the scroll ===== */}
        <div aria-hidden="true" className="relative mt-16 -mx-8 overflow-hidden lg:mt-20 lg:-mx-14 xl:-mx-16">
          <div
            data-ribbon
            className="font-serif leading-none font-normal whitespace-nowrap will-change-transform select-none"
            style={{
              fontSize: "clamp(56px, 8.5vw, 150px)",
              color: "transparent",
              WebkitTextStroke: "1px rgba(240,217,160,0.55)",
              transform: "translate3d(0,0,0)",
            }}
          >
            {RIBBON}
          </div>
        </div>

        {/* ===== The index ===== */}
        <div
          className="mt-14 lg:mt-16"
          role="list"
          aria-label="Journal stories"
          onMouseMove={onListMove}
          onMouseLeave={onListLeave}
        >
          {BLOG_POSTS.map((p, i) => {
            const dim = hover !== null && hover !== i;
            return (
              <div key={p.id} role="listitem" className="relative">
                <span
                  data-s="rule"
                  data-lag={i * 8}
                  className="block h-px w-full origin-left bg-white/30"
                  style={{ transform: "scaleX(0)" }}
                />
                <Link
                  href={p.href || "#"}
                  aria-label={`Read blog post: ${p.title}`}
                  onMouseEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  className="group grid grid-cols-[3.2rem_minmax(0,1fr)_auto_3.4rem] items-center gap-x-6 py-[clamp(22px,2.6vw,44px)] transition-opacity duration-500 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#e6c98f] lg:gap-x-10"
                  style={{ opacity: dim ? 0.32 : 1 }}
                >
                  <span
                    data-s="fade"
                    data-lag={i * 8}
                    className="font-serif text-[14px] tracking-[0.2em] text-[#e6c98f] tabular-nums"
                    style={{ opacity: 0.15 }}
                  >
                    0{i + 1}
                  </span>

                  <span className="min-w-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4 group-focus-visible:translate-x-4">
                    <Rise lag={i * 8}>
                      <span
                        className="bd-row-title block font-serif leading-[1.04] font-normal tracking-tight text-white group-hover:text-[#f3dfb6]"
                        style={{ fontSize: "clamp(32px, 4.6vw, 84px)" }}
                      >
                        {p.title}
                      </span>
                    </Rise>
                    <span
                      data-s="fade"
                      data-lag={i * 8 + 20}
                      className="mt-3 block max-w-[640px] truncate font-serif text-[#e9dfcf]/70"
                      style={{ fontSize: "clamp(13.5px, 1.05vw, 17px)", opacity: 0.15 }}
                    >
                      {p.description}
                    </span>
                  </span>

                  <span
                    data-s="fade"
                    data-lag={i * 8 + 10}
                    className="hidden text-right font-sans text-[11px] leading-[1.9] tracking-[0.22em] text-white/70 uppercase lg:block"
                    style={{ opacity: 0.15 }}
                  >
                    <span className="block text-[#e6c98f]">{p.category}</span>
                    <span className="block">{p.date}</span>
                    <span className="block text-white/45">{getReadMinutes(p)} min read</span>
                  </span>

                  <span className="flex items-center justify-end gap-3">
                    {/* touch screens have no cursor print: a small thumbnail instead */}
                    <span className="relative hidden h-16 w-12 overflow-hidden bg-[#241c15] [@media(hover:none)]:block">
                      <Image src={p.image} alt="" fill unoptimized sizes="48px" className="object-cover" />
                    </span>
                    <span
                      className="bd-row-arrow flex h-12 w-12 items-center justify-center rounded-full border border-white/35 text-white group-hover:border-[#e6c98f] group-hover:bg-[#e6c98f] group-hover:text-[#14100c] group-hover:-rotate-45"
                      aria-hidden="true"
                    >
                      &rarr;
                    </span>
                  </span>
                </Link>
              </div>
            );
          })}
          <span
            data-s="rule"
            data-lag={BLOG_POSTS.length * 8}
            className="block h-px w-full origin-left bg-white/30"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        <p
          aria-hidden="true"
          className="font-allura allura-regular font-script font-cursive mt-10 -rotate-[3deg] text-[#f0d9a0]/90"
          style={{ fontSize: "clamp(26px, 2.4vw, 40px)" }}
        >
          <span data-s="ink" className="block" style={{ clipPath: "inset(-6% 104% -6% 0)" }}>
            more stories, soon...
          </span>
        </p>
      </div>

      {/* The print that follows the cursor (fixed, so it is never clipped by the section) */}
      <div
        aria-hidden="true"
        ref={printRef}
        className="pointer-events-none fixed top-0 left-0 z-40 hidden [@media(hover:hover)]:block"
        style={{ width: 280, height: 360, transform: "translate3d(-999px,-999px,0)" }}
      >
        <div
          className="bd-print relative h-full w-full bg-[#fbf7ee] p-[10px] shadow-[0_28px_50px_-8px_rgba(0,0,0,0.7),0_4px_12px_rgba(0,0,0,0.4)]"
          style={{
            opacity: hover === null ? 0 : 1,
            transform: hover === null ? "scale(0.82)" : "scale(1)",
          }}
        >
          <div className="relative h-full w-full overflow-hidden bg-[#241c15]">
            {BLOG_POSTS.map((p, i) => (
              <div
                key={p.id}
                className="bd-print-img absolute inset-0"
                style={{
                  opacity: hover === i ? 1 : 0,
                  clipPath: hover === i ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
                  zIndex: hover === i ? 2 : 1,
                }}
              >
                <Image src={p.image} alt="" fill unoptimized sizes="280px" className="object-cover" />
              </div>
            ))}
          </div>
          <span
            className="absolute -top-2.5 left-1/2 h-[18px] w-[70px] -translate-x-1/2 bg-[#d6c291]/85 shadow-[0_1px_3px_rgba(60,40,20,0.3)]"
            style={{ clipPath: TAPE_CLIP, transform: "translateX(-50%) rotate(-4deg)" }}
          />
        </div>
      </div>
    </div>
  );
};
