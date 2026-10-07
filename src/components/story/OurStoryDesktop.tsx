"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * OUR STORY: desktop / tablet (md+).
 * One sticky, full-screen stage over a tall track. The scroll drives a slow "camera" through the
 * atelier photograph (plays forward AND backward):
 *   I    the designer at his desk     - "From a Feeling"
 *   II   the wall of sketches         - "to a Maison."
 *   III  the gown on the form         - "More than a brand. a journey."
 *
 * Layers that make it feel shot, not slid:
 *  - a gold thread is stitched across the photograph, hand -> sketches -> gown, its needle riding
 *    the tip (it lives on the photograph, so it pans and zooms with the camera)
 *  - handwritten notes are written beside each subject as the camera arrives
 *  - a soft spotlight stays on whatever the camera is looking at, the rest falls into shadow
 *  - the paragraphs light up word by word, headlines rise out of masks
 *  - a sweep of warm light crosses the frame between chapters
 * Everything is written straight to the DOM from one eased scroll value (no per-frame renders).
 */

const IMG_AR = 1713 / 918;
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const sm = (p: number, a: number, b: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Camera keyframes: where the scroll holds and moves. x / y are fractions of the PHOTOGRAPH,
// s is the zoom. Holds sit on the chapters, moves happen between them.
const CAM = [
  { p: 0, s: 1.1, x: 0.3, y: 0.46 },
  { p: 0.13, s: 1.1, x: 0.3, y: 0.46 },
  { p: 0.43, s: 1.22, x: 0.5, y: 0.3 },
  { p: 0.57, s: 1.22, x: 0.5, y: 0.3 },
  { p: 0.87, s: 1.32, x: 0.86, y: 0.56 },
  { p: 1, s: 1.32, x: 0.86, y: 0.56 },
];

// Copy windows per chapter: [in start, in end, out start, out end]
const SCENES = {
  a: [0.02, 0.1, 0.3, 0.38],
  b: [0.42, 0.5, 0.64, 0.72],
  c: [0.8, 0.88, 2, 3],
} as const;

// Handwritten notes on the photograph (x / y are fractions of the photograph)
const NOTES = [
  { scene: "a", x: 0.275, y: 0.17, rot: -5, text: "where every dress begins" },
  { scene: "b", x: 0.44, y: 0.63, rot: -4, text: "a thousand sketches, one story" },
  { scene: "c", x: 0.44, y: 0.56, rot: -6, text: "and then, it lives" },
] as const;

// The gold thread, in photograph pixels (1713 x 918): hand -> sketch wall -> the gown's bow
// Waypoints: A = the designer's hand (chapter I), B = the sketch wall (II), C = the gown's bow (III)
const THREAD_B = { x: 860, y: 300 };
const THREAD =
  "M 548 572 C 640 630, 700 420, 860 300 S 1060 170, 1200 280 S 1340 430, 1500 418";

const MOTES = Array.from({ length: 14 }, (_, i) => ({
  left: 6 + ((i * 37) % 88),
  top: 14 + ((i * 29) % 70),
  size: 2 + (i % 3),
  dur: 7 + ((i * 5) % 6),
  delay: -((i * 1.9) % 9),
  dx: (i % 2 ? 1 : -1) * (8 + ((i * 7) % 18)),
}));

const STYLES = `
.osd-lamp { animation: osd-lamp 5.5s ease-in-out infinite; }
@keyframes osd-lamp { 0%,100% { opacity: .55; } 40% { opacity: .9; } 55% { opacity: .62; } 75% { opacity: .95; } }
.osd-candle { animation: osd-candle 3.1s ease-in-out infinite; }
@keyframes osd-candle { 0%,100% { opacity: .5; } 20% { opacity: .95; } 35% { opacity: .6; } 60% { opacity: 1; } 80% { opacity: .65; } }
.osd-mote { position: absolute; border-radius: 9999px; background: radial-gradient(circle, rgba(255,222,150,.95), rgba(255,190,100,0) 70%); opacity: 0; animation: osd-mote ease-in-out infinite; }
@keyframes osd-mote { 0% { opacity: 0; transform: translate3d(0,10px,0); } 30% { opacity: .85; } 100% { opacity: 0; transform: translate3d(var(--dx, 14px),-60px,0); } }
.osd-btn { position: relative; overflow: hidden; isolation: isolate; }
.osd-btn::before { content: ""; position: absolute; inset: 0; z-index: -1; background: #d9bd83; transform: translateX(-101%); transition: transform .55s ${EASE}; }
.osd-btn:hover::before, .osd-btn:focus-visible::before { transform: none; }
@media (prefers-reduced-motion: reduce) { .osd-lamp, .osd-candle, .osd-mote { animation: none; } .osd-mote { display: none; } }
`;

/** A line that rises out of its own mask (driven by scroll through data-r). */
const Mask: React.FC<{ className?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({
  className = "",
  style,
  children,
}) => (
  <span className={`block overflow-hidden pb-[0.14em] -mb-[0.14em] ${className}`} style={style}>
    <span data-r="mask" className="block will-change-transform" style={{ transform: "translateY(105%)" }}>
      {children}
    </span>
  </span>
);

/** Paragraph whose words light up one after another with the scroll. */
const Words: React.FC<{ text: string; className?: string; style?: React.CSSProperties }> = ({
  text,
  className = "",
  style,
}) => (
  <p className={className} style={style}>
    {text.split(" ").map((w, i) => (
      <span key={i} data-w className="mr-[0.28em] inline-block" style={{ opacity: 0.1 }}>
        {w}
      </span>
    ))}
  </p>
);

export const OurStoryDesktop: React.FC = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [entered, setEntered] = useState(false);

  // photograph fades up from black once
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
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    const one = <T extends Element>(sel: string) => stage.querySelector<T>(sel);
    const all = <T extends Element>(sel: string) => Array.from(stage.querySelectorAll<T>(sel));
    const cam = one<HTMLElement>("[data-cam]");
    const spot = one<HTMLElement>("[data-spot]");
    const shadeL = one<HTMLElement>("[data-shade-l]");
    const shadeR = one<HTMLElement>("[data-shade-r]");
    const rail = one<HTMLElement>("[data-rail]");
    const railFill = one<HTMLElement>("[data-rail-fill]");
    const railDots = all<HTMLElement>("[data-rail-dot]");
    const cue = one<HTMLElement>("[data-cue]");
    const numerals = all<HTMLElement>("[data-numeral]");
    const streaks = all<HTMLElement>("[data-streak]");
    const thread = one<SVGPathElement>("[data-thread]");
    const threadGlow = one<SVGPathElement>("[data-thread-glow]");
    const threadReveal = one<SVGPathElement>("[data-thread-reveal]");
    const needle = one<SVGGElement>("[data-needle]");
    const threadLen = thread ? thread.getTotalLength() : 0;
    // Where along the thread the sketch wall (waypoint B) sits, as a 0..1 fraction
    let threadB = 0.4;
    if (thread && threadLen) {
      let best = Infinity;
      for (let i = 0; i <= 200; i++) {
        const pt = thread.getPointAtLength((i / 200) * threadLen);
        const d = Math.hypot(pt.x - THREAD_B.x, pt.y - THREAD_B.y);
        if (d < best) {
          best = d;
          threadB = i / 200;
        }
      }
    }
    const notes = all<HTMLElement>("[data-note]");
    const scenes = (["a", "b", "c"] as const).map((k) => {
      const el = one<HTMLElement>(`[data-scene='${k}']`);
      return {
        el,
        t: SCENES[k],
        masks: el ? Array.from(el.querySelectorAll<HTMLElement>("[data-r='mask']")) : [],
        fades: el ? Array.from(el.querySelectorAll<HTMLElement>("[data-r='fade']")) : [],
        words: el ? Array.from(el.querySelectorAll<HTMLElement>("[data-w]")) : [],
      };
    });

    let stageAR = stage.clientWidth / Math.max(1, stage.clientHeight);
    let target = 0;
    let cur = 0;
    let raf = 0;

    // photograph fraction -> stage fraction (the photo is object-cover inside the stage)
    const toStage = (fx: number, fy: number) => {
      if (stageAR < IMG_AR) {
        const vis = stageAR / IMG_AR;
        return { x: (fx - (1 - vis) / 2) / vis, y: fy };
      }
      const vis = IMG_AR / stageAR;
      return { x: fx, y: (fy - (1 - vis) / 2) / vis };
    };

    const camAt = (p: number) => {
      let i = 0;
      while (i < CAM.length - 2 && p > CAM[i + 1].p) i++;
      const a = CAM[i];
      const b = CAM[i + 1];
      const t = sm(p, a.p, b.p);
      return { s: lerp(a.s, b.s, t), x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
    };

    const apply = (p: number) => {
      // Camera: focus point brought toward the centre, never past the photograph's edges
      const c = camAt(p);
      const f = toStage(c.x, c.y);
      const lim = (fx: number) => ({ lo: -(c.s - 1) * (1 - fx), hi: (c.s - 1) * fx });
      const lx = lim(f.x);
      const ly = lim(f.y);
      const tx = Math.min(lx.hi, Math.max(lx.lo, 0.5 - f.x));
      const ty = Math.min(ly.hi, Math.max(ly.lo, 0.5 - f.y));
      if (cam) {
        cam.style.transformOrigin = `${(f.x * 100).toFixed(2)}% ${(f.y * 100).toFixed(2)}%`;
        cam.style.transform = `translate3d(${(tx * 100).toFixed(3)}%, ${(ty * 100).toFixed(3)}%, 0) scale(${c.s.toFixed(4)})`;
      }
      // Spotlight: a 3x3 stage-sized dark veil with a clear eye, carried onto the focus point
      if (spot) {
        const px = f.x + tx;
        const py = f.y + ty;
        spot.style.transform = `translate3d(${(((px - 0.5) / 3) * 100).toFixed(3)}%, ${(((py - 0.5) / 3) * 100).toFixed(3)}%, 0)`;
      }

      // Reading shade follows the side the copy sits on
      const aVis = sm(p, SCENES.a[0], SCENES.a[1]) * (1 - sm(p, SCENES.a[2], SCENES.a[3]));
      const bVis = sm(p, SCENES.b[0], SCENES.b[1]) * (1 - sm(p, SCENES.b[2], SCENES.b[3]));
      const cVis = sm(p, SCENES.c[0], SCENES.c[1]);
      const vis = [aVis, bVis, cVis];
      if (shadeR) shadeR.style.opacity = Math.max(aVis, cVis).toFixed(3);
      if (shadeL) shadeL.style.opacity = bVis.toFixed(3);

      scenes.forEach(({ el, t, masks, fades, words }) => {
        if (!el) return;
        const inn = sm(p, t[0], t[1]);
        const out = sm(p, t[2], t[3]);
        el.style.visibility = inn * (1 - out) > 0.001 ? "visible" : "hidden";
        masks.forEach((m, j) => {
          const i2 = sm(p, t[0] + j * 0.012, t[1] + j * 0.012);
          const o2 = sm(p, t[2] + j * 0.008, t[3] + j * 0.008);
          m.style.transform = `translate3d(0, ${((1 - i2) * 105 - o2 * 105).toFixed(2)}%, 0)`;
        });
        fades.forEach((f2, j) => {
          const i2 = sm(p, t[0] + 0.03 + j * 0.012, t[1] + 0.03 + j * 0.012);
          f2.style.opacity = (i2 * (1 - out)).toFixed(3);
          f2.style.transform = `translate3d(0, ${((1 - i2) * 22 - out * 14).toFixed(1)}px, 0)`;
        });
        // words light up one after another
        const n = words.length;
        if (n) {
          const q = clamp01((p - (t[0] + 0.035)) / 0.085);
          words.forEach((w, i) => {
            const e = sm(q * (n + 7) - i - 1, 0, 1);
            w.style.opacity = ((0.1 + 0.9 * e) * (1 - out)).toFixed(3);
          });
        }
      });

      // Handwritten notes on the photograph, written as the camera arrives
      notes.forEach((n, i) => {
        const t = SCENES[(["a", "b", "c"] as const)[i]];
        const w = sm(p, t[0] + 0.05, t[1] + 0.09);
        const o = 1 - sm(p, t[2], t[3]);
        n.style.clipPath = `inset(-10% ${((1 - w) * 104).toFixed(1)}% -10% 0)`;
        n.style.opacity = (Math.min(1, w * 4) * o).toFixed(3);
      });

      // The gold thread: stitched by the scroll, needle riding its tip
      if (thread && threadLen) {
        // Chapter by chapter: it starts at the designer's hand, travels to the sketch wall while
        // the camera moves I -> II, rests there, then runs on to the gown as the camera moves II -> III
        const seed = 0.02; // a first stitch appears at the hand as chapter I opens
        const tp =
          sm(p, 0.05, 0.13) * seed +
          sm(p, 0.13, 0.43) * (threadB - seed) +
          sm(p, 0.57, 0.87) * (1 - threadB);
        const off = (1 - tp).toFixed(4);
        if (threadReveal) threadReveal.style.strokeDashoffset = off;
        if (threadGlow) threadGlow.style.strokeDashoffset = off;
        if (needle) {
          const pt = thread.getPointAtLength(tp * threadLen);
          const pt2 = thread.getPointAtLength(Math.min(threadLen, tp * threadLen + 2));
          const ang = (Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180) / Math.PI;
          needle.setAttribute(
            "transform",
            `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${ang.toFixed(1)})`
          );
          needle.style.opacity = p > 0.05 && tp < 0.996 ? "1" : "0";
        }
      }

      // Light sweeping across the frame between chapters
      streaks.forEach((s, i) => {
        const centre = i === 0 ? 0.365 : 0.685;
        const k = sm(p, centre - 0.06, centre + 0.06);
        s.style.transform = `translate3d(${lerp(-40, 135, k).toFixed(2)}vw, 0, 0) skewX(-16deg)`;
        s.style.opacity = (Math.sin(k * Math.PI) * 0.9).toFixed(3);
      });

      // Faint chapter numeral behind the copy
      numerals.forEach((n, i) => {
        n.style.opacity = (vis[i] * 0.09).toFixed(3);
        n.style.transform = `translate3d(0, ${((1 - vis[i]) * 40).toFixed(1)}px, 0)`;
      });

      if (cue) cue.style.opacity = (1 - sm(p, 0, 0.05)).toFixed(3);
      if (rail) rail.style.opacity = sm(p, 0.01, 0.06).toFixed(3);
      if (railFill) railFill.style.transform = `scaleY(${p.toFixed(4)})`;
      const starts = [0, 0.4, 0.78];
      railDots.forEach((d, i) => {
        d.style.opacity = p >= starts[i] - 0.001 ? "1" : "0.3";
      });
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
    const onResize = () => {
      stageAR = stage.clientWidth / Math.max(1, stage.clientHeight);
      onScroll();
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

  const shadow = "0 2px 14px rgba(0,0,0,0.7)";

  return (
    <div ref={trackRef} className="relative w-full bg-[#0e0d0c]" style={{ height: "460vh" }}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div
        ref={stageRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ containerType: "size" }}
      >
        {/* The photograph: fades up from black once, then the camera moves through it */}
        <div
          className="absolute inset-0"
          style={{ opacity: entered ? 1 : 0, transition: "opacity 1.8s ease-out" }}
        >
          <div data-cam className="absolute inset-0 will-change-transform">
            {/* The "plate": exactly the photograph's shape, covering the stage. Everything inside
                uses photograph coordinates, so the thread and notes stay glued to the picture. */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: `max(100cqw, calc(100cqh * ${IMG_AR.toFixed(4)}))`,
                aspectRatio: `${1713} / ${918}`,
                containerType: "inline-size",
              }}
            >
              <Image
                src="/images/ourStroy.webp"
                alt="Maison D'Vine atelier: the designer sketching beside a gown on the form"
                fill
                unoptimized
                sizes="100vw"
                className="pointer-events-none object-fill select-none"
              />

              {/* Gold thread, stitched by the scroll */}
              <svg
                viewBox="0 0 1713 918"
                className="pointer-events-none absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <defs>
                  {/* the stitches are revealed by a solid path growing along the same curve */}
                  <mask id="osd-thread-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1713" height="918">
                    <path
                      data-thread-reveal
                      d={THREAD}
                      fill="none"
                      stroke="white"
                      strokeWidth="16"
                      strokeLinecap="round"
                      pathLength={1}
                      style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
                    />
                  </mask>
                </defs>
                <path
                  data-thread-glow
                  d={THREAD}
                  fill="none"
                  stroke="#ffd98f"
                  strokeOpacity="0.28"
                  strokeWidth="11"
                  strokeLinecap="round"
                  pathLength={1}
                  style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
                />
                <path
                  data-thread
                  d={THREAD}
                  fill="none"
                  stroke="#f0cf8a"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="18 9"
                  mask="url(#osd-thread-mask)"
                />
                <g data-needle style={{ opacity: 0 }}>
                  <line x1="-26" y1="0" x2="24" y2="0" stroke="#f6e3b3" strokeWidth="3" strokeLinecap="round" />
                  <ellipse cx="-19" cy="0" rx="5" ry="1.8" fill="none" stroke="#f6e3b3" strokeWidth="1.5" />
                  <circle cx="24" cy="0" r="2.6" fill="#fff3d3" />
                  <circle r="14" fill="#ffd98f" opacity="0.22" />
                </g>
              </svg>

              {/* Handwritten notes beside each subject */}
              {NOTES.map((n) => (
                <p
                  key={n.text}
                  data-note
                  className="font-allura allura-regular font-script font-cursive absolute leading-[1.05] tracking-wide whitespace-nowrap text-[#f8ecd6]"
                  style={{
                    left: `${n.x * 100}%`,
                    top: `${n.y * 100}%`,
                    fontSize: "3.3cqw",
                    transform: `rotate(${n.rot}deg)`,
                    textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                    opacity: 0,
                    clipPath: "inset(-10% 104% -10% 0)",
                  }}
                >
                  {n.text}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Lamp + candle glow (flicker) */}
        <div
          aria-hidden="true"
          className="osd-lamp pointer-events-none absolute top-[22%] left-[-2%] h-[34%] w-[26%]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,198,110,0.4), rgba(255,160,60,0.1) 55%, transparent 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="osd-candle pointer-events-none absolute top-[6%] right-[12%] h-[24%] w-[20%]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,205,120,0.4), rgba(255,170,70,0.1) 60%, transparent 100%)",
          }}
        />

        {/* Spotlight: shadow falls away from wherever the camera is looking */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <div
            data-spot
            className="absolute will-change-transform"
            style={{
              width: "300%",
              height: "300%",
              left: "-100%",
              top: "-100%",
              background:
                "radial-gradient(ellipse 12% 13% at 50% 50%, rgba(8,6,5,0) 0%, rgba(8,6,5,0.12) 55%, rgba(8,6,5,0.6) 100%)",
            }}
          />
        </div>

        {/* Reading shades, side follows the chapter */}
        <div
          data-shade-r
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            opacity: 0,
            background:
              "linear-gradient(270deg, rgba(8,6,5,0.88) 0%, rgba(8,6,5,0.66) 30%, rgba(8,6,5,0.2) 52%, transparent 66%)",
          }}
        />
        <div
          data-shade-l
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            opacity: 0,
            background:
              "linear-gradient(90deg, rgba(8,6,5,0.88) 0%, rgba(8,6,5,0.66) 30%, rgba(8,6,5,0.2) 52%, transparent 66%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[3]"
          style={{
            background:
              "linear-gradient(180deg, rgba(14,13,12,0.6) 0%, transparent 14%, transparent 84%, rgba(14,13,12,0.7) 100%)",
          }}
        />

        {/* Dust through the light */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[4] overflow-hidden">
          {MOTES.map((m, i) => (
            <span
              key={i}
              className="osd-mote"
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

        {/* Warm light sweeping across between chapters */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[6] overflow-hidden">
          {[0, 1].map((i) => (
            <div
              key={i}
              data-streak
              className="absolute inset-y-[-10%] left-0 w-[26vw] will-change-transform"
              style={{
                opacity: 0,
                background:
                  "linear-gradient(100deg, transparent 0%, rgba(255,228,176,0.18) 45%, rgba(255,240,205,0.3) 52%, rgba(255,228,176,0.18) 60%, transparent 100%)",
              }}
            />
          ))}
        </div>

        {/* Faint chapter numerals */}
        {(
          [
            { n: "I", cls: "right-[4vw]" },
            { n: "II", cls: "left-[3vw]" },
            { n: "III", cls: "right-[4vw]" },
          ] as const
        ).map((c) => (
          <div
            key={c.n}
            data-numeral
            aria-hidden="true"
            className={`pointer-events-none absolute top-[14%] z-[5] font-serif leading-none text-white will-change-transform select-none ${c.cls}`}
            style={{ fontSize: "min(24vw, 360px)", opacity: 0 }}
          >
            {c.n}
          </div>
        ))}

        {/* ===== I. A FEELING (copy on the right) ===== */}
        <div
          data-scene="a"
          className="absolute top-1/2 right-[7vw] z-20 w-[36vw] max-w-[560px] -translate-y-1/2"
          style={{ visibility: "hidden" }}
        >
          <div className="overflow-hidden">
            <p
              data-r="mask"
              className="font-sans font-medium tracking-[0.3em] text-[#e6c98f] uppercase will-change-transform"
              style={{ minHeight: "1.6em", fontSize: "max(11px, 0.8vw)" }}
            >
              Our Story &mdash; I
            </p>
          </div>
          <h2
            className="mt-[1.1vw] font-serif leading-[1.04] font-normal text-white"
            style={{ fontSize: "min(4.6vw, 76px)", textShadow: shadow }}
          >
            <Mask>From a</Mask>
            <Mask>Feeling</Mask>
          </h2>
          <span
            data-r="fade"
            className="mt-[1.4vw] block h-px w-[42%] bg-gradient-to-r from-[#e6c98f] to-transparent"
          />
          <Words
            className="mt-[1.5vw] max-w-[430px] font-sans leading-[1.75] text-[#f3ece1]"
            style={{ fontSize: "max(13px, 1vw)", textShadow: "0 1px 8px rgba(0,0,0,0.75)" }}
            text="Maison D'Vine was born from a simple belief — that every woman carries a story, and what she wears should feel like a part of it."
          />
        </div>

        {/* ===== II. A MAISON (copy on the left) ===== */}
        <div
          data-scene="b"
          className="absolute top-1/2 left-[7vw] z-20 w-[36vw] max-w-[560px] -translate-y-1/2"
          style={{ visibility: "hidden" }}
        >
          <div className="overflow-hidden">
            <p
              data-r="mask"
              className="font-sans font-medium tracking-[0.3em] text-[#e6c98f] uppercase will-change-transform"
              style={{ minHeight: "1.6em", fontSize: "max(11px, 0.8vw)" }}
            >
              Our Story &mdash; II
            </p>
          </div>
          <h2
            className="mt-[1.1vw] font-serif leading-[1.04] font-normal text-white"
            style={{ fontSize: "min(4.6vw, 76px)", textShadow: shadow }}
          >
            <Mask>to a</Mask>
            <Mask>
              <em className="text-[#ecd09a] italic">Maison.</em>
            </Mask>
          </h2>
          <span
            data-r="fade"
            className="mt-[1.4vw] block h-px w-[42%] bg-gradient-to-r from-[#e6c98f] to-transparent"
          />
          <Words
            className="mt-[1.5vw] max-w-[430px] font-sans leading-[1.75] text-[#f3ece1]"
            style={{ fontSize: "max(13px, 1vw)", textShadow: "0 1px 8px rgba(0,0,0,0.75)" }}
            text="What started as a personal journey has now become a space for stories, emotions and beautifully crafted dresses."
          />
        </div>

        {/* ===== III. A JOURNEY (copy on the left) ===== */}
        <div
          data-scene="c"
          className="absolute top-1/2 right-[7vw] z-20 w-[36vw] max-w-[620px] -translate-y-1/2"
          style={{ visibility: "hidden" }}
        >
          <div className="overflow-hidden">
            <p
              data-r="mask"
              className="font-sans font-medium tracking-[0.3em] text-[#e6c98f] uppercase will-change-transform"
              style={{ minHeight: "1.6em", fontSize: "max(11px, 0.8vw)" }}
            >
              Our Story &mdash; III
            </p>
          </div>
          <p
            className="font-allura allura-regular font-script font-cursive mt-[0.6vw] -rotate-[4deg] leading-[1.05] tracking-wide text-[#f6ead6]"
            style={{ fontSize: "min(5.6vw, 92px)", textShadow: shadow }}
          >
            <span data-r="fade" className="block">
              More than a brand.
            </span>
            <span data-r="fade" className="block pl-[1.2em]">
              a journey.
            </span>
          </p>
          <div data-r="fade" className="mt-[2.4vw] flex items-center gap-[2vw]">
            <button
              type="button"
              className="osd-btn group inline-flex cursor-pointer items-center gap-3 bg-[#fdfcfb] px-7 py-3 font-sans text-[11px] font-medium tracking-[0.2em] text-[#191512] uppercase shadow-[0_6px_20px_rgba(0,0,0,0.45)] transition-transform duration-300 active:scale-[0.98]"
            >
              <span>Read Further</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">&rarr;</span>
            </button>
            <p
              className="font-allura allura-regular font-script font-cursive -rotate-[4deg] leading-[1.05] tracking-wide text-[#d9cdb9]"
              style={{ fontSize: "min(2.3vw, 38px)" }}
            >
              Built on stories.
              <br />
              for her.
            </p>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          data-cue
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[16%] left-[7vw] z-20 flex items-center gap-3 font-sans text-[9px] tracking-[0.4em] text-white/70 uppercase"
        >
          Scroll
          <span className="relative block h-px w-10 overflow-hidden bg-white/25">
            <span className="absolute inset-y-0 left-0 w-1/2 animate-pulse bg-[#e6c98f]" />
          </span>
        </div>

        {/* Chapter rail */}
        <div
          data-rail
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-[2vw] z-30 flex h-[30vh] -translate-y-1/2 flex-col items-center"
          style={{ opacity: 0 }}
        >
          <div className="relative h-full w-px bg-white/20">
            <div data-rail-fill className="absolute inset-0 origin-top bg-[#e6c98f]" style={{ transform: "scaleY(0)" }} />
            {["I", "II", "III"].map((s, i) => (
              <span
                key={s}
                data-rail-dot
                className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 font-mono text-[9px] text-[#e6c98f] transition-opacity duration-500"
                style={{ top: `${(i / 2) * 100}%`, opacity: 0.3 }}
              >
                <span className="absolute right-3">{s}</span>
                <span className="block h-1.5 w-1.5 rounded-full bg-[#e6c98f]" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
