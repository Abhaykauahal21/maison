"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useMatches } from "@/hooks/use-matches";

/**
 * The About page, told as a story. Every scene is a pinned stage whose whole choreography is driven by ONE
 * number, --p (0 → 1 across the scene), written onto the section while it is near the screen. The artwork is
 * layered SVG (far / middle / front) and each layer moves by its own amount of --p, so the page has depth.
 * Nothing is "triggered": scrolling back un-draws, un-cuts and un-stitches the story.
 */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** 0 → 1 as --p travels from a to b (CSS). */
export const ramp = (a: number, b: number) => `clamp(0, calc((var(--p) - ${a}) / ${(b - a).toFixed(4)}), 1)`;
/** 0 → 1 → 0: fades in over `f`, holds, fades out over `f`. */
export const win = (a: number, b: number, f = 0.05) =>
  `clamp(0, min(calc((var(--p) - ${a}) / ${f}), calc((${b} - var(--p)) / ${f})), 1)`;

/** Pinned scenes scrub across their own height; flowing ones across their trip over the screen. */
function useScene(pinned: boolean, onFrame?: (p: number) => void) {
  const ref = useRef<HTMLElement | null>(null);
  const frame = useRef(onFrame);
  useEffect(() => {
    frame.current = onFrame;
  });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let target = 0;
    let cur = 0;
    const write = () => {
      el.style.setProperty("--p", cur.toFixed(4));
      frame.current?.(cur);
    };
    const measure = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -vh * 0.6 || r.top > vh * 1.6) return false;
      target = pinned
        ? clamp01(-r.top / Math.max(1, r.height - vh))
        : clamp01((vh - r.top) / (vh + r.height));
      return true;
    };
    const tick = () => {
      cur += (target - cur) * 0.14;
      if (Math.abs(target - cur) < 0.0004) {
        cur = target;
        raf = 0;
      } else raf = requestAnimationFrame(tick);
      write();
    };
    const onScroll = () => {
      if (measure() && !raf && target !== cur) raf = requestAnimationFrame(tick);
    };
    measure();
    cur = target;
    write();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pinned]);
  return ref;
}

