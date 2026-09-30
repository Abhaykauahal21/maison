"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS } from "./types";
import { smoothScrollTo } from "@/lib/smooth-scroll";
import { makeTops, nearViewport } from "@/lib/scrub";

/**
 * BLOGPOSTS: mobile (< md).
 * A dark, warm page instead of the desktop collage: soft-focus garden behind, the header up top,
 * then the three stories as a deck that PINS and swipes left as you scroll down (and back as
 * you scroll up).
 *
 * Scroll-scrubbed header (plays forward AND backward): eyebrow rule, letter-by-letter heading,
 * description lines, button, and a handwritten line written by the scroll.
 * Carousel: the centred card is full size, its neighbours sit back; photos drift against the swipe
 * (parallax); dots + counter follow; a hint nudges until the first swipe.
 */

const STYLES = `
.bm-nudge { animation: bm-nudge 1.8s ease-in-out infinite; }
@keyframes bm-nudge { 0%,100% { transform: translateX(0); opacity: .55; } 50% { transform: translateX(7px); opacity: 1; } }
.bm-btn { position: relative; overflow: hidden; isolation: isolate; }
.bm-btn::before { content: ""; position: absolute; inset: 0; z-index: -1; background: #e6c98f; transform: translateX(-101%); transition: transform .55s cubic-bezier(.22,1,.36,1); }
.bm-btn:hover::before, .bm-btn:active::before, .bm-btn:focus-visible::before { transform: none; }
@media (prefers-reduced-motion: reduce) { .bm-nudge { animation: none; } }
`;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};

const HEADING = "BLOGPOSTS";
const DESC = [
  "Stories, style notes, behind the scenes",
  "and little pieces of inspiration —",
  "straight from our world to yours.",
];
const QUOTE = ["More than fashion,", "Stories that", "Stay with you."];

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
    <span
      data-inner
      className="block will-change-transform"
      style={{ transform: "translateY(112%)" }}
    >
      {children}
    </span>
  </span>
);

