"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { makeTops, nearViewport } from "@/lib/scrub";

/**
 * Mobile composition for "Our Stories Across India": one torn parchment sheet (copy on the
 * left, the hand-drawn map on the right) with a scrapbook photo laid over its lower half.
 *
 *  - /images/india-mobile-sheet.webp is the sheet (853 x 1672, torn only at top and bottom):
 *    the map from india-mobile.webp scaled down and moved right, on clean paper.
 *  - A live layer in the same 853 x 1672 space sits on the map.
 *
 * Everything is scroll-scrubbed (plays forward AND backward with the page):
 *  - the sheet settles in, the eyebrow / headline / paragraph rise, the note is written
 *  - the routes are DRAWN BY THE SCROLL, one after another out of the NCR hub, each pin
 *    lighting up a ring as its route arrives
 *  - once the map is fully connected the gold couriers start running, NCR ripples, and a
 *    spotlight walks pin to pin
 *  - the scrapbook photo is dropped on the sheet: slides in from the left, straightens, settles
 *  - the sheet and the photo drift at different speeds for depth
 *
 * Edit CITIES to move a pin (x, y are pixels in the ORIGINAL india-mobile.webp).
 */

const W = 853;
const H = 1672;

// How india-mobile.webp was placed on the sheet: new = (old - crop) * scale + origin
const SHEET_MAP = { cropX: 60, cropY: 190, scale: 0.66, originX: 340, originY: 140 };
const toSheet = (x: number, y: number) => ({
  x: (x - SHEET_MAP.cropX) * SHEET_MAP.scale + SHEET_MAP.originX,
  y: (y - SHEET_MAP.cropY) * SHEET_MAP.scale + SHEET_MAP.originY,
});

// Pin positions in the ORIGINAL india-mobile.webp
const CITIES: { x: number; y: number }[] = [
  { x: 350, y: 455 }, // 0
  { x: 413, y: 535 }, // 1
  { x: 465, y: 580 }, // 2
  { x: 355, y: 606 }, // 3  hub: where the stories live today (NCR)
  { x: 310, y: 665 }, // 4
  { x: 573, y: 662 }, // 5
  { x: 245, y: 775 }, // 6
  { x: 285, y: 908 }, // 7
  { x: 462, y: 972 }, // 8
  { x: 345, y: 1052 }, // 9
];

const POS = CITIES.map((c) => toSheet(c.x, c.y));
const HUB = 3;

const EDGES: [number, number][] = [
  [HUB, 1],
  [HUB, 0],
  [HUB, 2],
  [HUB, 4],
  [HUB, 5],
  [HUB, 6],
  [HUB, 8],
  [6, 7],
  [7, 9],
  [9, 8],
];

// Order the spotlight walks the map: home first, then outwards
const TOUR = [3, 0, 1, 2, 5, 4, 6, 7, 8, 9];

const curve = (a: { x: number; y: number }, b: { x: number; y: number }, i: number) => {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const bulge = len * 0.2 * (i % 2 === 0 ? 1 : -1);
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${(mx + (-dy / len) * bulge).toFixed(1)} ${(my + (dx / len) * bulge).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
};

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const STYLES = `
.im-ping { transform-box: fill-box; transform-origin: center; animation: im-ping 1.8s ease-out infinite; }
@keyframes im-ping { 0% { opacity: .9; transform: scale(.4); } 100% { opacity: 0; transform: scale(2.4); } }
.im-live { transform-box: fill-box; transform-origin: center; opacity: 0; animation: im-live 2.6s ease-out var(--d, 0s) infinite; }
@keyframes im-live { 0% { opacity: .8; transform: scale(.35); } 100% { opacity: 0; transform: scale(2.7); } }
.im-fadein { animation: im-fadein .9s ${EASE} both; }
@keyframes im-fadein { from { opacity: 0; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .im-ping, .im-live, .im-fadein { animation: none; } }
`;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};

