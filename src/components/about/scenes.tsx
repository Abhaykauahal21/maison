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
/*  pressed and fitted on a form → its own shape opens like a window onto the woman wearing it */
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
  press: [0.64, 0.7],
  room: [0.68, 0.74],
  fit: [0.69, 0.73],
  tape: [0.74, 0.81],
  hole: [0.855, 0.875],
  zoom: [0.875, 0.985],
} as const;

const MOTES = dust(16, 11);

/** Creases in the cloth after sewing: short, scattered, a little bowed. The iron smooths them away. */
const CREASES = Array.from({ length: 24 }, (_, i) => {
  const y = 64 + ((i * 97) % 430);
  const spread = 30 + y * 0.18;
  const cx = 150 + ((((i * 53) % 100) - 50) / 50) * spread;
  const len = 30 + ((i * 29) % 44);
  const ang = ((((i * 37) % 9) - 4) * 7 * Math.PI) / 180;
  const dx = (Math.cos(ang) * len) / 2;
  const dy = (Math.sin(ang) * len) / 2;
  const bow = (i % 2 ? 1 : -1) * (3 + (i % 3) * 2);
  const q = (v: number) => Math.round(v);
  return `M${q(cx - dx)} ${q(y - dy)} Q${q(cx - (dy / (len / 2)) * bow)} ${q(y + (dx / (len / 2)) * bow)} ${q(cx + dx)} ${q(y + dy)}`;
});
const SPOOL = { x: 560, y: 640 };

const pieceAt = (p: number) => {
  const lift = sm((p - T.lift[0]) / (T.lift[1] - T.lift[0]));
  const place = sm((p - T.place[0]) / (T.place[1] - T.place[0]));
  const fit = sm((p - T.fit[0]) / (T.fit[1] - T.fit[0]));
  return {
    x: HOME.x,
    y: 410 - 34 * lift + 44 * place,
    s: 1.15 + 0.1 * place - 0.3 * fit,
    r: 0,
  };
};