export const BlogMobile: React.FC = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLSpanElement | null>(null);
  const [active, setActive] = useState(0);
  const [swiped, setSwiped] = useState(false);

  // Vertical scroll scrub: header lines, rules, quote, deck entrance, background drift
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const q = <T extends HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T>(sel));
    const risers = q("[data-s='rise']");
    const rules = q("[data-s='rule']");
    const inks = q("[data-s='ink']");
    const fades = q("[data-s='fade']");

    const drift = root.querySelector<HTMLElement>("[data-drift]");

    let raf = 0;
    const T = makeTops();
    const prog = (el: Element, lag = 0, span = 0.17) => {
      const vh = window.innerHeight;
      return smooth((vh * 1.0 - T.top(el) - lag) / (vh * span));
    };
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const rr = root.getBoundingClientRect();
      // offscreen: nothing to do (this handler runs on every scroll, for every section)
      if (!nearViewport(rr, vh)) return;
      // all reads first (one style/layout pass), then all writes
      T.read(risers, rules, inks, fades);
      const sp = clamp01((vh - rr.top) / (vh + rr.height));
      if (drift) drift.style.transform = `translate3d(0, ${((sp - 0.5) * -40).toFixed(1)}px, 0)`;

      risers.forEach((el) => {
        const inner = el.querySelector<HTMLElement>("[data-inner]");
        if (!inner) return;
        const e = prog(el, Number(el.dataset.lag || 0));
        inner.style.transform = `translate3d(0, ${((1 - e) * 112).toFixed(1)}%, 0)`;
        inner.style.opacity = String(0.3 + 0.7 * e);
      });
      rules.forEach((el) => {
        el.style.transform = `scaleX(${prog(el, Number(el.dataset.lag || 0), 0.14).toFixed(3)})`;
      });
      inks.forEach((el) => {
        const e = prog(el, Number(el.dataset.lag || 0), 0.2);
        el.style.clipPath = `inset(-6% ${((1 - e) * 104).toFixed(1)}% -6% 0)`;
      });
      fades.forEach((el) => {
        const e = prog(el, Number(el.dataset.lag || 0), 0.2);
        el.style.opacity = String(0.2 + 0.8 * e);
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

  // Pinned track: vertical scroll drives the strip sideways (cards swipe left as you scroll).
  // `p` is eased toward the real scroll position so the motion glides instead of stepping.
  useEffect(() => {
    const track = trackRef.current;
    const strip = stripRef.current;
    if (!track || !strip) return;
    const n = BLOG_POSTS.length;
    let raf = 0;
    let target = 0;
    let cur = 0;
    let lastActive = -1;
    let lastSwiped = false;

    const cards = Array.from(strip.children) as HTMLElement[];
    let step = 0;
    const measureStep = () => {
      const first = cards[0];
      const second = cards[1];
      step = first && second ? second.offsetLeft - first.offsetLeft : 0;
    };
    measureStep();
    const apply = (p: number) => {
      strip.style.transform = `translate3d(${(-p * (n - 1) * step).toFixed(2)}px, 0, 0)`;
      const pos = p * (n - 1);
      cards.forEach((card, i) => {
        const off = i - pos; // -1 just passed, 0 centred, 1 next
        const a = Math.min(1, Math.abs(off));
        card.style.transform = `scale(${(1 - a * 0.07).toFixed(4)}) rotate(${(off * 1.6).toFixed(2)}deg)`;
        card.style.opacity = String((1 - a * 0.5).toFixed(3));
        const img = card.querySelector<HTMLElement>("[data-parallax]");
        if (img) img.style.transform = `translate3d(${(off * -14).toFixed(2)}%, 0, 0) scale(1.22)`;
      });
      const bar = barRef.current;
      if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
      const idx = Math.round(pos);
      if (idx !== lastActive) {
        lastActive = idx;
        setActive(idx);
      }
      const moved = p > 0.03;
      if (moved !== lastSwiped) {
        lastSwiped = moved;
        setSwiped(moved);
      }
    };

    const measure = () => {
      const r = track.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      target = span > 0 ? clamp01(-r.top / span) : 0;
    };
    const tick = () => {
      cur += (target - cur) * 0.14;
      if (Math.abs(target - cur) < 0.0005) {
        cur = target;
        raf = 0;
      } else {
        raf = requestAnimationFrame(tick);
      }
      apply(cur);
    };
    const onScroll = () => {
      measure();
      if (target === cur) return; // settled (e.g. the deck is far offscreen): nothing to write
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onResize = () => {
      measureStep();
      measure();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    measure();
    cur = target;
    apply(cur);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const span = track.offsetHeight - window.innerHeight;
    const top = track.getBoundingClientRect().top + window.scrollY;
    smoothScrollTo(top + (i / (BLOG_POSTS.length - 1)) * span);
  };

  return (
    <div ref={rootRef} className="relative w-full overflow-clip bg-[#0e0d0c] text-left">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* Soft-focus atmosphere, drifting with the scroll */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -inset-y-[4%] will-change-transform"
        data-drift
      >
        <Image
          src="/images/BlogPage-web.webp"
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="scale-150 object-cover object-[22%_40%] opacity-50 blur-[3px] select-none"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0e0d0c 0%, rgba(14,13,12,0.55) 12%, rgba(14,13,12,0.45) 55%, rgba(14,13,12,0.85) 90%, #0e0d0c 100%)",
        }}
      />

      <div className="relative z-10 pt-[20vw] pb-[2vw]">
        {/* ---- Header ---- */}
        <div className="px-[7%]">
          <div className="flex items-center gap-3 font-sans text-[11px] font-medium tracking-[0.26em] text-white/85 uppercase">
            <span
              data-s="rule"
              className="block h-px w-9 origin-left bg-gradient-to-r from-[#f0d9a0] to-[#f0d9a0]/30"
              style={{ transform: "scaleX(0)" }}
            />
            <Rise>From our journal</Rise>
          </div>

          <h2
            aria-label={HEADING}
            className="mt-3 flex font-serif leading-[0.95] font-normal tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
            style={{ fontSize: "clamp(40px,12.6vw,72px)" }}
          >
            {Array.from(HEADING).map((ch, i) => (
              <Rise key={i} lag={i * 14}>
                <span aria-hidden="true">{ch}</span>
              </Rise>
            ))}
          </h2>

          <p className="mt-4 max-w-[430px] font-serif text-[14.5px] leading-[1.55] text-[#f4ebdd] drop-shadow-[0_1px_5px_rgba(0,0,0,0.9)]">
            {DESC.map((l, i) => (
              <Rise key={l} lag={30 + i * 20}>
                {l}
              </Rise>
            ))}
          </p>

          <div data-s="fade" className="mt-6" style={{ opacity: 0.2 }}>
            <Link
              href="/blog"
              className="bm-btn group inline-flex items-center gap-6 bg-[#fbf7ee] px-7 py-3 font-serif text-[11px] font-medium tracking-[0.22em] text-[#1c1510] uppercase shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-transform duration-300 active:scale-[0.98]"
            >
              <span>Read our journal</span>
              <span
                className="transition-transform duration-300 group-hover:translate-x-1.5"
                aria-hidden="true"
              >
                &rarr;
              </span>
            </Link>
          </div>
        </div>

        {/* Handwritten line, written by the scroll */}
        <p
          aria-hidden="true"
          className="font-allura allura-regular font-script font-cursive mt-9 origin-left -rotate-[4deg] px-[7%] leading-[1.08] tracking-wide text-white/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)]"
          style={{ fontSize: "clamp(30px,9.4vw,46px)" }}
        >
          {QUOTE.map((l, i) => (
            <span
              key={l}
              data-s="ink"
              data-lag={i * 30}
              className="block"
              style={{ clipPath: "inset(-6% 104% -6% 0)", paddingLeft: `${i * 1.3}em` }}
            >
              {l}
            </span>
          ))}
        </p>

        {/* ---- The deck: pinned, vertical scroll swipes the cards left ---- */}
        <div
          ref={trackRef}
          className="relative mt-4"
          style={{ height: `calc(100svh + ${(BLOG_POSTS.length - 1) * 75}svh)` }}
        >
          <div className="sticky top-0 flex h-[100svh] flex-col justify-end overflow-hidden pt-14 pb-[16vw]">
            <div className="mb-5 flex items-center justify-between px-[7%]">
              <span className="font-serif text-[11px] tracking-[0.26em] text-[#f0e3c9]/85 uppercase">
                The stories
              </span>
              <span className="font-serif text-[11px] tracking-[0.2em] text-[#f0e3c9]/85">
                {String(active + 1).padStart(2, "0")} / {String(BLOG_POSTS.length).padStart(2, "0")}
              </span>
            </div>

            <div
              ref={stripRef}
              role="list"
              aria-label="Blog posts"
              className="flex gap-4 px-[11vw] will-change-transform"
            >
              {BLOG_POSTS.map((post, i) => (
                <article
                  key={post.id}
                  role="listitem"
                  className="w-[78vw] max-w-[380px] shrink-0 will-change-transform"
                  style={{ transformOrigin: "50% 60%" }}
                >
                  <Link
                    href={post.href || "#"}
                    aria-label={`Read blog post: ${post.title}`}
                    className="group block overflow-hidden rounded-[3px] bg-[#fbf7ee] shadow-[0_22px_40px_-10px_rgba(0,0,0,0.65)]"
                  >
                    <div className="relative aspect-[5/4] w-full overflow-hidden bg-[#241c15]">
                      <div
                        data-parallax
                        className="absolute inset-0 will-change-transform"
                        style={{ transform: "scale(1.22)" }}
                      >
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          unoptimized
                          sizes="80vw"
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 rounded-full bg-[#0e0d0c]/60 px-3 py-1 font-sans text-[9px] font-medium tracking-[0.22em] text-[#f0e3c9] uppercase backdrop-blur-sm">
                        {post.category}
                      </span>
                      <span className="absolute right-4 bottom-3 font-serif text-[26px] leading-none text-white/90 italic">
                        0{i + 1}
                      </span>
                    </div>

                    <div className="px-5 pt-4 pb-5">
                      <div className="font-sans text-[10px] font-medium tracking-[0.22em] text-[#7a6a59] uppercase">
                        {post.date}
                      </div>
                      <h3 className="mt-2 font-serif text-[20px] leading-[1.22] font-normal tracking-tight text-[#1d1611]">
                        {post.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 font-serif text-[13px] leading-[1.55] text-[#554638]">
                        {post.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-serif text-[11px] tracking-[0.2em] text-[#8a6a3a] uppercase">
                          Read story
                        </span>
                        <span
                          aria-hidden="true"
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#8a7764]/45 text-[#382b20] transition-all duration-300 group-active:bg-[#eae0cf]"
                        >
                          &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {/* Progress line, dots + scroll hint */}
            <div className="mt-6 px-[7%]">
              <span className="relative block h-px w-full bg-white/20">
                <span
                  ref={barRef}
                  className="absolute inset-0 origin-left bg-[#e6c98f]"
                  style={{ transform: "scaleX(0)" }}
                />
              </span>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2" role="tablist" aria-label="Choose a post">
                  {BLOG_POSTS.map((p, i) => (
                    <button
                      key={p.id}
                      type="button"
                      role="tab"
                      aria-selected={active === i}
                      aria-label={`Show post ${i + 1}`}
                      onClick={() => goTo(i)}
                      className="h-[3px] cursor-pointer rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{
                        width: active === i ? 34 : 12,
                        background: active === i ? "#e6c98f" : "rgba(255,255,255,0.35)",
                      }}
                    />
                  ))}
                </div>
                {!swiped && (
                  <span className="bm-nudge inline-flex items-center gap-1 font-serif text-[11px] tracking-[0.2em] text-[#e6c98f] uppercase">
                    Scroll <span aria-hidden="true">&darr;</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
