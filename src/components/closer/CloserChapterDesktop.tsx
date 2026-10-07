"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Sparkles, Heart, Gift, BookOpen } from "lucide-react";

/**
 * A CLOSER CHAPTER: desktop / tablet (md+). The private archive opens as you scroll.
 * One sticky, full-screen stage over a tall track (plays forward AND backward):
 *   - the scrapbook is dropped onto the page: slides in, straightens, then floats with the scroll
 *   - the photo develops: sepia lifts while an iris opens and the picture pulls back
 *   - the wax seal wakes and breathes as the archive unlocks
 *   - "A CLOSER CHAPTER" letters fan in from the centre of each line and converge
 *   - the four benefits are written in one after another, their icons spinning into place
 *   - the invitation arrives: the button (which leans toward the cursor) and a handwritten
 *     note whose heart draws itself; a sweep of light crosses the paper between chapters
 * Everything is written straight to the DOM from one eased scroll value (no per-frame renders).
 */

const BENEFITS = [
  { Icon: Sparkles, text: "Early access to new collections" },
  { Icon: Heart, text: "Exclusive member-only drops" },
  { Icon: Gift, text: "Special offers & experiences" },
  { Icon: BookOpen, text: "Stories, notes and behind the scenes" },
];
const NOTE = ["A closer", "chapter", "for our", "inner circle"];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const sm = (p: number, a: number, b: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const MOTES = Array.from({ length: 18 }, (_, i) => ({
  left: ((i * 37 + 13) % 90) + 5,
  top: ((i * 53 + 7) % 78) + 12,
  size: 2 + (i % 3),
  dur: 6 + (i % 5) * 1.5,
  delay: 1 + (i % 7) * 0.8,
  dx: (i % 2 === 0 ? 1 : -1) * (8 + (i % 4) * 6),
}));

const STYLES = `
.cd-seal { animation: cd-seal 3.6s ease-in-out infinite; }
@keyframes cd-seal { 0%,100% { opacity: .25; transform: scale(.92); } 50% { opacity: .8; transform: scale(1.12); } }
.cd-float { animation: cd-float 9s ease-in-out infinite; }
@keyframes cd-float { 0%,100% { transform: translate3d(0,0,0) rotate(0deg); } 50% { transform: translate3d(0,-6px,0) rotate(.5deg); } }
.cd-beat { transform-origin: center; animation: closerBeat 2.8s ease-in-out infinite; }
.cd-ticket { -webkit-mask-image: radial-gradient(circle 11px at 0 50%, #0000 97%, #000), radial-gradient(circle 11px at 100% 50%, #0000 97%, #000); -webkit-mask-composite: source-in; mask-image: radial-gradient(circle 11px at 0 50%, #0000 97%, #000), radial-gradient(circle 11px at 100% 50%, #0000 97%, #000); mask-composite: intersect; }
.cd-foil { position: absolute; top: 0; bottom: 0; left: 0; width: 38%; background: linear-gradient(100deg, transparent, rgba(255,232,170,.28), transparent); animation: cd-foil 5.2s ease-in-out 1.2s infinite; }
@keyframes cd-foil { 0%, 55% { transform: translateX(-130%) skewX(-18deg); } 100% { transform: translateX(380%) skewX(-18deg); } }
@media (prefers-reduced-motion: reduce) { .cd-seal, .cd-float, .cd-beat, .cd-foil { animation: none; } }
`;

export const CloserChapterDesktop: React.FC = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const tiltRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;
    const one = <T extends Element>(sel: string) => stage.querySelector<T>(sel);
    const all = <T extends Element>(sel: string) => Array.from(stage.querySelectorAll<T>(sel));

    const frame = one<HTMLElement>("[data-frame]");
    const iris = one<HTMLElement>("[data-iris]");
    const irisImg = one<HTMLElement>("[data-iris-img]");
    const sepia = one<HTMLElement>("[data-sepia]");
    const sealGlow = one<HTMLElement>("[data-seal]");
    const streak = one<HTMLElement>("[data-streak]");
    const rule = one<HTMLElement>("[data-rule]");
    const letters = all<HTMLElement>("[data-c]");
    const fades = all<HTMLElement>("[data-win]");
    const wipes = all<HTMLElement>("[data-wipe]");
    const icons = all<HTMLElement>("[data-icon]");
    const inks = all<HTMLElement>("[data-ink]");
    const heart = one<SVGPathElement>("[data-heart]");
    const ripples = all<HTMLElement>("[data-ripple]");
    const ticket = one<HTMLElement>("[data-ticket]");
    const labels = all<HTMLElement>("[data-label]");
    const labelBar = one<HTMLElement>("[data-label-bar]");

    const range = (el: HTMLElement, key: "win" | "wipe" | "icon" | "ink") => {
      const [a, b] = (el.dataset[key] || "0,1").split(",").map(Number);
      return { a, b };
    };

    let target = 0;
    let cur = 0;
    let raf = 0;

    const apply = (p: number) => {
      // scrapbook dropped onto the page, then drifting gently with the scroll
      if (frame) {
        const e = sm(p, 0, 0.14);
        frame.style.opacity = clamp01(e * 2.2).toFixed(3);
        frame.style.transform = `translate3d(${((1 - e) * -32).toFixed(2)}vw, ${(
          (1 - e) * 8 - p * 3
        ).toFixed(2)}vh, 0) rotate(${((1 - e) * -9 + (p - 0.5) * 1.6).toFixed(2)}deg)`;
      }
      // the photo develops
      const d = sm(p, 0.05, 0.3);
      if (iris) iris.style.clipPath = `circle(${(d * 78).toFixed(1)}% at 50% 45%)`;
      if (irisImg) irisImg.style.transform = `scale(${(1.4 - 0.4 * d).toFixed(4)})`;
      if (sepia) sepia.style.opacity = ((1 - sm(p, 0.1, 0.42)) * 0.85).toFixed(3);
      // the seal wakes
      if (sealGlow) {
        const s = sm(p, 0.5, 0.78);
        sealGlow.style.transform = `scale(${(1 + s * 0.35).toFixed(3)})`;
      }

      // headline letters converge
      letters.forEach((l, i) => {
        const e = sm(p, 0.03 + i * 0.004, 0.2 + i * 0.004);
        l.style.opacity = e.toFixed(3);
        l.style.transform = `translate3d(${(Number(l.dataset.off) * (1 - e)).toFixed(3)}em, 0, 0)`;
      });
      if (rule) rule.style.transform = `scaleX(${sm(p, 0.02, 0.12).toFixed(3)})`;

      fades.forEach((el) => {
        const { a, b } = range(el, "win");
        const e = sm(p, a, b);
        el.style.opacity = e.toFixed(3);
        el.style.transform = `translate3d(0, ${((1 - e) * 22).toFixed(1)}px, 0)`;
      });
      wipes.forEach((el) => {
        const { a, b } = range(el, "wipe");
        const e = sm(p, a, b);
        el.style.clipPath = `inset(-10% ${((1 - e) * 104).toFixed(1)}% -10% 0)`;
        el.style.opacity = (0.2 + 0.8 * e).toFixed(3);
        el.style.transform = `translate3d(${((1 - e) * -18).toFixed(1)}px, 0, 0)`;
      });
      icons.forEach((el) => {
        const { a, b } = range(el, "icon");
        const e = sm(p, a + 0.03, b + 0.03);
        el.style.transform = `scale(${e.toFixed(3)}) rotate(${((1 - e) * -90).toFixed(1)}deg)`;
      });
      inks.forEach((el) => {
        const { a, b } = range(el, "ink");
        const e = sm(p, a, b);
        el.style.clipPath = `inset(-6% ${((1 - e) * 104).toFixed(1)}% -6% 0)`;
      });
      if (heart) heart.style.strokeDashoffset = (1 - sm(p, 0.86, 0.96)).toFixed(3);

      // golden ripples leave the seal as the archive unlocks
      ripples.forEach((r, i) => {
        const k = sm(p, 0.48 + i * 0.08, 0.72 + i * 0.08);
        r.style.transform = `scale(${(0.4 + k * 3.4).toFixed(3)})`;
        r.style.opacity = (k > 0 && k < 1 ? (1 - k) * 0.75 : 0).toFixed(3);
      });

      // the Inner Circle ticket is dealt onto the page
      if (ticket) {
        const e = sm(p, 0.6, 0.76);
        ticket.style.opacity = e.toFixed(3);
        ticket.style.transform = `translate3d(0, ${((1 - e) * 54).toFixed(1)}px, 0) rotate(${(-(1 - e) * 6).toFixed(2)}deg) scale(${(0.95 + 0.05 * e).toFixed(4)})`;
        ticket.style.pointerEvents = e > 0.6 ? "auto" : "none";
      }

      // chapter names along the top: the current one is lit
      const starts = [0, 0.26, 0.58, 0.85];
      labels.forEach((l, i) => {
        const on = p >= starts[i] - 0.001 && (i === starts.length - 1 || p < starts[i + 1]);
        l.style.opacity = p >= starts[i] - 0.001 ? (on ? "1" : "0.42") : "0.22";
        l.style.color = on ? "#8a5d12" : "";
      });
      if (labelBar) labelBar.style.transform = `scaleY(${p.toFixed(4)})`;

      // light sweeping across the paper between the benefits and the invitation
      if (streak) {
        const k = sm(p, 0.52, 0.68);
        streak.style.transform = `translate3d(${(-30 + k * 150).toFixed(2)}vw, 0, 0) skewX(-16deg)`;
        streak.style.opacity = (Math.sin(k * Math.PI) * 0.8).toFixed(3);
      }
    };

    const measure = () => {
      const rect = track.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      target = span > 0 ? clamp01(-rect.top / span) : 0;
    };
    const tick = () => {
      cur += (target - cur) * 0.1;
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

  // A lantern of warm light follows the cursor over the paper (eased, so it drifts after it)
  const lanternRef = useRef<HTMLDivElement | null>(null);
  const lan = useRef({ x: 0, y: 0, tx: 0, ty: 0, raf: 0, on: false });
  const lanternLoop = () => {
    const l = lan.current;
    const el = lanternRef.current;
    if (!el) {
      l.raf = 0;
      return;
    }
    l.x += (l.tx - l.x) * 0.1;
    l.y += (l.ty - l.y) * 0.1;
    el.style.transform = `translate3d(${l.x.toFixed(1)}px, ${l.y.toFixed(1)}px, 0)`;
    const settled = Math.abs(l.tx - l.x) < 0.4 && Math.abs(l.ty - l.y) < 0.4;
    l.raf = l.on || !settled ? requestAnimationFrame(lanternLoop) : 0;
  };
  useEffect(() => {
    const l = lan.current;
    return () => cancelAnimationFrame(l.raf);
  }, []);

  // Frame leans toward the cursor; the ticket leans toward it too
  const onStageMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - r.left;
    const cy = e.clientY - r.top;
    const t = tiltRef.current;
    if (t) {
      const x = cx / r.width - 0.5;
      const y = cy / r.height - 0.5;
      t.style.transform = `perspective(1400px) rotateY(${(x * 7).toFixed(2)}deg) rotateX(${(-y * 5).toFixed(2)}deg)`;
    }
    const l = lan.current;
    if (!l.on) {
      l.on = true;
      l.x = l.tx = cx;
      l.y = l.ty = cy;
      if (lanternRef.current) lanternRef.current.style.opacity = "1";
    }
    l.tx = cx;
    l.ty = cy;
    if (!l.raf) l.raf = requestAnimationFrame(lanternLoop);
  };
  const onStageLeave = () => {
    if (tiltRef.current) tiltRef.current.style.transform = "perspective(1400px) rotateY(0deg) rotateX(0deg)";
    lan.current.on = false;
    if (lanternRef.current) lanternRef.current.style.opacity = "0";
  };
  const onCtaMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const b = e.currentTarget;
    const r = b.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * 0.06;
    const dy = (e.clientY - (r.top + r.height / 2)) * 0.12;
    const rx = ((e.clientX - (r.left + r.width / 2)) / r.width) * 6;
    b.style.transform = `perspective(900px) translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) rotateY(${rx.toFixed(2)}deg)`;
  };
  const onCtaLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = "perspective(900px) translate3d(0,0,0) rotateY(0deg)";
  };

  const headLine = (line: string) => {
    const chars = Array.from(line);
    const centre = (chars.length - 1) / 2;
    return (
      <span key={line} className="block" aria-hidden="true">
        {chars.map((ch, i) => (
          <span
            key={i}
            data-c
            data-off={((i - centre) * 0.55).toFixed(2)}
            className="inline-block will-change-transform"
            style={{ opacity: 0 }}
          >
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    );
  };

  return (
    <div ref={trackRef} className="relative w-full" style={{ height: "340vh" }}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div
        ref={stageRef}
        className="sticky top-0 h-screen w-full"
        onMouseMove={onStageMove}
        onMouseLeave={onStageLeave}
      >
        {/* The paper */}
        <Image
          src="/images/closer-chapter-bg.webp"
          alt="Maison D'Vine - Closer Chapter"
          fill
          quality={100}
          unoptimized
          sizes="100vw"
          className="pointer-events-none object-cover object-center select-none drop-shadow-[0_-12px_24px_rgba(0,0,0,0.5)]"
        />

        {/* Lantern: warm light that drifts after the cursor */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[12] overflow-hidden">
          <div
            ref={lanternRef}
            className="absolute top-0 left-0 will-change-transform"
            style={{
              width: "44vw",
              height: "44vw",
              marginLeft: "-22vw",
              marginTop: "-22vw",
              opacity: 0,
              transition: "opacity 0.6s ease",
              background:
                "radial-gradient(closest-side, rgba(255,236,188,0.55), rgba(255,222,160,0.18) 55%, transparent 100%)",
              mixBlendMode: "soft-light",
            }}
          />
        </div>

        {/* Chapter rail down the right edge: only roman numerals and a line, so it stays slim and
            never meets the copy or the note. The current chapter is lit, the gold line fills. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-[1.4vw] z-20 flex h-[40vh] max-h-[380px] -translate-y-1/2 items-stretch gap-2"
        >
          <div
            className="flex flex-col justify-between font-serif text-[#7a6a59]"
            style={{ fontSize: "clamp(8px, 0.62vw, 11px)", letterSpacing: "0.1em" }}
          >
            {["I", "II", "III", "IV"].map((t, i) => (
              <span
                key={t}
                data-label
                title={["Unseal", "Discover", "Belong", "Welcome"][i]}
                className="transition-[opacity,color] duration-500"
                style={{ opacity: 0.22 }}
              >
                {t}
              </span>
            ))}
          </div>
          <div className="relative w-px bg-[#8a6a3a]/25">
            <div
              data-label-bar
              className="absolute inset-0 origin-top bg-[#b8862d]"
              style={{ transform: "scaleY(0)" }}
            />
          </div>
        </div>

        {/* Gold dust */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[15] overflow-hidden">
          {MOTES.map((m, i) => (
            <span
              key={i}
              className="animate-closer-mote absolute rounded-full bg-[#e6c98f]"
              style={
                {
                  left: `${m.left}%`,
                  top: `${m.top}%`,
                  width: m.size,
                  height: m.size,
                  boxShadow: "0 0 8px 1px rgba(230, 201, 143, 0.7)",
                  animationDuration: `${m.dur}s`,
                  animationDelay: `${m.delay}s`,
                  ["--dx" as string]: `${m.dx}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* Light sweeping across between chapters */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[16] overflow-hidden">
          <div
            data-streak
            className="absolute inset-y-[-10%] left-0 w-[24vw] will-change-transform"
            style={{
              opacity: 0,
              background:
                "linear-gradient(100deg, transparent 0%, rgba(255,250,235,0.3) 50%, transparent 100%)",
            }}
          />
        </div>

        {/* ===== LEFT: the scrapbook ===== */}
        <div
          data-frame
          className="absolute top-1/2 left-[6vw] z-10 -translate-y-1/2 will-change-transform"
          style={{ height: "min(82vh, 58vw)", aspectRatio: "1096 / 1436", opacity: 0 }}
        >
          <div ref={tiltRef} className="h-full w-full transition-transform duration-500 ease-out" style={{ transformStyle: "preserve-3d" }}>
            <div className="cd-float relative h-full w-full">
              {/* Photo in the card */}
              <div
                className="absolute overflow-hidden shadow-[0_4px_18px_rgba(40,30,20,0.22)]"
                style={{
                  top: "9.89%",
                  left: "38.14%",
                  width: "33.30%",
                  height: "55.71%",
                  transform: "rotate(5.2deg)",
                  transformOrigin: "0 0",
                  zIndex: 15,
                }}
              >
                <div data-iris className="relative h-full w-full overflow-hidden" style={{ clipPath: "circle(0% at 50% 45%)" }}>
                  <div data-iris-img className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.4)" }}>
                    <Image
                      src="/images/close-chapter-photo.webp"
                      alt="Private Archive"
                      fill
                      sizes="(max-width: 1200px) 25vw, 365px"
                      quality={100}
                      className="object-cover"
                    />
                  </div>
                  {/* old-photo sepia that lifts as the picture develops */}
                  <div
                    data-sepia
                    className="pointer-events-none absolute inset-0"
                    style={{ background: "#c9a877", mixBlendMode: "color", opacity: 0.85 }}
                  />
                </div>
              </div>

              <div className="pointer-events-none relative z-10 h-full w-full select-none">
                <Image
                  src="/images/photoFrameclosechapter.webp"
                  alt="Private Archive Scrapbook Frame"
                  fill
                  sizes="(max-width: 1200px) 45vw, 540px"
                  quality={100}
                  className="object-contain"
                  style={{ filter: "drop-shadow(0 2.4vh 2.6vh rgba(60,35,12,0.4))" }}
                />
              </div>

              {/* The wax seal wakes and breathes */}
              <div
                className="pointer-events-none absolute z-[16]"
                style={{ left: "17.6%", top: "49.4%", width: "24%", height: "18.3%" }}
              >
                {[0, 1].map((i) => (
                  <span
                    key={i}
                    data-ripple
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full border border-[#d9a441]/80"
                    style={{ opacity: 0, transform: "scale(0.4)" }}
                  />
                ))}
                <span
                  data-seal
                  aria-hidden="true"
                  className="cd-seal block h-full w-full rounded-full"
                  style={{
                    background:
                      "radial-gradient(closest-side, rgba(255,214,140,0.75), rgba(255,190,100,0) 100%)",
                    mixBlendMode: "screen",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ===== RIGHT: the copy ===== */}
        <div className="absolute top-[54%] left-[50vw] z-20 w-[40vw] max-w-[620px] -translate-y-1/2 text-left">
          <div className="flex items-center gap-3 font-serif font-medium tracking-[0.28em] text-[#635548] uppercase" style={{ fontSize: "clamp(10px, 0.85vw, 13px)" }}>
            <span
              data-rule
              className="block h-px w-10 origin-left bg-gradient-to-r from-[#8a6a3a] to-[#8a6a3a]/0"
              style={{ transform: "scaleX(0)" }}
            />
            <span data-win="0.02,0.12" style={{ opacity: 0 }}>
              The private archive
            </span>
          </div>

          <h2
            aria-label="A CLOSER CHAPTER"
            className="mt-3 font-serif font-normal tracking-[-0.01em] text-[#191411]"
            style={{ fontSize: "clamp(44px, 5.2vw, 96px)", lineHeight: 0.93 }}
          >
            {["A CLOSER", "CHAPTER"].map(headLine)}
          </h2>

          <p
            data-win="0.16,0.28"
            className="mt-4 max-w-[440px] font-serif leading-[1.62] text-[#55473c]"
            style={{ fontSize: "clamp(13.5px, 1.05vw, 17px)", opacity: 0 }}
          >
            An exclusive space for early access, special drops, and stories that we share only with
            our closest community.
          </p>

          <ul className="mt-6 space-y-3.5 xl:space-y-4">
            {BENEFITS.map(({ Icon, text }, i) => {
              const a = 0.28 + i * 0.07;
              return (
                <li
                  key={text}
                  data-wipe={`${a},${a + 0.08}`}
                  className="flex items-center gap-3.5"
                  style={{ clipPath: "inset(-10% 104% -10% 0)", opacity: 0.2 }}
                >
                  <span data-icon={`${a},${a + 0.08}`} className="shrink-0 text-[#42362c] will-change-transform" style={{ transform: "scale(0)" }}>
                    <Icon strokeWidth={1.3} style={{ width: "clamp(17px, 1.4vw, 24px)", height: "clamp(17px, 1.4vw, 24px)" }} />
                  </span>
                  <span className="font-serif tracking-[0.015em] text-[#322a24]" style={{ fontSize: "clamp(13.5px, 1.1vw, 18px)" }}>
                    {text}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* The Inner Circle ticket: the invitation itself is the button */}
          <div data-ticket className="mt-7 will-change-transform" style={{ opacity: 0 }}>
            <button
              type="button"
              aria-label="Join the private archive"
              onMouseMove={onCtaMove}
              onMouseLeave={onCtaLeave}
              className="group relative block w-[min(100%,460px)] max-[1199px]:w-[min(100%,360px)] cursor-pointer text-left transition-transform duration-300 ease-out"
            >
              <span
                className="cd-ticket relative flex items-stretch overflow-hidden text-[#f4ead6] shadow-[0_14px_30px_-6px_rgba(20,12,6,0.55)]"
                style={{
                  height: "clamp(96px, 8.2vw, 136px)",
                  background: "linear-gradient(135deg, #221b16 0%, #14100d 55%, #1c1611 100%)",
                }}
              >
                {/* foil edge + light that keeps circling it */}
                <span className="pointer-events-none absolute inset-[6px] border border-[#e6c98f]/45" />
                <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
                  <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="#e6c98f" strokeWidth="1.6" pathLength={1} className="closer-cta-run" />
                </svg>
                <span className="cd-foil pointer-events-none" />

                {/* stub */}
                <span className="relative flex w-[26%] shrink-0 flex-col items-center justify-center gap-1.5 border-r border-dashed border-[#e6c98f]/40">
                  <Sparkles className="text-[#e6c98f]" strokeWidth={1.2} style={{ width: "clamp(20px, 1.9vw, 30px)", height: "clamp(20px, 1.9vw, 30px)" }} />
                  <span className="font-serif tracking-[0.3em] text-[#e6c98f]/80 uppercase" style={{ fontSize: "clamp(7px, 0.55vw, 9px)" }}>
                    Admit one
                  </span>
                </span>

                {/* body */}
                <span className="relative flex flex-1 items-center justify-between gap-4 px-[6%]">
                  <span className="flex flex-col">
                    <span className="font-serif tracking-[0.3em] text-[#e6c98f]/75 uppercase" style={{ fontSize: "clamp(8px, 0.62vw, 10px)" }}>
                      Maison D&rsquo;Vine
                    </span>
                    <span className="mt-1 font-serif leading-[1.05] text-[#f7efe0] italic" style={{ fontSize: "clamp(18px, 2vw, 34px)" }}>
                      The Inner Circle
                    </span>
                    <span className="mt-1.5 font-serif tracking-[0.22em] text-[#f4ead6]/70 uppercase" style={{ fontSize: "clamp(8.5px, 0.66vw, 11px)" }}>
                      Join the private archive
                    </span>
                  </span>
                  <span
                    className="flex shrink-0 items-center justify-center rounded-full border border-[#e6c98f]/60 text-[#e6c98f] transition-all duration-500 group-hover:bg-[#e6c98f] group-hover:text-[#14100c] group-hover:-rotate-45"
                    style={{ width: "clamp(34px, 2.8vw, 46px)", height: "clamp(34px, 2.8vw, 46px)" }}
                    aria-hidden="true"
                  >
                    &rarr;
                  </span>
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* ===== Handwritten note, written by the scroll ===== */}
        <div className="pointer-events-none absolute right-[5vw] top-[42%] z-20 select-none max-[1199px]:right-[3vw] max-[1199px]:top-[51%]">
          <p
            className="font-allura allura-regular font-script font-cursive -rotate-[6deg] text-left leading-[1.08] text-[#493c33]"
            style={{ fontSize: "clamp(22px, 2.9vw, 50px)" }}
          >
            {NOTE.map((l, i) => (
              <span
                key={l}
                data-ink={`${0.72 + i * 0.05},${0.8 + i * 0.05}`}
                className="block"
                style={{ clipPath: "inset(-6% 104% -6% 0)" }}
              >
                {l}
              </span>
            ))}
          </p>
          <svg
            width="30"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            className="cd-beat mt-2 -rotate-[8deg] text-[#493c33]/85"
            aria-hidden="true"
          >
            <path
              data-heart
              d="M12 20.5C12 20.5 3.5 15.2 3.5 8.7C3.5 5.8 5.7 3.5 8.5 3.5C10.2 3.5 11.6 4.4 12 5.5C12.4 4.4 13.8 3.5 15.5 3.5C18.3 3.5 20.5 5.8 20.5 8.7C20.5 15.2 12 20.5 12 20.5Z"
              pathLength={1}
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