const Rise: React.FC<{ lag?: number; className?: string; children: React.ReactNode }> = ({
  lag = 0,
  className = "",
  children,
}) => (
  <span
    data-s="rise"
    data-lag={lag}
    className={`-mb-[0.1em] block overflow-hidden pb-[0.1em] ${className}`}
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

export const IndiaMobileMap: React.FC = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState(-1); // index into TOUR; -1 until the map is connected
  const [live, setLive] = useState(false); // map fully drawn: couriers, ripples, spotlight

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const q = <T extends Element>(sel: string) => Array.from(root.querySelectorAll<T>(sel));
    const sheet = root.querySelector<HTMLElement>("[data-s='sheet']");
    const svg = root.querySelector<SVGSVGElement>("[data-svg]");
    const risers = q<HTMLElement>("[data-s='rise']");
    const rules = q<HTMLElement>("[data-s='rule']");
    const fades = q<HTMLElement>("[data-s='fade']");
    const inks = q<HTMLElement>("[data-s='ink']");
    const photo = root.querySelector<HTMLElement>("[data-s='photo']");
    const drawn = q<SVGPathElement>("[data-route]");
    const rings = q<SVGCircleElement>("[data-ring]");

    let raf = 0;
    let liveNow = false;
    const driftA = root.querySelector<HTMLElement>("[data-drift-a]");
    const driftB = root.querySelector<HTMLElement>("[data-drift-b]");
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
      T.read([sheet, photo, svg], risers, rules, fades, inks);
      const mp = clamp01((vh - rr.top) / (vh + rr.height));
      if (driftA) driftA.style.transform = `translate3d(0, ${((mp - 0.5) * -16).toFixed(1)}px, 0)`;
      if (driftB) driftB.style.transform = `translate3d(0, ${((mp - 0.5) * -34).toFixed(1)}px, 0)`;

      if (sheet) {
        const e = prog(sheet, 0, 0.35);
        sheet.style.opacity = String((0.2 + 0.8 * e).toFixed(3));
        sheet.style.transform = `translate3d(0, ${((1 - e) * 44).toFixed(1)}px, 0) scale(${(0.965 + 0.035 * e).toFixed(4)})`;
      }

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
      fades.forEach((el) => {
        const e = prog(el, Number(el.dataset.lag || 0), 0.18);
        el.style.opacity = String((0.15 + 0.85 * e).toFixed(3));
        el.style.transform = `translate3d(0, ${((1 - e) * 16).toFixed(1)}px, 0)`;
      });
      inks.forEach((el) => {
        const e = prog(el, Number(el.dataset.lag || 0), 0.2);
        el.style.clipPath = `inset(-6% ${((1 - e) * 104).toFixed(1)}% -6% 0)`;
      });

      // The routes are drawn by the scroll: map top enters the screen -> map centred
      let mapP = 0;
      if (svg) {
        const r = svg.getBoundingClientRect();
        mapP = clamp01((vh * 0.95 - (r.top + r.height * 0.1)) / (vh * 0.62));
      }
      drawn.forEach((el, i) => {
        const e = smooth((mapP - i * 0.055) / 0.4);
        el.style.strokeDashoffset = String((1 - e).toFixed(3));
      });
      rings.forEach((el, i) => {
        const e = smooth((mapP - i * 0.06 - 0.12) / 0.25);
        el.setAttribute("r", (2 + 15 * e).toFixed(1));
        el.style.opacity = String((0.85 * e).toFixed(3));
      });
      const nowLive = liveNow ? mapP > 0.72 : mapP > 0.95;
      if (nowLive !== liveNow) {
        liveNow = nowLive;
        setLive(nowLive);
        setStep(nowLive ? 0 : -1);
      }

      // The scrapbook photo is dropped on the sheet
      if (photo) {
        const e = prog(photo, 0, 0.4);
        photo.style.opacity = String(clamp01(e * 2.2));
        photo.style.transform = `translate3d(${(-18 * (1 - e)).toFixed(2)}%, ${(14 * (1 - e)).toFixed(2)}%, 0) rotate(${(-14 * (1 - e)).toFixed(2)}deg) scale(${(0.92 + 0.08 * e).toFixed(4)})`;
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

  // Spotlight tour runs while the map is fully connected
  useEffect(() => {
    if (!live) return;
    const iv = setInterval(() => setStep((s) => (s + 1) % TOUR.length), 2800);
    return () => clearInterval(iv);
  }, [live]);

  const activeIdx = step >= 0 ? TOUR[step] : -1;
  const active = activeIdx >= 0 ? POS[activeIdx] : null;
  const ink = "#2a1f16";

  return (
    <div ref={rootRef} className="im-root relative w-full pb-[9%]">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* ===== The sheet ===== */}
      <div
        data-s="sheet"
        className="relative w-full will-change-transform"
        style={{ opacity: 0.2 }}
      >
        <div
          data-drift-a
          className="relative w-full will-change-transform"
          style={{
            aspectRatio: `${W} / ${H}`,
            containerType: "inline-size",
            transform: "translate3d(0, 0, 0)",
          }}
        >
          <Image
            src="/images/india-mobile-sheet.webp"
            alt="Maison D'Vine stories across India, marked on a hand-drawn map"
            width={W}
            height={H}
            unoptimized
            className="pointer-events-none block h-full w-full select-none"
            style={{ filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.6))" }}
          />

          {/* Live map layer, same coordinate space as the sheet */}
          <svg
            data-svg
            viewBox={`0 0 ${W} ${H}`}
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <defs>
              {EDGES.map(([from, to], i) => (
                <mask
                  key={i}
                  id={`im-mask-${i}`}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width={W}
                  height={H}
                >
                  <path
                    data-route
                    d={curve(POS[from], POS[to], i)}
                    fill="none"
                    stroke="white"
                    strokeWidth="12"
                    pathLength={1}
                    style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
                  />
                </mask>
              ))}
            </defs>

            {EDGES.map(([from, to], i) => (
              <path
                key={`r${i}`}
                d={curve(POS[from], POS[to], i)}
                fill="none"
                stroke="#5c3d1e"
                strokeOpacity="0.85"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="3 11"
                mask={`url(#im-mask-${i})`}
              />
            ))}

            {/* The route to the city in the spotlight lights up */}
            {EDGES.map(([from, to], i) => {
              const lit = activeIdx >= 0 && (from === activeIdx || to === activeIdx);
              return (
                <path
                  key={`h${i}`}
                  d={curve(POS[from], POS[to], i)}
                  fill="none"
                  stroke="#b8862d"
                  strokeWidth="5"
                  strokeLinecap="round"
                  mask={`url(#im-mask-${i})`}
                  style={{ opacity: lit ? 0.95 : 0, transition: "opacity .7s ease" }}
                />
              );
            })}

            {/* A ring blooms on each pin as its route arrives (scroll-driven) */}
            {POS.map((p, i) => (
              <circle
                key={`ring${i}`}
                data-ring
                cx={p.x}
                cy={p.y}
                r="2"
                fill="none"
                stroke="#b8862d"
                strokeWidth="2.4"
                style={{ opacity: 0 }}
              />
            ))}

            {/* Once connected: a gold courier on every route, NCR ripples */}
            {live && (
              <g className="im-fadein">
                {EDGES.map(([from, to], i) => (
                  <circle key={`d${i}`} r="6" fill="#c9922f" opacity="0">
                    <animateMotion
                      dur="3.6s"
                      begin={`${i * 0.22}s`}
                      repeatCount="indefinite"
                      path={curve(POS[from], POS[to], i)}
                      calcMode="spline"
                      keyTimes="0;1"
                      keySplines="0.45 0 0.55 1"
                    />
                    <animate
                      attributeName="opacity"
                      values="0;0.95;0.95;0"
                      keyTimes="0;0.12;0.85;1"
                      dur="3.6s"
                      begin={`${i * 0.22}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                ))}
                {[0, 1.3].map((o) => (
                  <circle
                    key={o}
                    cx={POS[HUB].x}
                    cy={POS[HUB].y}
                    r="20"
                    fill="none"
                    stroke="#b8862d"
                    strokeWidth="2.5"
                    className="im-live"
                    style={{ ["--d" as string]: `${o}s` }}
                  />
                ))}
              </g>
            )}

            {/* Spotlight: a ping on the current city's pin */}
            {active && (
              <circle
                key={`spot-${step}`}
                cx={active.x}
                cy={active.y}
                r="22"
                fill="none"
                stroke="#b8862d"
                strokeWidth="3"
                className="im-ping"
              />
            )}
          </svg>

          {/* ---- Copy, in sheet units so it scales like the artwork ---- */}
          <div className="absolute" style={{ left: "7%", top: "12.6%", width: "42%" }}>
            <div
              className="flex items-center font-serif font-normal tracking-[0.26em] text-[#4a3d30] uppercase"
              style={{ fontSize: "2.35cqw", gap: "3.4cqw" }}
            >
              <span
                data-s="rule"
                className="block h-px shrink-0 origin-left bg-[#8a6a3a]"
                style={{ width: "8cqw", transform: "scaleX(0)" }}
              />
              <span className="leading-[1.45]">
                <Rise>Our stories</Rise>
                <Rise lag={14}>across India</Rise>
              </span>
            </div>

            <h2
              className="font-serif leading-[0.96] font-normal"
              style={{ fontSize: "10cqw", marginTop: "3.6cqw", color: ink }}
            >
              <Rise lag={10}>Growing</Rise>
              <Rise lag={30}>Together</Rise>
            </h2>

            <span
              data-s="rule"
              data-lag={30}
              className="block h-px origin-left bg-gradient-to-r from-[#8a6a3a] via-[#b8862d]/70 to-transparent"
              style={{ width: "38cqw", marginTop: "3.4cqw", transform: "scaleX(0)" }}
            />

            <p
              data-s="fade"
              data-lag={30}
              className="font-sans leading-[1.62]"
              style={{
                fontSize: "3.05cqw",
                marginTop: "3.6cqw",
                color: "#3b2f24",
                opacity: 0.15,
              }}
            >
              Right now, our stories live in and around NCR &mdash; with incredible women who made
              them their own. We&apos;re on our way to more cities, more stories, more you.
            </p>
          </div>

          {/* Handwritten note, written by the scroll */}
          <div className="absolute" style={{ left: "7.5%", top: "53.6%", width: "64%" }}>
            <p
              className="font-allura allura-regular font-script font-cursive origin-left -rotate-[6deg] tracking-wide"
              style={{ fontSize: "7.4cqw", lineHeight: 1.14, color: "#2c231b" }}
            >
              {["More cities.", "More stories. Soon..."].map((line, i) => (
                <span
                  key={line}
                  data-s="ink"
                  data-lag={i * 34}
                  className={`block ${i === 1 ? "pl-[0.9em]" : ""}`}
                  style={{ clipPath: "inset(-6% 104% -6% 0)" }}
                >
                  {line}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>

      {/* ===== Scrapbook photo laid over the lower half ===== */}
      <div
        data-drift-b
        className="absolute z-10 will-change-transform"
        style={{
          left: "3%",
          width: "70%",
          bottom: "0.5%",
          transform: "translate3d(0, 0, 0)",
        }}
      >
        <div
          data-s="photo"
          className="drop-shadow-[0_18px_26px_rgba(40,22,8,0.55)] will-change-transform"
          style={{ opacity: 0 }}
        >
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: "1047 / 1112", transform: "rotate(-5deg)" }}
          >
            <Image
              src="/images/IndiaPage-right-collage.webp"
              alt="Mehak S., choreographer: a story from Maison D'Vine"
              width={1047}
              height={1503}
              unoptimized
              className="block h-auto w-full select-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
