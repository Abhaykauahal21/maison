"use client";

import { smoothScrollTo } from "@/lib/smooth-scroll";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { DreamParticles } from "@/components/dream/DreamParticles";

/**
 * THE DREAM: mobile / tablet scrollytelling (< lg).
 * One sticky, full-screen stage; scroll scrubs a four-scene film:
 *   I   Awaken  - the title looms over the portrait, then tears away
 *   II  Drift   - camera pushes into the gown, a line of poetry surfaces word by word
 *   III Thread  - the three threads of the collection, huge, one after another
 *   IV  Unveil  - the scene dims and two look-cards are dealt onto the table
 * Everything is driven by a single smoothed scroll value (no per-frame React renders),
 * so it plays forward on scroll down and rewinds on scroll up.
 */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const sm = (p: number, a: number, b: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const TITLE = "DREAM";
const QUOTE = "Where my story begins to take shape.".split(" ");
const PILLARS = ["Aspirations", "What-ifs", "Courage"];
const SCENES = ["I", "II", "III", "IV"];
const SCENE_STARTS = [0, 0.2, 0.46, 0.72];

const CARDS = [
  {
    numeral: "I",
    titleLines: ["THE", "DAYDREAM"],
    lines: ["Light as a thought,", "bold as a beginning."],
    src: "/images/daydream.webp",
    alt: "Maison D'Vine The Daydream Ivory Floral Gown",
    side: -1,
    rot: -7,
    dy: -3,
  },
  {
    numeral: "II",
    titleLines: ["THE", "AWAKENING"],
    lines: ["For the day I", "chose myself."],
    src: "/images/awakening.webp",
    alt: "Maison D'Vine The Awakening Noir Silk Gown",
    side: 1,
    rot: 6,
    dy: 5,
  },
];

export const DreamFilm: React.FC = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [entered, setEntered] = useState(false);
  const [front, setFront] = useState(1);

  // Entrance (time based, once): letters surface out of the haze
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
      // the locked peek (inert) only shows the top of this tall track, so any visibility counts there
      { threshold: el.closest("[inert]") ? 0 : 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Scroll scrub: target from layout, eased into `cur`, applied straight to the DOM
  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    const q = <T extends HTMLElement>(sel: string) =>
      Array.from(stage.querySelectorAll<T>(sel));
    const one = <T extends HTMLElement>(sel: string) => stage.querySelector<T>(sel);

    const img = one("[data-img]");
    const shade = one("[data-shade]");
    const cue = one("[data-cue]");
    const title = one("[data-title]");
    const quote = one("[data-quote]");
    const words = q("[data-word]");
    const scene3 = one("[data-scene3]");
    const pillars = q("[data-pillar]");
    const pillarLines = q("[data-pillar-line]");
    const para = one("[data-para]");
    const cardHead = one("[data-cardhead]");
    const cards = q("[data-card]");
    const cta = one("[data-cta]");
    const railFill = one("[data-rail-fill]");
    const railDots = q("[data-rail-dot]");

    const desk = window.matchMedia("(min-width: 1024px)");
    let target = 0;
    let cur = 0;
    let raf = 0;

    const apply = (p: number) => {
      // Camera: slow push toward the gown
      const zoom = sm(p, 0.12, 0.5);
      if (img) img.style.transform = `scale(${1.06 + 0.95 * zoom})`;

      // Reading shade: deepens behind the poetry and the three threads, eases off for the cards
      if (shade) {
        const up = sm(p, 0.17, 0.3);
        const down = sm(p, 0.7, 0.8);
        shade.style.opacity = String((up * (1 - 0.55 * down)).toFixed(3));
      }

      // I: title looms, then tears up and away
      const tOut = sm(p, 0.08, 0.22);
      if (title) {
        title.style.opacity = String(1 - sm(p, 0.1, 0.22));
        title.style.transform = `translate3d(0, ${-tOut * 30}vh, 0) scale(${1 + tOut * 0.4})`;
      }
      if (cue) cue.style.opacity = String(1 - sm(p, 0, 0.04));

      // II: poetry surfaces word by word
      const qIn = sm(p, 0.2, 0.28);
      const qOut = sm(p, 0.42, 0.49);
      if (quote) {
        quote.style.opacity = String(qIn * (1 - qOut));
        quote.style.transform = `translate3d(0, ${(1 - qIn) * 40 - qOut * 40}px, 0)`;
      }
      words.forEach((w, i) => {
        const a = 0.21 + i * 0.014;
        const e = sm(p, a, a + 0.035);
        w.style.opacity = String(0.12 + 0.88 * e);
      });

      // III: three threads + the story
      const s3In = sm(p, 0.46, 0.53);
      const s3Out = sm(p, 0.66, 0.72);
      if (scene3) {
        scene3.style.opacity = String(s3In * (1 - s3Out));
        scene3.style.transform = `translate3d(0, ${-s3Out * 40}px, 0)`;
      }
      pillars.forEach((el, i) => {
        const a = 0.47 + i * 0.035;
        const e = sm(p, a, a + 0.07);
        el.style.opacity = String(e);
        el.style.transform = `translate3d(${(1 - e) * -70}px, 0, 0)`;
        const ln = pillarLines[i];
        if (ln) ln.style.transform = `scaleX(${sm(p, a + 0.02, a + 0.11)})`;
      });
      if (para) {
        const e = sm(p, 0.57, 0.63);
        para.style.opacity = String(e);
        para.style.transform = `translate3d(0, ${(1 - e) * 20}px, 0)`;
      }

      // IV: the looks are dealt
      if (cardHead) {
        const e = sm(p, 0.72, 0.8);
        cardHead.style.opacity = String(e);
        cardHead.style.transform = `translate3d(0, ${(1 - e) * 20}px, 0)`;
      }
      cards.forEach((el, i) => {
        const c = CARDS[i];
        const a = 0.72 + i * 0.08;
        const e = sm(p, a, a + 0.14);
        const spread = sm(p, 0.9, 1);
        // Desktop: cards live over the portrait (centre of the right 60% = 70vw)
        const x = desk.matches
          ? 22 + c.side * (9 + spread * 2)
          : c.side * (13 + spread * 3);
        const rot = c.rot * (0.4 + 0.6 * e) + (1 - e) * c.side * 14;
        el.style.opacity = String(clamp01(e * 3));
        el.style.transform = `translate3d(calc(-50% + ${x}vw), calc(-50% + ${
          c.dy + (1 - e) * 115
        }vh), 0) rotate(${rot}deg)`;
      });
      if (cta) {
        const e = sm(p, 0.9, 0.97);
        cta.style.opacity = String(e);
        cta.style.transform = `translate3d(0, ${(1 - e) * 24}px, 0)`;
        cta.style.pointerEvents = e > 0.6 ? "auto" : "none";
      }

      // Rail
      if (railFill) railFill.style.transform = `scaleY(${p})`;
      railDots.forEach((d, i) => {
        d.style.opacity = p >= SCENE_STARTS[i] - 0.001 ? "1" : "0.3";
      });
    };

    const measure = () => {
      const rect = track.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      target = span > 0 ? clamp01(-rect.top / span) : 0;
    };

    const tick = () => {
      cur += (target - cur) * 0.14;
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
      // off-screen the target sits at 0 or 1 and has already been reached: nothing to redraw
      if (!raf && target !== cur) raf = requestAnimationFrame(tick);
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

  return (
    <div ref={trackRef} className="relative block w-full bg-[#0a0908]" style={{ height: "560svh" }}>
      <div ref={stageRef} className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Camera layer */}
        <div
          data-img
          className="absolute inset-0 z-0 will-change-transform"
          style={{ transformOrigin: "50% 68%", transform: "scale(1.06)" }}
        >
          <Image
            src="/images/Dream-mobile.webp"
            alt="Maison D'Vine The Dream Collection"
            fill
            unoptimized
            sizes="100vw"
            className="pointer-events-none object-cover object-[50%_40%] select-none"
          />
        </div>

        {/* Reading shade (driven by scroll) */}
        <div
          data-shade
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{
            opacity: 0,
            background:
              "linear-gradient(180deg, rgba(8,6,5,0.88) 0%, rgba(8,6,5,0.78) 40%, rgba(8,6,5,0.55) 70%, rgba(8,6,5,0.4) 100%)",
          }}
        />

        <DreamParticles />

        {/* ===== I. AWAKEN ===== */}
        <div className="absolute top-[9%] left-[6%] z-20 lg:top-[24%] lg:left-[7%]">
        <div data-title className="will-change-transform" style={{ transformOrigin: "0% 50%" }}>
          <div
            className="flex items-center gap-3 font-sans text-[11px] font-medium tracking-[0.3em] text-[#e6c98f] uppercase transition-all duration-1000"
            style={{ opacity: entered ? 1 : 0, transform: entered ? "none" : "translateX(-16px)" }}
          >
            <span
              className="block h-px bg-[#e6c98f] transition-[width] duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ width: entered ? 38 : 0, transitionDelay: "200ms" }}
            />
            Stage 01
          </div>
          <div
            className="mt-2 font-serif text-[6vw] tracking-[0.5em] text-white/90 italic transition-all duration-1000 sm:text-4xl"
            style={{ opacity: entered ? 1 : 0, transitionDelay: "300ms" }}
          >
            The
          </div>
          <h2
            aria-label={TITLE}
            className="font-serif text-[length:min(25vw,190px)] leading-[0.85] font-normal tracking-[0.02em] text-white lg:text-[length:min(10.5vw,168px)]"
            style={{ textShadow: "0 2px 6px rgba(0,0,0,0.5), 0 6px 44px rgba(0,0,0,0.55)" }}
          >
            {Array.from(TITLE).map((ch, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="inline-block transition-[opacity,transform,filter] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                style={{
                  opacity: entered ? 1 : 0,
                  transform: entered ? "none" : "translateY(60%) rotate(4deg)",
                  filter: entered ? "blur(0)" : "blur(14px)",
                  transitionDelay: entered ? `${400 + i * 110}ms` : "0ms",
                }}
              >
                {ch}
              </span>
            ))}
          </h2>
        </div>
        </div>

        <div
          data-cue
          className="absolute bottom-[calc(1.75rem+7.5vw)] left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 lg:left-[7%] lg:translate-x-0 lg:items-start font-sans text-[9px] tracking-[0.4em] text-white/70 uppercase"
        >
          Scroll
          <span className="relative block h-9 w-px overflow-hidden bg-white/25">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-echo-swipe-hint bg-[#e6c98f]" />
          </span>
        </div>

        {/* ===== II. DRIFT ===== */}
        <div
          data-quote
          className="absolute inset-x-0 top-[24%] z-20 px-7 will-change-transform sm:px-14 lg:inset-x-auto lg:top-[30%] lg:left-[7%] lg:w-[40%] lg:px-0"
          style={{ opacity: 0 }}
        >
          <span className="mb-4 block font-mono text-[10px] tracking-[0.3em] text-[#e6c98f]">
            II &mdash; DRIFT
          </span>
          <p
            className="font-serif text-[length:min(11.5vw,84px)] leading-[1.12] text-white italic lg:text-[length:min(4.4vw,72px)]"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.9), 0 2px 12px rgba(0,0,0,0.85), 0 4px 34px rgba(0,0,0,0.7)" }}
          >
            {QUOTE.map((w, i) => (
              <span key={i} data-word className="mr-[0.25em] inline-block" style={{ opacity: 0.12 }}>
                {w}
              </span>
            ))}
          </p>
        </div>

        {/* ===== III. THREAD ===== */}
        <div
          data-scene3
          className="absolute inset-x-0 top-[17%] z-20 px-7 will-change-transform sm:px-14 lg:inset-x-auto lg:top-[19%] lg:left-[7%] lg:w-[42%] lg:px-0"
          style={{ opacity: 0 }}
        >
          <span className="mb-5 block font-mono text-[10px] tracking-[0.3em] text-[#e6c98f]">
            III &mdash; THREAD
          </span>
          <ul className="space-y-1">
            {PILLARS.map((label, i) => (
              <li key={label} data-pillar className="will-change-transform" style={{ opacity: 0 }}>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] tracking-widest text-[#e6c98f]">
                    0{i + 1}
                  </span>
                  <span
                    className="font-serif text-[length:min(15vw,96px)] leading-[1.05] text-white italic lg:text-[length:min(5vw,78px)]"
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.9), 0 2px 12px rgba(0,0,0,0.85), 0 4px 34px rgba(0,0,0,0.7)" }}
                  >
                    {label}
                  </span>
                </div>
                <span
                  data-pillar-line
                  className="mt-1 block h-px origin-left bg-gradient-to-r from-[#e6c98f] to-transparent"
                  style={{ transform: "scaleX(0)" }}
                />
              </li>
            ))}
          </ul>
          <p
            data-para
            className="mt-6 max-w-[34ch] border-l border-[#e6c98f]/70 pl-4 font-sans text-[13px] leading-[1.85] text-[#f6efe4] [text-shadow:0_1px_3px_rgba(0,0,0,0.95),0_2px_14px_rgba(0,0,0,0.85)] sm:text-[15px] lg:max-w-[40ch] lg:text-[clamp(13px,1vw,16px)]"
            style={{ opacity: 0 }}
          >
            The Dream Collection is inspired by the first chapter of every journey &mdash; my
            aspirations, my what-ifs, and the courage to dream it all.
          </p>
        </div>

        {/* ===== IV. UNVEIL ===== */}
        <div
          data-cardhead
          className="absolute inset-x-0 top-[9%] z-20 px-7 text-center sm:px-14 lg:inset-x-auto lg:right-0 lg:w-[60%]"
          style={{ opacity: 0 }}
        >
          <span className="font-mono text-[10px] tracking-[0.3em] text-[#e6c98f]">
            IV &mdash; UNVEIL
          </span>
          <div className="mt-2 font-serif text-[7.5vw] leading-none text-white italic sm:text-5xl lg:text-[3.2vw]">
            Two ways to begin
          </div>
        </div>

        {CARDS.map((c, i) => {
          const isFront = front === i;
          return (
            <div
              key={c.titleLines.join("")}
              data-card
              className="absolute top-1/2 left-1/2 w-[min(56vw,300px)] will-change-transform lg:w-[min(19vw,300px)]"
              style={{
                aspectRatio: "3 / 4.5",
                zIndex: isFront ? 30 : 25,
                opacity: 0,
                transform: "translate3d(-50%, 120vh, 0)",
              }}
            >
              <article
                onClick={() => setFront(i)}
                className="group relative h-full w-full cursor-pointer overflow-hidden bg-[#12100e] shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  transform: isFront ? "scale(1.06) translateY(-1.5%)" : "scale(0.96)",
                  filter: isFront ? "none" : "brightness(0.7)",
                  border: "1px solid rgba(230,201,143,0.55)",
                }}
              >
                <Image
                  src={c.src}
                  alt={c.alt}
                  fill
                  unoptimized
                  loading="lazy"
                  sizes="300px"
                  className="pointer-events-none object-cover"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 42%, transparent 70%)",
                  }}
                />
                {/* Inner gold frame */}
                <div className="pointer-events-none absolute inset-2 border border-[#e6c98f]/30" />
                <span className="absolute top-3.5 left-4 font-mono text-[10px] tracking-[0.25em] text-[#e6c98f]">
                  {c.numeral}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="font-serif text-[15px] leading-[1.2] tracking-[0.16em] text-white uppercase">
                    <div>{c.titleLines[0]}</div>
                    <div>{c.titleLines[1]}</div>
                  </div>
                  <p className="mt-2 font-serif text-[11px] leading-[1.5] text-[#d4cbbf] italic">
                    {c.lines[0]}
                    <br />
                    {c.lines[1]}
                  </p>
                </div>
              </article>
            </div>
          );
        })}

        <div
          data-cta
          className="absolute inset-x-0 bottom-[calc(2.25rem+7.5vw)] z-40 flex justify-center lg:inset-x-auto lg:right-0 lg:w-[60%]"
          style={{ opacity: 0, pointerEvents: "none" }}
        >
          <button
            type="button"
            onClick={() => smoothScrollTo(document.getElementById("step-1"))}
            className="group relative inline-flex cursor-pointer items-center space-x-3 overflow-hidden bg-[#fdfbf7] px-7 py-3 font-sans text-[11px] font-medium tracking-[0.2em] text-[#1c1815] uppercase shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-transform active:scale-95"
          >
            <span
              className="pointer-events-none absolute inset-0 -top-2 -bottom-2 w-1/2 animate-btn-sheen bg-gradient-to-r from-transparent via-black/10 to-transparent"
              aria-hidden="true"
            />
            <span className="relative z-10">EXPLORE THE DREAM</span>
            <span className="relative z-10 text-xs transition-transform group-hover:translate-x-1.5">→</span>
          </button>
        </div>

        {/* Scene rail */}
        <div className="pointer-events-none absolute top-1/2 right-3 z-40 flex h-[34vh] -translate-y-1/2 flex-col items-center sm:right-6">
          <div className="relative h-full w-px bg-white/20">
            <div
              data-rail-fill
              className="absolute inset-0 origin-top bg-[#e6c98f]"
              style={{ transform: "scaleY(0)" }}
            />
            {SCENES.map((s, i) => (
              <span
                key={s}
                data-rail-dot
                className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 font-mono text-[8px] text-[#e6c98f] transition-opacity duration-500"
                style={{ top: `${(i / 3) * 100}%`, opacity: 0.3 }}
              >
                <span className="absolute right-3 -translate-y-px">{s}</span>
                <span className="block h-1.5 w-1.5 rounded-full bg-[#e6c98f]" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