/** A pinned stage: the section is tall, the stage stays on screen while --p runs. */
const Scene: React.FC<{
  label: string;
  vh: number;
  className?: string;
  onFrame?: (p: number) => void;
  children: React.ReactNode;
}> = ({ label, vh, className = "", onFrame, children }) => {
  const ref = useScene(true, onFrame);
  return (
    <section
      ref={ref}
      aria-label={label}
      className={`relative w-full ${className}`}
      style={{ height: `${vh}svh`, ["--p" as string]: 0 }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">{children}</div>
    </section>
  );
};

/** One line of the story: script headline + a line of serif, rising in and out with the scroll. */
const Beat: React.FC<{
  a: number;
  b: number;
  script: string;
  text: string;
  tone?: "dark" | "light";
}> = ({ a, b, script, text, tone = "dark" }) => (
  <div
    className="absolute inset-x-0 top-0 will-change-transform"
    style={{
      opacity: win(a, b),
      transform: `translate3d(0, calc((1 - ${ramp(a, a + 0.06)}) * 34px - ${ramp(b - 0.06, b)} * 34px), 0)`,
    }}
  >
    <p
      className={`font-allura allura-regular font-script font-cursive text-[clamp(38px,5.2vw,78px)] leading-[1.02] ${
        tone === "dark" ? "text-[#8a6a3b]" : "text-[#ecd09a]"
      }`}
      style={tone === "light" ? { textShadow: "0 2px 18px rgba(0,0,0,0.65)" } : undefined}
    >
      {script}
    </p>
    <p
      className={`mt-4 max-w-[430px] font-serif text-[16px] leading-[1.8] italic sm:text-[18px] ${
        tone === "dark" ? "text-[#2e2418]" : "text-[#e3d8c6]"
      }`}
      style={tone === "light" ? { textShadow: "0 1px 10px rgba(0,0,0,0.7)" } : undefined}
    >
      {text}
    </p>
  </div>
);

/** Gown, the same one the intro loader stitches (viewBox 300 x 520). */
export const GOWN =
  "M124 26 C126 50 134 66 150 84 C166 66 174 50 176 26 C178 60 184 84 186 104 C184 130 168 150 170 172 C176 262 226 382 238 494 C212 514 178 504 150 514 C122 504 88 514 62 494 C74 382 124 262 130 172 C132 150 116 130 114 104 C116 84 122 60 124 26 Z";

const dust = (n: number, seed: number) =>
  Array.from({ length: n }, (_, i) => {
    const r = (k: number) => {
      const x = Math.sin((i + 1) * 12.9898 * (seed + k)) * 43758.5453;
      return x - Math.floor(x);
    };
    const q = (v: number) => Math.round(v * 10) / 10; // rounded, so server and client markup match exactly
    return { x: q(r(1) * 100), y: q(r(2) * 100), s: q(1 + r(3) * 2.4), o: q((0.25 + r(4) * 0.5) * 10) / 10, d: q(r(5) * 6) };
  });

/* ------------------------------------------------------------------ */
/*  HERO DEPTH: sits behind the opening, drifts at its own speed        */
/* ------------------------------------------------------------------ */
export const useHeroProgress = () => useScene(false);

const THUMBS = [
  { x: 6, y: 14, s: 0.2, r: -12 },
  { x: 44, y: 6, s: 0.15, r: 8 },
  { x: 86, y: 20, s: 0.22, r: 14 },
  { x: 62, y: 74, s: 0.17, r: -6 },
  { x: 14, y: 80, s: 0.24, r: 10 },
];

export const HeroDepth: React.FC = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
    {/* far: a wall of faint gown sketches, drifting the slowest */}
    <div className="absolute inset-0" style={{ transform: "translate3d(0, calc(var(--p, 0) * -70px), 0)" }}>
      {THUMBS.map((t, i) => (
        <svg
          key={i}
          viewBox="0 0 300 520"
          className="absolute"
          style={{ left: `${t.x}%`, top: `${t.y}%`, width: `${t.s * 100 * 0.6}px`, transform: `rotate(${t.r}deg)`, opacity: 0.26 }}
        >
          <path d={GOWN} stroke="#8a6a3b" strokeWidth="5" fill="none" strokeLinejoin="round" strokeDasharray="10 12" />
        </svg>
      ))}
    </div>
    {/* middle: needles hanging on their threads, swaying */}
    <div className="absolute inset-0" style={{ transform: "translate3d(0, calc(var(--p, 0) * 120px), 0)" }}>
      {[
        { x: 30, len: 120, d: 0 },
        { x: 47, len: 70, d: 1.4 },
        { x: 92, len: 150, d: 0.7 },
      ].map((n, i) => (
        <svg
          key={i}
          viewBox="-30 0 60 200"
          className="ab-sway absolute top-0 origin-top"
          style={{ left: `${n.x}%`, width: 40, height: 200, animationDelay: `-${n.d}s` }}
        >
          <path d={`M0 0 C-6 ${n.len * 0.3} 6 ${n.len * 0.6} 0 ${n.len}`} stroke="#8a6a3b" strokeOpacity="0.55" strokeWidth="1.2" fill="none" />
          <g transform={`translate(0 ${n.len}) rotate(8)`}>
            <path d="M0 0 L3 38" stroke="#9aa0a6" strokeWidth="2.2" strokeLinecap="round" />
            <ellipse cx="0" cy="3" rx="1.6" ry="4.2" fill="#f3ead9" stroke="#9aa0a6" strokeWidth="1" />
          </g>
        </svg>
      ))}
    </div>
    {/* front: gold sparks, the fastest */}
    <div className="absolute inset-0" style={{ transform: "translate3d(0, calc(var(--p, 0) * -190px), 0)" }}>
      {dust(14, 3).map((d, i) => (
        <span
          key={i}
          className="ab-twinkle absolute rounded-full bg-[#c9a24d]"
          style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.s * 2, height: d.s * 2, opacity: d.o, animationDelay: `-${d.d}s` }}
        />
      ))}
    </div>
  </div>
);


/* ------------------------------------------------------------------ */
/*  THE MAKING: one continuous scene, one gown that is the whole story  */
/*                                                                      */
/*  sketched on paper → cut from cloth → stitched → hung under nine     */
/*  moons → its own shape opens like a window onto the woman wearing it */
/* ------------------------------------------------------------------ */
const sm = (t: number) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Where the gown lies on the table (world units), and what its local (150,260) maps to. */
const HOME = { x: 800, y: 410, s: 1.15 };
const HOME_T = `translate(${HOME.x} ${HOME.y}) scale(${HOME.s}) translate(-150 -260)`;
const DIVE = { x: 150, y: 400 }; // the point of the skirt the final window opens from

/** Gown details that are stitched, in the order the needle sews them. */
const SEAMS = [
  "M150 84 C150 110 150 140 150 172",
  "M131 174 C146 182 154 182 169 174",
  "M150 184 C146 270 130 380 104 500",
  "M150 184 C154 270 170 380 196 502",
  "M141 184 C128 262 98 372 82 496",
  "M159 184 C172 262 202 372 218 496",
];
const DIMS = [
  { y: 96, x1: 108, x2: 192, lx: 204, label: "bust", a: 0.09 },
  { y: 182, x1: 122, x2: 178, lx: 190, label: "waist", a: 0.11 },
  { y: 508, x1: 58, x2: 242, lx: 254, label: "hem", a: 0.13 },
];

