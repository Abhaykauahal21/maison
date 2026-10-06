"use client";

import { smoothScrollTo } from "@/lib/smooth-scroll";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * THE DREAM: desktop (lg+).
 * A quiet editorial sequence rather than an effects reel. One pinned stage, the photograph
 * slowly dollies, and three pieces of copy hand over to each other on the left, every line
 * rising out of its own mask (no blur, no glow). The two looks arrive as printed plates with
 * captions underneath. The model on the right is left alone until the plates arrive.
 */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const sm = (p: number, a: number, b: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const PILLARS = [
  { label: "Aspirations", note: "The first spark" },
  { label: "What-ifs", note: "The quiet questions" },
  { label: "Courage", note: "The leap itself" },
];

const CARDS = [
  {
    numeral: "I",
    titleLines: "The Daydream",
    lines: ["Light as a thought,", "bold as a beginning."],
    src: "/images/daydream.webp",
    alt: "Maison D'Vine The Daydream Ivory Floral Gown",
    drop: 0,
  },
  {
    numeral: "II",
    titleLines: "The Awakening",
    lines: ["For the day I", "chose myself."],
    src: "/images/awakening.webp",
    alt: "Maison D'Vine The Awakening Noir Silk Gown",
    drop: 7,
  },
];

// Scene timing along the scroll (0..1): [inStart, inEnd, outStart, outEnd]
// Stage 01 gets a long hold (it is the first thing seen on arrival), so the others start later.
const SCENE_A = [0, 0, 0.3, 0.4];
const SCENE_B = [0.4, 0.5, 0.72, 0.8];
const SCENE_C = [0.8, 0.9, 2, 3];
const PILLAR_START = 0.46;
const PILLAR_END = 0.72;

const SHADOW = "0 1px 2px rgba(0,0,0,0.5), 0 3px 28px rgba(0,0,0,0.55)";
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/** A line of copy that rises out of its own mask. */
const Rise: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  timed?: { entered: boolean; delay: number };
}> = ({ children, className = "", style, timed }) => (
  <span className={`block overflow-hidden pb-[0.14em] -mb-[0.14em] ${className}`} style={style}>
    <span data-r className="block will-change-transform" style={{ transform: "translateY(105%)" }}>
      {timed ? (
        <span
          className="block"
          style={{
            transform: timed.entered ? "none" : "translateY(105%)",
            transition: `transform 1.3s ${EASE} ${timed.delay}ms`,
          }}
        >
          {children}
        </span>
      ) : (
        children
      )}
    </span>
  </span>
);

/** "Stage N": gold script + Bodoni numeral (the Chapter-0 look). Rises/leaves through its own mask. */
const StageTag: React.FC<{ n: string; timed?: { entered: boolean; delay: number } }> = ({ n, timed }) => (
  <Rise
    style={{ padding: "0.25em 0.6em 0.3em 0", margin: "-0.25em -0.6em -0.12em 0" }}
    timed={timed}
  >
    <div
      className="flex items-center gap-[0.8vw] select-none"
      style={{ filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.55))" }}
    >
      <span className="chapter-gold chapter-gold-light chapter-shine font-allura allura-regular font-script font-cursive pr-[0.15em] text-[clamp(38px,3.8vw,78px)] leading-none">
        Stage
      </span>
      <span className="chapter-gold chapter-gold-light chapter-shine font-bodoni text-[clamp(44px,4.4vw,90px)] leading-none font-normal italic">
        {n}
      </span>
      <span
        className="h-px bg-[#e6c98f]/70"
        style={{
          width: timed && !timed.entered ? 0 : "3vw",
          transition: `width 1.6s ${EASE} 1400ms`,
        }}
        aria-hidden="true"
      />
    </div>
  </Rise>
);