export const StoryScene: React.FC = () => {
  const wide = useMatches("(min-aspect-ratio: 5/4)") !== false;
  const vb = wide ? { x: 0, y: 0, w: 1200, h: 800 } : { x: 420, y: -30, w: 760, h: 900 };

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
  const iron = useRef<SVGGElement | null>(null);
  const pressRect = useRef<SVGRectElement | null>(null);

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

    // the cut-out piece: lifts, is laid down for stitching, then is fitted on a dress form
    const T2 = pieceAt(p);
    piece.current?.setAttribute(
      "transform",
      `translate(${T2.x.toFixed(1)} ${T2.y.toFixed(1)}) rotate(${T2.r.toFixed(2)}) scale(${T2.s.toFixed(4)}) translate(-150 -260)`
    );

    // the iron presses the piece in slow passes, top to bottom, leaning into each stroke
    const ir = iron.current;
    if (ir) {
      const pr = clamp01((p - T.press[0]) / (T.press[1] - T.press[0]));
      const passes = 5;
      const u = pr * passes;
      const k = Math.min(passes - 1, Math.floor(u));
      const f = u - k;
      const e = sm(f);
      const dir = k % 2 === 0 ? 1 : -1;
      const ix = HOME.x + dir * (-1 + 2 * e) * 98;
      const iy = lerp(215, 640, (k + f) / passes) + (1 - Math.sin(Math.PI * f)) * -10;
      const tilt = dir * Math.sin(Math.PI * f) * 3.5;
      ir.setAttribute("transform", `translate(${ix.toFixed(1)} ${iy.toFixed(1)}) rotate(${tilt.toFixed(2)}) scale(${dir * 1.12} 1.12)`);
      // creases vanish from the top down, following the iron
      const pr2 = pressRect.current;
      if (pr2) {
        const Tp = pieceAt(p);
        const ly = (iy - Tp.y) / Tp.s + 260;
        const y0 = p >= T.press[1] ? 520 : p <= T.press[0] ? 0 : clamp01((ly - 18) / 520) * 520;
        pr2.setAttribute("y", y0.toFixed(1));
        pr2.setAttribute("height", Math.max(0, 520 - y0).toFixed(1));
      }
    }

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
          <linearGradient id="st-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a2a36" />
            <stop offset="1" stopColor="#2b1820" />
          </linearGradient>
          <linearGradient id="st-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8c6340" />
            <stop offset="1" stopColor="#4d3220" />
          </linearGradient>
          <linearGradient id="st-shaft" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffe9b8" stopOpacity="0" />
            <stop offset="0.5" stopColor="#ffe9b8" stopOpacity="0.5" />
            <stop offset="1" stopColor="#ffe9b8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="st-beam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.6" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="st-metal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6f8fa" />
            <stop offset="0.45" stopColor="#bfc5cb" />
            <stop offset="1" stopColor="#7b828a" />
          </linearGradient>
          <linearGradient id="st-iron-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5b5b69" />
            <stop offset="0.5" stopColor="#2c2c36" />
            <stop offset="1" stopColor="#17171d" />
          </linearGradient>
          <linearGradient id="st-brass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f6dd96" />
            <stop offset="0.55" stopColor="#c9922f" />
            <stop offset="1" stopColor="#8a5f18" />
          </linearGradient>
          <linearGradient id="st-wood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c58a4e" />
            <stop offset="1" stopColor="#6b3f1c" />
          </linearGradient>
          <radialGradient id="st-heat">
            <stop offset="0" stopColor="#ffb26b" stopOpacity="0.75" />
            <stop offset="0.6" stopColor="#ff7a4a" stopOpacity="0.22" />
            <stop offset="1" stopColor="#ff7a4a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="st-steam">
            <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
            <stop offset="0.6" stopColor="#fff" stopOpacity="0.3" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="st-press" maskUnits="userSpaceOnUse" x="0" y="-10" width="300" height="540">
            <rect ref={pressRect} x="0" y="0" width="300" height="520" fill="white" />
          </mask>
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
          {/* the measuring tape is wound on, in the piece's own coordinates */}
          {[
            ["M110 176 Q150 194 190 176 Q204 182 198 216", T.tape[0], T.tape[0] + 0.035],
            ["M114 104 Q150 120 186 104 Q198 110 192 142", T.tape[0] + 0.035, T.tape[1]],
          ].map(([d, a0, b0], i) => (
            <mask key={i} id={`st-tape-${i}`} maskUnits="userSpaceOnUse" x="60" y="60" width="180" height="180">
              <path d={d as string} stroke="white" strokeWidth="14" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: `calc(1 - ${ramp(a0 as number, b0 as number)})` }} />
            </mask>
          ))}
        </defs>

        <g mask="url(#st-window)">
          {/* ===== the rooms: paper desk → dark table → the fitting room ===== */}
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

          {/* the fitting room: plum walls, a wooden floor, warm light falling through a window */}
          <g style={{ opacity: ramp(T.room[0], T.room[1]) }}>
            <rect x={BIG.x} y={BIG.y} width={BIG.w} height={BIG.h} fill="url(#st-wall)" />
            {/* framed sketches on the wall, a little behind everything */}
            <g style={{ transform: "translate3d(calc(var(--p) * -50px), 0, 0)" }}>
              {[
                [vb.x + vb.w - 190, 130, 0.5],
                [vb.x + vb.w - 120, 380, 0.4],
                [vb.x + 60, 90, 0.4],
              ].map(([fx, fy, fs], i) => (
                <g key={i} transform={`translate(${fx} ${fy})`}>
                  <rect width={150 * (fs as number) * 2} height={190 * (fs as number) * 2} fill="#6b4a2c" />
                  <rect x="6" y="6" width={150 * (fs as number) * 2 - 12} height={190 * (fs as number) * 2 - 12} fill="#efe3c8" />
                  <g transform={`translate(${(150 * (fs as number) * 2) / 2 - 150 * (fs as number) * 0.5 * 0.6} 14) scale(${(fs as number) * 0.6})`}>
                    <path d={GOWN} stroke="#6a5a45" strokeWidth="3" strokeLinejoin="round" />
                  </g>
                </g>
              ))}
            </g>
            {/* floor and skirting */}
            <rect x={BIG.x} y="700" width={BIG.w} height={BIG.h} fill="url(#st-floor)" />
            <rect x={BIG.x} y="690" width={BIG.w} height="12" fill="#c7ad8a" />
            <path d={Array.from({ length: 40 }, (_, i) => `M${-600 + i * 90} 702 L${-900 + i * 140} 1000`).join(" ")} stroke="#2c1b10" strokeOpacity="0.35" strokeWidth="2" />
            {/* light shafts from the window, sliding slowly as you scroll */}
            <g style={{ mixBlendMode: "screen", transform: "translate3d(calc(var(--p) * -160px), 0, 0)" }}>
              <polygon points="120,-200 260,-200 760,900 560,900" fill="url(#st-shaft)" opacity="0.7" />
              <polygon points="360,-200 440,-200 900,900 800,900" fill="url(#st-shaft)" opacity="0.5" />
              <polygon points="-60,-200 40,-200 420,900 300,900" fill="url(#st-shaft)" opacity="0.4" />
            </g>
            {/* dust turning in the light */}
            <g style={{ transform: "translate3d(calc(var(--p) * -90px), calc(var(--p) * -40px), 0)" }}>
              {MOTES.map((m, i) => (
                <circle
                  key={i}
                  className="ab-twinkle"
                  cx={vb.x + (m.x / 100) * vb.w}
                  cy={vb.y + (m.y / 100) * vb.h * 0.9}
                  r={m.s * 0.9}
                  fill="#ffefc8"
                  style={{ opacity: m.o, animationDelay: `-${m.d}s` }}
                />
              ))}
            </g>
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
          <g style={{ opacity: `calc(${ramp(T.paperOut[0] + 0.01, T.paperOut[1])} * (1 - ${ramp(T.room[0], T.room[1] + 0.02)}))` }}>
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

          {/* ===== the piece: cut, laid down, stitched, pressed, fitted ===== */}
          <g ref={piece} style={{ opacity: ramp(T.paperOut[0] + 0.02, T.paperOut[1]) }}>
            {/* the dress form it ends up on */}
            <g style={{ opacity: ramp(T.fit[0] - 0.01, T.fit[1]) }}>
              <ellipse cx="150" cy="612" rx="92" ry="13" fill="#000" opacity="0.4" style={{ filter: "blur(6px)" }} />
              <path d="M150 504 V604" stroke="#6b5036" strokeWidth="7" strokeLinecap="round" />
              <path d="M150 504 V604" stroke="#b9996b" strokeWidth="2" strokeLinecap="round" />
              <ellipse cx="150" cy="606" rx="62" ry="10" fill="#5a4129" />
              <ellipse cx="150" cy="603" rx="62" ry="10" fill="#7b5b3b" />
              <path d="M142 34 V-4 Q150 -12 158 -4 V34" fill="#c9b48e" stroke="#a8946f" strokeWidth="1" />
              <circle cx="150" cy="-16" r="5.5" fill="#9a7a45" />
              <path d="M102 46 Q150 28 198 46 Q208 82 194 112 Q178 142 176 178 L124 178 Q122 142 106 112 Q92 82 102 46 Z" fill="#d9c7a6" stroke="#a8946f" strokeWidth="1.2" />
            </g>

            <path d={GOWN} fill="#000" style={{ filter: "blur(5px)", opacity: `calc(${ramp(T.lift[0], T.lift[1])} * 0.5 * (1 - ${ramp(T.fit[0], T.fit[1])}))`, transform: "translate(8px, 22px)" }} />
            <g clipPath="url(#st-clip)">
              <rect x="40" y="0" width="220" height="530" fill="url(#st-weave)" />
              <rect x="40" y="0" width="220" height="530" fill="url(#st-sheen)" />
              {/* creases from the sewing; the iron smooths them away */}
              <g mask="url(#st-press)" style={{ opacity: `calc(${ramp(0.575, 0.625)} * (1 - ${ramp(T.fit[0], T.fit[1])}))` }}>
                {CREASES.map((d, i) => (
                  <g key={i}>
                    <path d={d} stroke="#2a0610" strokeOpacity="0.3" strokeWidth="2.2" strokeLinecap="round" transform="translate(1.2 1.8)" />
                    <path d={d} stroke="#ffb3c0" strokeOpacity="0.26" strokeWidth="1.2" strokeLinecap="round" />
                  </g>
                ))}
              </g>
              {/* held up to the light: a beam crosses the cloth */}
              <g style={{ opacity: win(0.74, 0.86, 0.02) }}>
                <rect x="-70" y="-30" width="90" height="580" fill="url(#st-beam)" style={{ transform: `translate3d(calc(${ramp(0.74, 0.86)} * 400px), 0, 0) skewX(-18deg)` }} />
              </g>
            </g>
            <path d={GOWN} stroke="#f1b9b9" strokeOpacity="0.5" strokeWidth="0.8" />
            {SEAMS.map((d, i) => (
              <g key={i} mask={`url(#st-seam-${i})`}>
                <path ref={(el) => { seams.current[i] = el; }} d={d} stroke="#e9c77b" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="7 6" />
                <path d={d} stroke="#fff3cf" strokeOpacity="0.7" strokeWidth="0.8" strokeLinecap="round" strokeDasharray="7 6" />
              </g>
            ))}

            {/* fitting: chalk marks, the tape round the waist and bust, pins, a label */}
            <g stroke="#efe3c8" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="3 4" style={{ opacity: ramp(0.8, 0.83) }}>
              <path d="M118 190 L150 198 L182 190" />
              <path d="M122 120 L150 126 L178 120" />
            </g>
            {["M110 176 Q150 194 190 176 Q204 182 198 216", "M114 104 Q150 120 186 104 Q198 110 192 142"].map((d, i) => (
              <g key={i} mask={`url(#st-tape-${i})`}>
                <path d={d} stroke="#f3ead2" strokeWidth="7" strokeLinecap="butt" />
                <path d={d} stroke="#2a1d10" strokeOpacity="0.75" strokeWidth="7" strokeDasharray="0.8 4.4" />
                <path d={d} stroke="#c9922f" strokeWidth="1" transform="translate(0 -2.4)" />
              </g>
            ))}
            {[
              [118, 128, -1, "#e9a3a0"],
              [182, 130, 1, "#e6c98f"],
              [124, 160, -1, "#9cc0e6"],
              [176, 162, 1, "#e9a3a0"],
              [133, 200, -1, "#e6c98f"],
              [167, 202, 1, "#9cc0e6"],
            ].map(([x, y, dir, c], i) => {
              const a = 0.79 + i * 0.007;
              return (
                <g
                  key={i}
                  style={{ opacity: ramp(a, a + 0.008), transform: `translateY(calc((1 - ${ramp(a, a + 0.008)}) * -16px))` }}
                >
                  <path d={`M${x} ${y} l${(dir as number) * 15} -7`} stroke="#d7dbe0" strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx={(x as number) + (dir as number) * 16.5} cy={(y as number) - 7.7} r="3.2" fill={c as string} stroke="#00000033" strokeWidth="0.5" />
                </g>
              );
            })}
            <g style={{ opacity: ramp(0.83, 0.86) }}>
              <path d="M150 22 Q160 30 156 44" stroke="#d1ab5a" strokeWidth="1.3" strokeLinecap="round" />
              <g transform="rotate(8 156 52)">
                <rect x="143" y="44" width="28" height="18" rx="3" fill="#f6ecd8" stroke="#8a6a3b" strokeWidth="1" />
                <text x="157" y="57.5" textAnchor="middle" fill="#8a6a3b" fontSize="12" className="font-allura">M·D</text>
              </g>
            </g>
          </g>

          {/* ===== the iron: a heavy brass-and-steel one, pressing the cloth before it is fitted ===== */}
          <g style={{ opacity: win(T.press[0] - 0.005, T.press[1] + 0.005, 0.01) }}>
            <g ref={iron}>
              {/* heat under the soleplate, and its contact shadow */}
              <ellipse cx="4" cy="14" rx="92" ry="26" fill="url(#st-heat)" style={{ mixBlendMode: "screen" }} />
              <ellipse cx="8" cy="24" rx="78" ry="11" fill="#000" opacity="0.5" style={{ filter: "blur(5px)" }} />
              {/* the cord trailing behind */}
              <path d="M-56 -20 q-34 14 -58 -4 t-70 10" stroke="#16161c" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M-56 -21 q-34 14 -58 -4 t-70 10" stroke="#5a5a66" strokeWidth="1" strokeLinecap="round" fill="none" />
              {/* soleplate */}
              <path d="M-64 17 L52 17 Q86 17 72 2 L46 -14 L-64 -14 Z" fill="url(#st-metal)" stroke="#5f666d" strokeWidth="1.4" strokeLinejoin="round" />
              <path d="M-60 11 L50 11 Q72 11 64 3" stroke="#fff" strokeOpacity="0.75" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              {[-40, -22, -4, 14, 32].map((vx) => (
                <ellipse key={vx} cx={vx} cy="3" rx="3.4" ry="1.5" fill="#3d444b" opacity="0.55" />
              ))}
              {/* body */}
              <path d="M-56 -14 Q-60 -50 -16 -56 L30 -50 Q54 -43 48 -14 Z" fill="url(#st-iron-body)" stroke="#0e0e12" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M-44 -36 Q-14 -52 28 -44" stroke="#9a9aae" strokeOpacity="0.65" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M-52 -18 Q-52 -30 -44 -36" stroke="#9a9aae" strokeOpacity="0.4" strokeWidth="1.4" fill="none" strokeLinecap="round" />
              {/* temperature dial and water cap in brass */}
              <circle cx="16" cy="-36" r="8.5" fill="url(#st-brass)" stroke="#7a5412" strokeWidth="1" />
              <circle cx="16" cy="-36" r="3.2" fill="#6b4a14" />
              <path d="M16 -43 V-37" stroke="#2c1b05" strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="-32" cy="-32" r="5" fill="url(#st-brass)" stroke="#7a5412" strokeWidth="0.8" />
              {/* the handle: turned wood on brass posts */}
              <path d="M-40 -48 Q-10 -106 32 -52" stroke="#3a2210" strokeWidth="12" strokeLinecap="round" fill="none" />
              <path d="M-40 -48 Q-10 -106 32 -52" stroke="url(#st-wood)" strokeWidth="9" strokeLinecap="round" fill="none" />
              <path d="M-34 -58 Q-10 -98 22 -62" stroke="#f1c28a" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" fill="none" />
              <circle cx="-40" cy="-47" r="4.2" fill="url(#st-brass)" />
              <circle cx="32" cy="-51" r="4.2" fill="url(#st-brass)" />
              {/* steam leaving the front vents */}
              {[[58, -10, 0, 16], [46, -22, 0.6, 20], [66, -26, 1.2, 14], [52, -34, 1.8, 18]].map(([sx, sy, d, r], i) => (
                <circle key={i} className="ab-steam" cx={sx} cy={sy} r={r} fill="url(#st-steam)" style={{ animationDelay: `-${d}s` }} />
              ))}
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
          <Beat tone="light" a={0.65} b={0.72} script="Pressed, never rushed." text="Steam, a warm iron, and the patience to let the cloth settle." />
          <Beat tone="light" a={0.72} b={0.79} script="Measured twice." text="On the form, the tape goes round again, until the dress fits her, not the pattern." />
          <Beat tone="light" a={0.79} b={0.865} script="Tested, then tested again." text="Pinned, pulled, held up to the light, and sent back to the table if it asks for more." />
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
          ["Fit", 0.66, 0.86],
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