// the beats of the timeline (0 → 1)
const T = {
  sketch: [0.02, 0.16],
  paperOut: [0.18, 0.26],
  cut: [0.27, 0.41],
  lift: [0.41, 0.45],
  place: [0.47, 0.51],
  stitch: [0.52, 0.64],
  night: [0.66, 0.72],
  moon0: 0.7,
  hole: [0.855, 0.875],
  zoom: [0.875, 0.985],
} as const;

const R_STARS = [0, 1, 2].map((k) => dust(k === 0 ? 26 : 16, 11 + k * 7));
const SPOOL = { x: 560, y: 640 };

const pieceAt = (p: number) => {
  const lift = sm((p - T.lift[0]) / (T.lift[1] - T.lift[0]));
  const place = sm((p - T.place[0]) / (T.place[1] - T.place[0]));
  const night = sm((p - T.night[0] + 0.02) / 0.08);
  return {
    x: HOME.x,
    y: 410 - 34 * lift + 44 * place + 50 * night,
    s: 1.15 + 0.1 * place - 0.39 * night,
    r: Math.sin(p * 55) * 1.2 * night,
  };
};

export const StoryScene: React.FC = () => {
  const wide = useMatches("(min-aspect-ratio: 5/4)") !== false;
  const vb = wide ? { x: 0, y: 0, w: 1200, h: 800 } : { x: 420, y: -30, w: 760, h: 900 };
  const mr = wide ? 30 : 24;
  const moons = Array.from({ length: 9 }, (_, i) => ({
    x: Math.round(vb.x + 60 + i * ((vb.w - 120) / 8)),
    y: Math.round(vb.y + (wide ? 190 : 160) - Math.sin((Math.PI * i) / 8) * (wide ? 90 : 60)),
    a: T.moon0 + i * 0.016,
  }));

  const svg = useRef<SVGSVGElement | null>(null);
  const outline = useRef<SVGPathElement | null>(null);
  const pencil = useRef<SVGGElement | null>(null);
  const cutPath = useRef<SVGPathElement | null>(null);
  const scissors = useRef<SVGGElement | null>(null);
  const bladeA = useRef<SVGGElement | null>(null);
  const bladeB = useRef<SVGGElement | null>(null);
  const piece = useRef<SVGGElement | null>(null);
  const seams = useRef<(SVGPathElement | null)[]>([]);
  const needle = useRef<SVGGElement | null>(null);
  const thread = useRef<SVGPathElement | null>(null);
  const spokes = useRef<SVGGElement | null>(null);
  const hole = useRef<SVGPathElement | null>(null);

  const onFrame = (p: number) => {
    // pencil: follows the outline as it is drawn
    const o = outline.current;
    const pc = pencil.current;
    if (o && pc) {
      const prog = clamp01((p - T.sketch[0]) / (T.sketch[1] - T.sketch[0]));
      const pt = o.getPointAtLength(prog * o.getTotalLength());
      pc.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(-34) scale(0.9)`);
      pc.style.opacity = prog > 0.002 && prog < 0.998 ? "1" : "0";
    }

    // scissors: ride the chalk line
    const cp = cutPath.current;
    const sc = scissors.current;
    if (cp && sc && bladeA.current && bladeB.current) {
      const prog = clamp01((p - T.cut[0]) / (T.cut[1] - T.cut[0]));
      const len = cp.getTotalLength();
      const a = cp.getPointAtLength(prog * len);
      const b = cp.getPointAtLength(Math.min(len, prog * len + 4));
      const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      sc.setAttribute("transform", `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(1.5)`);
      const open = 3 + Math.abs(Math.sin(prog * 70)) * 15;
      bladeA.current.setAttribute("transform", `rotate(${(-open).toFixed(1)})`);
      bladeB.current.setAttribute("transform", `scale(1 -1) rotate(${(-open).toFixed(1)})`);
      sc.style.opacity = prog > 0.002 && prog < 0.998 ? "1" : "0";
    }

    // the cut-out piece: lifts, is laid down for stitching, then hangs under the moons
    const T2 = pieceAt(p);
    piece.current?.setAttribute(
      "transform",
      `translate(${T2.x.toFixed(1)} ${T2.y.toFixed(1)}) rotate(${T2.r.toFixed(2)}) scale(${T2.s.toFixed(4)}) translate(-150 -260)`
    );

    // needle + thread + spool while the seams are sewn, one after another
    const nd = needle.current;
    const th = thread.current;
    const t = (p - T.stitch[0]) / (T.stitch[1] - T.stitch[0]);
    if (nd && th) {
      if (t > 0.002 && t < 0.998) {
        const k = Math.min(SEAMS.length - 1, Math.floor(t * SEAMS.length));
        const within = t * SEAMS.length - k;
        const path = seams.current[k];
        if (path) {
          const pt = path.getPointAtLength(within * path.getTotalLength());
          const wx = T2.x + (pt.x - 150) * T2.s;
          const wy = T2.y + (pt.y - 260) * T2.s;
          const dip = Math.sin(t * 480) * 14;
          nd.setAttribute("transform", `translate(${wx.toFixed(1)} ${(wy + dip).toFixed(1)}) rotate(-16)`);
          const ex = wx + 1;
          const ey = wy + dip - 88;
          const mx = (SPOOL.x + ex) / 2;
          const my = Math.max(SPOOL.y, ey) + 60;
          th.setAttribute("d", `M${SPOOL.x} ${SPOOL.y - 6} Q${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`);
        }
        nd.style.opacity = "1";
        th.style.opacity = "1";
      } else {
        nd.style.opacity = "0";
        th.style.opacity = "0";
      }
      spokes.current?.setAttribute("transform", `rotate(${(clamp01(t) * 1800).toFixed(1)})`);
    }

    // the finale: the gown's own outline becomes a window that opens until it is the whole screen
    const h = hole.current;
    const s = svg.current;
    if (h && s) {
      const q = sm((p - T.zoom[0]) / (T.zoom[1] - T.zoom[0]));
      const base = pieceAt(0.9);
      const sEnd = 16;
      const sc2 = base.s * Math.pow(sEnd / base.s, q);
      const vbox = s.viewBox.baseVal;
      const cx = vbox.x + vbox.width / 2;
      const cy = vbox.y + vbox.height / 2;
      const ax = base.x + (DIVE.x - 150) * base.s;
      const ay = base.y + (DIVE.y - 260) * base.s;
      const px = lerp(ax, cx, q);
      const py = lerp(ay, cy, q);
      h.setAttribute("transform", `translate(${(px - DIVE.x * sc2).toFixed(1)} ${(py - DIVE.y * sc2).toFixed(1)}) scale(${sc2.toFixed(4)})`);
    }
  };

  const BIG = { x: -3000, y: -3000, w: 7200, h: 6800 };

  return (
    <Scene label="The making" vh={1700} onFrame={onFrame} className="bg-[#0b0c16]">
      {/* the photograph that the gown finally opens onto */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[#1b120d]">
        <div className="absolute inset-0" style={{ transform: `scale(calc(1.2 - ${ramp(T.zoom[0], T.zoom[1])} * 0.2))` }}>
          <Image src="/images/hero-single-girl.webp" alt="" fill sizes="100vw" className="hidden object-cover min-[1000px]:block" style={{ objectPosition: "50% 35%" }} />
          <Image src="/images/close-chapter-photo.webp" alt="" fill sizes="100vw" className="object-cover min-[1000px]:hidden" style={{ objectPosition: "50% 30%" }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/20" />
      </div>

      <svg
        ref={svg}
        aria-hidden="true"
        viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
        preserveAspectRatio={wide ? "xMidYMid meet" : "xMidYMin meet"}
        className="absolute inset-0 h-full w-full overflow-visible"
        fill="none"
      >
        <defs>
          <pattern id="st-weave" width="5" height="5" patternUnits="userSpaceOnUse">
            <rect width="5" height="5" fill="#7d1f31" />
            <path d="M0 2.5 H5 M2.5 0 V5" stroke="#a63a4c" strokeWidth="0.7" opacity="0.5" />
            <path d="M0 0 L5 5" stroke="#4d0f1c" strokeWidth="0.5" opacity="0.4" />
          </pattern>
          <linearGradient id="st-sheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
            <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.3" />
          </linearGradient>
          <radialGradient id="st-glow">
            <stop offset="0" stopColor="#f6dfaa" stopOpacity="0.5" />
            <stop offset="1" stopColor="#f6dfaa" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="st-paper" cx="0.35" cy="0.25" r="0.9">
            <stop offset="0" stopColor="#f6ecd8" />
            <stop offset="0.6" stopColor="#e8dabe" />
            <stop offset="1" stopColor="#d6c4a2" />
          </radialGradient>
          <radialGradient id="st-table" cx="0.62" cy="0.45" r="0.85">
            <stop offset="0" stopColor="#2a1812" />
            <stop offset="0.6" stopColor="#170e0b" />
            <stop offset="1" stopColor="#0c0605" />
          </radialGradient>
          <radialGradient id="st-night" cx="0.5" cy="1" r="1.1">
            <stop offset="0" stopColor="#23203a" />
            <stop offset="0.55" stopColor="#0f1020" />
            <stop offset="1" stopColor="#07070f" />
          </radialGradient>
          <clipPath id="st-clip">
            <path d={GOWN} />
          </clipPath>
          {/* the cloth has a hole where the piece was lifted out */}
          <mask id="st-cloth-hole" maskUnits="userSpaceOnUse" x={BIG.x} y={BIG.y} width={BIG.w} height={BIG.h}>
            <rect x={BIG.x} y={BIG.y} width={BIG.w} height={BIG.h} fill="white" />
            <g transform={HOME_T}>
              <path d={GOWN} fill="black" style={{ opacity: ramp(T.lift[0] + 0.005, T.lift[0] + 0.03) }} />
            </g>
          </mask>
          {/* the finale: the whole scene has a gown-shaped window in it */}
          <mask id="st-window" maskUnits="userSpaceOnUse" x={BIG.x} y={BIG.y} width={BIG.w} height={BIG.h}>
            <rect x={BIG.x} y={BIG.y} width={BIG.w} height={BIG.h} fill="white" />
            <path ref={hole} d={GOWN} fill="black" style={{ opacity: ramp(T.hole[0], T.hole[1]) }} />
          </mask>
          {/* stitch reveals (one per seam), in the piece's own coordinates */}
          {SEAMS.map((d, i) => {
            const a = T.stitch[0] + (i / SEAMS.length) * (T.stitch[1] - T.stitch[0]);
            const b = T.stitch[0] + ((i + 1) / SEAMS.length) * (T.stitch[1] - T.stitch[0]);
            return (
              <mask key={i} id={`st-seam-${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width="300" height="520">
                <path d={d} stroke="white" strokeWidth="14" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: `calc(1 - ${ramp(a, b)})` }} />
              </mask>
            );
          })}
          {moons.map((m, i) => (
            <mask key={i} id={`st-moon-${i}`} maskUnits="userSpaceOnUse" x={-mr - 4} y={-mr - 4} width={mr * 2 + 8} height={mr * 2 + 8}>
              <circle r={mr} fill="white" />
              <circle r={mr} fill="black" style={{ transform: `translateX(calc(${ramp(m.a, m.a + 0.028)} * ${mr * 2.1}px))` }} />
            </mask>
          ))}
        </defs>

        <g mask="url(#st-window)">
          {/* ===== the rooms: paper desk → dark table → night ===== */}
          {/* the rooms stack on an opaque base, so the photograph below never shows through a crossfade */}
          <rect x={BIG.x} y={BIG.y} width={BIG.w} height={BIG.h} fill="url(#st-paper)" />
          <g style={{ opacity: `calc(1 - ${ramp(T.paperOut[0], T.paperOut[1])})`, transform: "translate3d(calc(var(--p) * -80px), calc(var(--p) * -50px), 0)" }} stroke="#8a6a3b" strokeOpacity="0.22" strokeWidth="1.2">
            {Array.from({ length: 22 }, (_, i) => (
              <line key={i} x1="-400" y1={-100 + i * 60} x2="1600" y2={-100 + i * 60} strokeDasharray="2 10" />
            ))}
            <g transform="translate(70 120) rotate(-8) scale(.34)"><path d={GOWN} strokeDasharray="7 9" /></g>
            <g transform="translate(300 560) rotate(7) scale(.3)"><path d={GOWN} strokeDasharray="7 9" /></g>
            <g transform="translate(1090 560) rotate(9) scale(.36)"><path d={GOWN} strokeDasharray="7 9" /></g>
            <circle cx="260" cy="120" r="44" strokeDasharray="3 7" />
          </g>

          <g style={{ opacity: ramp(T.paperOut[0], T.paperOut[1]) }}>
            <rect x={BIG.x} y={BIG.y} width={BIG.w} height={BIG.h} fill="url(#st-table)" />
            <rect x={BIG.x} y={BIG.y} width={BIG.w} height={BIG.h} fill="none" />
            <g style={{ transform: "translate3d(calc(var(--p) * -420px), 0, 0)" }}>
              <rect x="-1400" y="752" width="4400" height="46" fill="#e9dcc0" opacity="0.92" />
              <path d={Array.from({ length: 300 }, (_, i) => `M${-1400 + i * 15} 752 v${i % 5 === 0 ? 22 : 12}`).join(" ")} stroke="#2a1d10" strokeWidth="1.2" />
            </g>
          </g>

          <g style={{ opacity: ramp(T.night[0] - 0.02, T.night[1]) }}>
            <rect x={BIG.x} y={BIG.y} width={BIG.w} height={BIG.h} fill="url(#st-night)" />
            {R_STARS.map((layer, k) => (
              <g key={k} style={{ transform: `translate3d(calc(var(--p) * ${-60 * (k + 1)}px), calc(var(--p) * ${-20 * (k + 1)}px), 0)` }}>
                {layer.map((s, i) => (
                  <circle
                    key={i}
                    className="ab-twinkle"
                    cx={vb.x - 200 + s.x * ((vb.w + 400) / 100)}
                    cy={vb.y - 100 + s.y * ((vb.h + 200) / 100) * 0.62}
                    r={s.s * (0.45 + k * 0.4)}
                    fill="#f6ead0"
                    style={{ opacity: s.o * (0.5 + k * 0.25), animationDelay: `-${s.d}s` }}
                  />
                ))}
              </g>
            ))}
            {/* nine moons, filling one by one */}
            <path
              d={moons.map((m, i) => `${i ? "L" : "M"}${m.x} ${m.y}`).join(" ")}
              stroke="#e6c98f"
              strokeOpacity="0.4"
              strokeWidth="1.2"
              pathLength={1}
              style={{ strokeDasharray: 1, strokeDashoffset: `calc(1 - ${ramp(T.moon0, 0.84)})` }}
            />
            {moons.map((m, i) => (
              <g key={i} transform={`translate(${m.x} ${m.y})`}>
                <circle r={mr * 2.6} fill="url(#st-glow)" style={{ opacity: `calc(${ramp(m.a + 0.01, m.a + 0.04)} * 0.9)` }} />
                <circle r={mr} fill="#14152a" stroke="#e6c98f" strokeOpacity="0.35" strokeWidth="1" />
                <g mask={`url(#st-moon-${i})`}>
                  <circle r={mr} fill="#f6e3b0" />
                  <circle cx={-mr * 0.26} cy={-mr * 0.24} r={mr * 0.18} fill="#d9c28c" opacity="0.55" />
                  <circle cx={mr * 0.3} cy={mr * 0.26} r={mr * 0.24} fill="#d9c28c" opacity="0.4" />
                  <circle cx={mr * 0.18} cy={-mr * 0.42} r={mr * 0.1} fill="#d9c28c" opacity="0.5" />
                </g>
              </g>
            ))}
          </g>

          {/* ===== the desk: sheet of paper, the sketch ===== */}
          <g style={{ opacity: `calc(1 - ${ramp(T.paperOut[0], T.paperOut[1])})` }}>
            <rect x="540" y="70" width="520" height="680" fill="#000" opacity="0.18" transform="translate(10 18)" style={{ filter: "blur(14px)" }} />
            <rect x="540" y="70" width="520" height="680" fill="#fbf6ea" />
            <path d={Array.from({ length: 31 }, (_, i) => `M540 ${70 + i * 22} H1060`).join(" ") + " " + Array.from({ length: 24 }, (_, i) => `M${540 + i * 22} 70 V750`).join(" ")} stroke="#8a6a3b" strokeOpacity="0.07" strokeWidth="1" />
            <g transform={HOME_T}>
              <g stroke="#9a8a70" strokeWidth="0.8" strokeDasharray="4 6" style={{ opacity: ramp(0.02, 0.1) }}>
                <line x1="150" y1="-20" x2="150" y2="540" />
                <line x1="-60" y1="104" x2="360" y2="104" />
                <line x1="-60" y1="174" x2="360" y2="174" />
                <line x1="-60" y1="498" x2="360" y2="498" />
              </g>
              <path d={GOWN} fill="#e7b9a6" style={{ opacity: `calc(${ramp(0.13, 0.18)} * 0.55)` }} />
              <path
                ref={outline}
                d={GOWN}
                stroke="#3d3a36"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                style={{ strokeDasharray: 1, strokeDashoffset: `calc(1 - ${ramp(T.sketch[0], T.sketch[1])})` }}
              />
              {SEAMS.slice(0, 3).map((d, i) => (
                <path key={i} d={d} stroke="#5a554e" strokeWidth="1.3" strokeLinecap="round" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: `calc(1 - ${ramp(0.11 + i * 0.015, 0.16 + i * 0.015)})` }} />
              ))}
              {DIMS.map((m) => (
                <g key={m.label} style={{ opacity: ramp(m.a, m.a + 0.04) }}>
                  <path d={`M${m.x1} ${m.y} H${m.x2} M${m.x1} ${m.y - 6} V${m.y + 6} M${m.x2} ${m.y - 6} V${m.y + 6}`} stroke="#8a6a3b" strokeWidth="1.1" />
                  <text x={m.lx} y={m.y + 5} fill="#8a6a3b" fontSize="24" className="font-allura">{m.label}</text>
                </g>
              ))}
              <g ref={pencil} style={{ opacity: 0 }}>
                <path d="M0 0 L-4.2 -15 L4.2 -15 Z" fill="#dcbc8c" />
                <path d="M0 0 L-1.4 -5 L1.4 -5 Z" fill="#33312e" />
                <rect x="-4.2" y="-72" width="8.4" height="57" fill="#c9922f" />
                <rect x="-4.2" y="-72" width="2.6" height="57" fill="#e6b450" />
                <rect x="-4.5" y="-80" width="9" height="8" fill="#aeb4ba" />
                <rect x="-4.5" y="-92" width="9" height="12" rx="2" fill="#e9a3a0" />
              </g>
            </g>
          </g>

          {/* ===== the table: the cloth, the chalk line, the scissors ===== */}
          <g style={{ opacity: `calc(${ramp(T.paperOut[0] + 0.01, T.paperOut[1])} * (1 - ${ramp(T.night[0], T.night[1] + 0.02)}))` }}>
            <g style={{ filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.6))" }}>
              <rect x="540" y="70" width="520" height="680" rx="4" fill="url(#st-weave)" mask="url(#st-cloth-hole)" />
              <rect x="540" y="70" width="520" height="680" rx="4" fill="url(#st-sheen)" mask="url(#st-cloth-hole)" />
            </g>
            <g transform={HOME_T}>
              <path d={GOWN} stroke="#efe3c8" strokeOpacity="0.8" strokeWidth="1.6" strokeDasharray="3 6" strokeLinecap="round" style={{ opacity: `calc(1 - ${ramp(T.lift[0], T.lift[0] + 0.03)})` }} />
              <path
                ref={cutPath}
                d={GOWN}
                stroke="#050202"
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                style={{ strokeDasharray: 1, strokeDashoffset: `calc(1 - ${ramp(T.cut[0], T.cut[1])})` }}
              />
              <path d={GOWN} stroke="#f1b9b9" strokeOpacity="0.45" strokeWidth="0.7" strokeLinecap="round" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: `calc(1 - ${ramp(T.cut[0], T.cut[1])})` }} />
              <g ref={scissors} style={{ opacity: 0, filter: "drop-shadow(3px 7px 5px rgba(0,0,0,0.55))" }}>
                <g ref={bladeA}>
                  <path d="M-6 -3 L66 -0.5 L-6 2.4 Z" fill="#d6dade" stroke="#7a8087" strokeWidth="0.8" />
                  <path d="M-6 -2 L-26 -14" stroke="#c9922f" strokeWidth="3.4" strokeLinecap="round" />
                  <circle cx="-34" cy="-19" r="10" stroke="#c9922f" strokeWidth="3.4" />
                </g>
                <g ref={bladeB}>
                  <path d="M-6 -3 L66 -0.5 L-6 2.4 Z" fill="#c4c9ce" stroke="#6b7279" strokeWidth="0.8" />
                  <path d="M-6 -2 L-26 -14" stroke="#b07a1f" strokeWidth="3.4" strokeLinecap="round" />
                  <circle cx="-34" cy="-19" r="10" stroke="#b07a1f" strokeWidth="3.4" />
                </g>
                <circle r="3" fill="#8b9096" stroke="#555a60" strokeWidth="0.8" />
              </g>
            </g>
          </g>

          {/* ===== the piece: cut, laid down, stitched, hung ===== */}
          <g ref={piece} style={{ opacity: ramp(T.paperOut[0] + 0.02, T.paperOut[1]) }}>
            <path d={GOWN} fill="#000" style={{ filter: "blur(5px)", opacity: `calc(${ramp(T.lift[0], T.lift[1])} * 0.5)`, transform: "translate(8px, 22px)" }} />
            <g clipPath="url(#st-clip)">
              <rect x="40" y="0" width="220" height="530" fill="url(#st-weave)" />
              <rect x="40" y="0" width="220" height="530" fill="url(#st-sheen)" />
            </g>
            <path d={GOWN} stroke="#f1b9b9" strokeOpacity="0.5" strokeWidth="0.8" />
            {SEAMS.map((d, i) => (
              <g key={i} mask={`url(#st-seam-${i})`}>
                <path ref={(el) => { seams.current[i] = el; }} d={d} stroke="#e9c77b" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="7 6" />
                <path d={d} stroke="#fff3cf" strokeOpacity="0.7" strokeWidth="0.8" strokeLinecap="round" strokeDasharray="7 6" />
              </g>
            ))}
            {/* a hanger, once the dress is finished and left to wait */}
            <g style={{ opacity: ramp(T.stitch[1] + 0.01, T.night[1]) }} stroke="#d1ab5a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M150 9 C150 -9 170 -16 170 -32 C170 -48 146 -50 142 -36" />
              <path d="M88 60 L150 11 L212 60" />
            </g>
          </g>

          {/* ===== the needle, the thread and the spool ride above everything ===== */}
          <g style={{ opacity: `${win(T.stitch[0] - 0.01, T.stitch[1] + 0.01, 0.012)}` }}>
            <path ref={thread} d={`M${SPOOL.x} ${SPOOL.y} Q620 700 700 400`} stroke="#e9c77b" strokeWidth="2.4" strokeLinecap="round" style={{ filter: "drop-shadow(0 4px 3px rgba(0,0,0,0.5))", opacity: 0 }} />
            <g transform={`translate(${SPOOL.x} ${SPOOL.y})`} style={{ filter: "drop-shadow(5px 9px 8px rgba(0,0,0,0.55))" }}>
              <circle r="40" fill="#b88a52" stroke="#7a5a30" strokeWidth="2" />
              <circle r="29" fill="#e9c77b" stroke="#c9a24d" strokeWidth="1.4" />
              <g ref={spokes} stroke="#a47f2e" strokeWidth="2" strokeLinecap="round">
                {Array.from({ length: 8 }, (_, i) => (
                  <line key={i} x1="8" y1="0" x2="28" y2="0" transform={`rotate(${i * 45})`} />
                ))}
              </g>
              <circle r="8" fill="#6b4a22" />
              <circle r="3" fill="#cfa660" />
            </g>
            <g ref={needle} style={{ opacity: 0, filter: "drop-shadow(3px 6px 4px rgba(0,0,0,0.55))" }}>
              <path d="M0 0 L26 -88" stroke="#dfe3e8" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M0 0 L26 -88" stroke="#fff" strokeOpacity="0.7" strokeWidth="1" strokeLinecap="round" />
              <ellipse cx="25" cy="-84" rx="2.4" ry="7" transform="rotate(16 25 -84)" fill="#1a0f10" stroke="#dfe3e8" strokeWidth="1.4" />
            </g>
          </g>
        </g>
      </svg>

      {/* ===== the words ===== */}
      <div className={`pointer-events-none relative z-20 mx-auto flex h-full w-full max-w-[1280px] px-6 pt-24 pb-10 sm:px-10 lg:px-14 ${wide ? "items-center" : "items-end"}`}>
        <div className={`relative w-full ${wide ? "h-[300px] max-w-[min(440px,36vw)]" : "h-[200px]"}`}>
          <Beat a={0.02} b={0.1} script="It begins as a feeling." text="A woman, a memory, a morning she would like to keep." />
          <Beat a={0.09} b={0.19} script="Then, a thousand sketches." text="Page after page, until one silhouette looks back at you." />
          <Beat tone="light" a={0.26} b={0.35} script="Then comes the cloth." text="Crimson silk, laid out on the table like a held breath." />
          <Beat tone="light" a={0.34} b={0.45} script="The first cut is the quietest." text="A chalk line, a steady hand, and no one watching the clock." />
          <Beat tone="light" a={0.5} b={0.64} script="Stitch by stitch." text="By hand, by lamplight, and never by the clock. Every seam a small promise." />
          <Beat tone="light" a={0.65} b={0.75} script="Nine moons." text="From the first sketch to the very last stitch." />
          <Beat tone="light" a={0.73} b={0.86} script="Not because we are slow." text="Because she deserves to be waited for." />
        </div>
      </div>

      {/* finale text, over the photograph */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[1280px] px-6 pb-14 sm:px-10 lg:px-14">
        <div className="relative h-[190px] max-w-[560px]">
          <Beat tone="light" a={0.93} b={1.02} script="And then, it lives." text="A morning, a night, a decision she was afraid to make. Worn, finally, as herself." />
        </div>
      </div>

      {/* chapter rail */}
      <div aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 z-20 hidden -translate-y-1/2 flex-col items-end gap-3 sm:flex md:right-8">
        {[
          ["Sketch", 0.02, 0.2],
          ["Cut", 0.24, 0.45],
          ["Stitch", 0.47, 0.65],
          ["Wait", 0.66, 0.86],
          ["Wear", 0.87, 1.02],
        ].map(([label, a, b]) => (
          <div key={label as string} className="flex items-center gap-3" style={{ opacity: `calc(0.3 + 0.7 * ${win(a as number, b as number, 0.02)})` }}>
            <span className="font-sans text-[10px] font-semibold tracking-[0.3em] text-[#f4efe8] uppercase mix-blend-difference">{label}</span>
            <span className="block h-px w-6 bg-[#e6c98f]" />
          </div>
        ))}
      </div>

      {/* scroll cue */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center" style={{ opacity: `calc(1 - ${ramp(0.01, 0.05)})` }}>
        <span className="font-sans text-[10px] tracking-[0.34em] text-[#554a3e] uppercase">Scroll &darr;</span>
      </div>
    </Scene>
  );
};