export const DreamDesktop: React.FC = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          io.disconnect();
        }
      },
      // fire when the stage is about to pin (track top within the upper 40% of the viewport),
      // so Stage 01 writes itself in while it is actually on screen
      { rootMargin: "0px 0px -60% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    const q = <T extends HTMLElement>(root: ParentNode, sel: string) =>
      Array.from(root.querySelectorAll<T>(sel));
    const one = <T extends HTMLElement>(sel: string) => stage.querySelector<T>(sel);

    const cam = one("[data-cam]");
    const scenes = [
      { el: one("[data-sa]"), t: SCENE_A },
      { el: one("[data-sb]"), t: SCENE_B },
      { el: one("[data-sc]"), t: SCENE_C },
    ].map((s) => ({ ...s, lines: s.el ? q<HTMLElement>(s.el, "[data-r]") : [] }));
    const pillars = q<HTMLElement>(stage, "[data-pillar]");
    const pillarRules = q<HTMLElement>(stage, "[data-pillar-rule]");
    const fades = q<HTMLElement>(stage, "[data-fade]");
    const cards = q<HTMLElement>(stage, "[data-card]");
    const plates = q<HTMLElement>(stage, "[data-plate]");
    const captions = q<HTMLElement>(stage, "[data-caption]");
    const frames = q<HTMLElement>(stage, "[data-frame]");
    const numerals = q<HTMLElement>(stage, "[data-numeral]");
    const caplines = q<HTMLElement>(stage, "[data-capline]");
    const cta = one("[data-cta]");
    const cue = one("[data-cue]");
    const bar = one("[data-bar]");

    let target = 0;
    let cur = 0;
    let raf = 0;

    const apply = (p: number) => {
      // Camera: a slow, steady push, nothing more
      if (cam) {
        cam.style.transform = `translate3d(${(-1.6 * p).toFixed(3)}vw, 0, 0) scale(${(1.05 + 0.1 * p).toFixed(4)})`;
      }
      if (cue) cue.style.opacity = String(1 - sm(p, 0, 0.04));
      if (bar) bar.style.transform = `scaleY(${p.toFixed(4)})`;

      // Copy hands over: each line rises in, then leaves through the top of its mask
      scenes.forEach(({ el, t, lines }) => {
        if (!el) return;
        const visible = p > t[0] - 0.001 && p < t[3] + 0.001;
        el.style.visibility = visible || t[0] === 0 ? "visible" : "hidden";
        lines.forEach((ln, j) => {
          const inn = t[0] === 0 ? 1 : sm(p, t[0] + j * 0.008, t[1] + j * 0.008);
          const out = sm(p, t[2] + j * 0.006, t[3] + j * 0.006);
          ln.style.transform = `translate3d(0, ${((1 - inn) * 105 - out * 105).toFixed(2)}%, 0)`;
        });
      });

      // Fades (paragraph, rules) follow scene B
      const bIn = sm(p, SCENE_B[0] + 0.05, SCENE_B[1] + 0.05);
      const bOut = sm(p, SCENE_B[2], SCENE_B[3]);
      fades.forEach((f) => {
        const v = bIn * (1 - bOut);
        f.style.opacity = String(v);
        f.style.filter = v < 0.99 ? `blur(${((1 - v) * 7).toFixed(1)}px)` : "none";
        f.style.transform = `translate3d(0, ${((1 - bIn) * 16 - bOut * 10).toFixed(1)}px, 0)`;
      });

      // II: one thread at a time takes the light
      const slice = (PILLAR_END - PILLAR_START) / PILLARS.length;
      pillars.forEach((el, i) => {
        const s = PILLAR_START + i * slice;
        const on = sm(p, s - 0.015, s + 0.015);
        const off = i === PILLARS.length - 1 ? 0 : sm(p, s + slice - 0.015, s + slice + 0.015);
        const a = on * (1 - off);
        el.style.opacity = String(0.3 + 0.7 * a);
        el.style.transform = `translate3d(${(a * 1.6).toFixed(2)}vw, 0, 0) scale(${(1 + 0.05 * a).toFixed(4)})`;
        el.style.filter = a > 0.02 ? `drop-shadow(0 0 ${(a * 16).toFixed(1)}px rgba(230,201,143,${(a * 0.4).toFixed(2)}))` : "none";
        const num = el.querySelector<HTMLElement>("[data-pnum]");
        if (num) num.style.opacity = String(0.45 + 0.55 * a);
        const rule = pillarRules[i];
        if (rule) rule.style.transform = `scaleX(${a.toFixed(3)})`;
      });

      // III: the looks arrive as plates, and keep drifting at their own pace
      cards.forEach((el, i) => {
        const a = 0.82 + i * 0.06;
        const e = sm(p, a, a + 0.14);
        const drift = sm(p, 0.9, 1) * (i ? -1.5 : 1.5);
        el.style.opacity = String(clamp01(e * 5));
        el.style.transform = `translate3d(0, ${((1 - e) * 14 + CARDS[i].drop + drift).toFixed(2)}vh, 0) rotate(${((1 - e) * (i ? 3.5 : -3.5)).toFixed(2)}deg)`;
        const fr = frames[i];
        if (fr) {
          const f = sm(p, a + 0.06, a + 0.17);
          fr.style.opacity = String(f);
          fr.style.transform = `scale(${(1.08 - 0.08 * f).toFixed(4)})`;
        }
        const nu = numerals[i];
        if (nu) {
          nu.style.opacity = String(sm(p, a + 0.04, a + 0.16));
          nu.style.transform = `translate3d(0, ${((1 - sm(p, a + 0.04, a + 0.16)) * 3).toFixed(2)}vw, 0)`;
        }
        el.style.pointerEvents = e > 0.6 ? "auto" : "none";
        const plate = plates[i];
        if (plate) plate.style.clipPath = `inset(0 0 ${((1 - e) * 100).toFixed(2)}% 0)`;
        const im = plate?.querySelector<HTMLElement>("[data-plate-img]");
        if (im) im.style.transform = `scale(${(1.3 - 0.3 * e).toFixed(4)})`;
        const cap = captions[i];
        if (cap) {
          const c = sm(p, a + 0.1, a + 0.18);
          cap.style.opacity = String(c);
          cap.style.transform = `translate3d(0, ${((1 - c) * 10).toFixed(2)}px, 0)`;
          const cl = caplines[i];
          if (cl) cl.style.transform = `scaleX(${c.toFixed(3)})`;
        }
      });
      if (cta) {
        const e = sm(p, 0.9, 0.97);
        cta.style.opacity = String(e);
        cta.style.transform = `translate3d(0, ${((1 - e) * 14).toFixed(2)}px, 0)`;
        cta.style.pointerEvents = e > 0.6 ? "auto" : "none";
      }
    };

    const measure = () => {
      const rect = track.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      target = span > 0 ? clamp01(-rect.top / span) : 0;
    };

    const tick = () => {
      cur += (target - cur) * 0.11;
      if (Math.abs(target - cur) < 0.0004) {
        cur = target;
        raf = 0;
      } else {
        raf = requestAnimationFrame(tick);
      }
      apply(cur);
    };

    const onScroll = () => {
      measure();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    measure();
    cur = target;
    apply(cur);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const eyebrow =
    "font-serif text-[clamp(12px,0.98vw,19px)] font-medium uppercase tracking-[0.34em] text-[#f0d9a6]";

  return (
    <div ref={trackRef} className="relative w-full bg-[#0a0908]" style={{ height: "540vh" }}>
      <div ref={stageRef} className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Photograph: fades up from black once, then dollies with the scroll */}
        <div
          className="absolute inset-0 z-0"
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? "scale(1)" : "scale(1.05)",
            transition: `opacity 1.8s ease-out, transform 2.6s ${EASE}`,
          }}
        >
          <div
            data-cam
            className="absolute inset-0 will-change-transform"
            style={{ transform: "scale(1.05)", transformOrigin: "60% 55%" }}
          >
            <Image
              src="/images/dream-bg.webp"
              alt="Maison D'Vine The Dream Collection"
              fill
              unoptimized
              sizes="100vw"
              className="pointer-events-none object-cover object-[50%_32%] select-none"
            />
          </div>
        </div>

        {/* Reading shade on the left, seams into neighbouring sections */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background:
              "linear-gradient(90deg, rgba(8,6,5,0.86) 0%, rgba(8,6,5,0.66) 28%, rgba(8,6,5,0.25) 48%, transparent 64%), linear-gradient(180deg, #0a0908 0%, rgba(10,9,8,0) 10%, rgba(10,9,8,0) 88%, #0a0908 100%)",
          }}
        />

        {/* Copy */}
        <div className="absolute top-1/2 left-[7%] z-20 grid w-[38%] -translate-y-1/2 items-center">
          {/* I */}
          <div data-sa className="col-start-1 row-start-1">
            <StageTag n="1" timed={{ entered, delay: 500 }} />
            <Rise
              className="mt-[0.9vw] font-serif text-[6.2vw] leading-[1.02] font-normal tracking-[0.03em] whitespace-nowrap text-white uppercase"
              style={{ textShadow: SHADOW }}
              timed={{ entered, delay: 700 }}
            >
              The Dream
            </Rise>
            <span
              className="mt-[1.3vw] block h-px bg-[#e6c98f]/80"
              style={{
                width: entered ? "5vw" : 0,
                transition: `width 1.6s ${EASE} 1400ms`,
              }}
            />
            <Rise
              className="mt-[1.3vw] font-serif text-[clamp(17px,1.75vw,36px)] leading-[1.4] text-[#fbf3e6] italic"
              style={{ textShadow: SHADOW }}
              timed={{ entered, delay: 1500 }}
            >
              Where my story begins
            </Rise>
            <Rise
              className="font-serif text-[clamp(17px,1.75vw,36px)] leading-[1.4] text-[#fbf3e6] italic"
              style={{ textShadow: SHADOW }}
              timed={{ entered, delay: 1620 }}
            >
              to take shape.
            </Rise>
          </div>

          {/* II */}
          <div data-sb className="col-start-1 row-start-1" style={{ visibility: "hidden" }}>
            <Rise className={eyebrow}>The Collection</Rise>
            <ul className="mt-[1.4vw]">
              {PILLARS.map((pl, i) => (
                <li key={pl.label} className="border-t border-[#e6c98f]/25 py-[0.9vw]">
                  <div data-pillar className="origin-left will-change-transform" style={{ opacity: 0.3 }}>
                    <Rise>
                      <span className="flex items-baseline gap-[1.3vw]">
                        <span data-pnum className="w-[1.6vw] font-serif text-[0.95vw] text-[#e6c98f]">
                          0{i + 1}
                        </span>
                        <span
                          className="font-serif text-[3.9vw] leading-[1.08] text-white italic"
                          style={{ textShadow: SHADOW }}
                        >
                          {pl.label}
                        </span>
                      </span>
                    </Rise>
                    <span
                      data-pillar-rule
                      className="mt-[0.4vw] ml-[2.9vw] block h-px w-[15vw] origin-left bg-gradient-to-r from-[#e6c98f] to-transparent"
                      style={{ transform: "scaleX(0)" }}
                    />
                  </div>
                </li>
              ))}
              <li className="border-t border-[#e6c98f]/25" />
            </ul>
            <p
              data-fade
              className="mt-[1.6vw] max-w-[28vw] font-serif text-[1vw] leading-[1.8] text-[#eee5d8]"
              style={{ opacity: 0, textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
            >
              The Dream Collection is inspired by the first chapter of every journey &mdash; my
              aspirations, my what-ifs, and the courage to dream it all.
            </p>
          </div>

          {/* III */}
          <div data-sc className="col-start-1 row-start-1" style={{ visibility: "hidden" }}>
            <Rise className={eyebrow}>The Looks</Rise>
            <Rise
              className="mt-[0.9vw] font-serif text-[4.4vw] leading-[1.08] text-white italic"
              style={{ textShadow: SHADOW }}
            >
              Two ways
            </Rise>
            <Rise
              className="font-serif text-[4.4vw] leading-[1.08] text-white italic"
              style={{ textShadow: SHADOW }}
            >
              to begin.
            </Rise>
            <div data-cta className="mt-[2.4vw]" style={{ opacity: 0, pointerEvents: "none" }}>
              <button
                type="button"
                onClick={() =>
                  smoothScrollTo(document.getElementById("step-1"))
                }
                className="group relative inline-flex cursor-pointer items-center gap-4 overflow-hidden bg-[#fdfbf7] px-[1.9vw] py-[0.85vw] font-serif text-[0.76vw] font-medium tracking-[0.22em] text-[#1c1815] uppercase shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-colors duration-300 hover:bg-[#e6c98f] active:scale-[0.98]"
              >
                <span aria-hidden="true" className="dream-shine pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                Explore the Dream
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* The two looks, as printed plates with captions */}
        <div className="absolute top-1/2 right-[4.5%] z-20 flex w-[35%] -translate-y-[54%] items-start gap-[2vw]">
          {CARDS.map((c) => (
            <div
              key={c.titleLines}
              data-card
              className="group relative flex-1 cursor-pointer will-change-transform"
              style={{ opacity: 0, pointerEvents: "none" }}
            >
              {/* ghost numeral behind the plate */}
              <span
                data-numeral
                aria-hidden="true"
                className="pointer-events-none absolute -top-[4.4vw] -left-[0.4vw] font-bodoni text-[8vw] leading-none text-[#e6c98f]/25 italic"
                style={{ opacity: 0 }}
              >
                {c.numeral}
              </span>
              {/* hairline gold frame that settles onto the plate */}
              <span
                data-frame
                aria-hidden="true"
                className="pointer-events-none absolute -inset-[0.55vw] bottom-auto border border-[#e6c98f]/45"
                style={{ opacity: 0, aspectRatio: "3 / 4.15" }}
              />
              <div
                data-plate
                className="relative overflow-hidden bg-[#12100e] shadow-[0_26px_50px_rgba(0,0,0,0.55)] transition-[transform,box-shadow] duration-500 group-hover:-translate-y-[0.5vw] group-hover:shadow-[0_34px_60px_rgba(0,0,0,0.65)]"
                style={{ aspectRatio: "3 / 4", clipPath: "inset(0 0 100% 0)" }}
              >
                <div data-plate-img className="absolute inset-0 will-change-transform">
                  <Image
                    src={c.src}
                    alt={c.alt}
                    fill
                    unoptimized
                    loading="lazy"
                    sizes="320px"
                    className="pointer-events-none object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                  />
                </div>
              </div>
              <div data-caption className="mt-[1.3vw]" style={{ opacity: 0 }}>
                <span data-capline aria-hidden="true" className="mb-[0.7vw] block h-px w-full origin-left bg-[#e6c98f]/50" style={{ transform: "scaleX(0)" }} />
                <div className="flex items-baseline gap-[0.7vw]">
                  <span className="font-serif text-[0.8vw] text-[#e6c98f]">{c.numeral}</span>
                  <span className="font-serif text-[1.05vw] tracking-[0.16em] text-white uppercase">
                    {c.titleLines}
                  </span>
                </div>
                <p className="mt-[0.4vw] font-serif text-[0.86vw] leading-[1.5] text-[#d4cbbf] italic">
                  {c.lines[0]} {c.lines[1]}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll cue + hairline progress */}
        <div
          data-cue
          className="absolute bottom-[8%] left-[7%] z-20 font-serif text-[0.62vw] tracking-[0.4em] text-white/70 uppercase"
        >
          Scroll
        </div>
        <div className="pointer-events-none absolute top-[14%] right-[1.6%] bottom-[14%] z-30 w-px bg-white/15">
          <div
            data-bar
            className="h-full w-full origin-top bg-[#e6c98f]"
            style={{ transform: "scaleY(0)" }}
          />
        </div>
      </div>
    </div>
  );
};
