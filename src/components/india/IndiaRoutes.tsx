"use client";

import React, { useEffect, useRef, useState } from "react";

// Pin positions in the 1853 x 849 coordinate space of /images/India-web.webp
// (centre of each map-pin head). If the artwork changes, update these.
const PINS = [
  { x: 796, y: 175 }, // 0
  { x: 845, y: 241 }, // 1
  { x: 888, y: 275 }, // 2
  { x: 798, y: 297 }, // 3  NCR (hub)
  { x: 759, y: 337 }, // 4
  { x: 980, y: 331 }, // 5
  { x: 705, y: 416 }, // 6
  { x: 724, y: 502 }, // 7
  { x: 887, y: 545 }, // 8
  { x: 784, y: 612 }, // 9
];

const HUB = 3;

// [from, to]: spokes out of the NCR hub, then a chain down the map
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

// Scroll choreography (0..1 = how far the map has travelled up the screen)
const STEP = 0.075; // offset between routes
const DUR = 0.3; // share of the scroll each route takes to draw
const LIVE_ON = 0.985; // fully connected: couriers + pulses switch on
const LIVE_OFF = 0.9;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};

const curve = (a: { x: number; y: number }, b: { x: number; y: number }, i: number) => {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const bulge = len * 0.22 * (i % 2 === 0 ? 1 : -1);
  const cx = mx + (-dy / len) * bulge;
  const cy = my + (dx / len) * bulge;
  return `M ${a.x} ${a.y} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x} ${b.y}`;
};

// First route that touches each pin (that route's arrival lights the pin)
const FIRST_EDGE = PINS.map((_, i) => Math.max(0, EDGES.findIndex(([a, b]) => a === i || b === i)));

export interface IndiaRoutesProps {
  className?: string;
}

/**
 * Scroll-driven connectivity overlay for the India map (plays forward AND backward):
 *  - a ripple spreads out of the NCR hub, where the stories live today
 *  - the routes are drawn by the scroll, one after another, each with a glowing head at its tip
 *  - every pin lights a ring the moment its route arrives
 *  - once the whole map is connected, couriers start running and the pins pulse
 * One rAF per scroll event, only while the map is near the viewport.
 */
export const IndiaRoutes: React.FC<IndiaRoutesProps> = ({ className = "" }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const masks = Array.from(svg.querySelectorAll<SVGPathElement>("[data-mask]"));
    const routes = Array.from(svg.querySelectorAll<SVGPathElement>("[data-route]"));
    const heads = Array.from(svg.querySelectorAll<SVGGElement>("[data-head]"));
    const rings = Array.from(svg.querySelectorAll<SVGCircleElement>("[data-ring]"));
    const waves = Array.from(svg.querySelectorAll<SVGCircleElement>("[data-wave]"));
    const label = svg.querySelector<SVGTextElement>("[data-label]");
    const lens = routes.map((r) => r.getTotalLength());
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let liveNow = false;

    const apply = (p: number) => {
      const edgeE: number[] = [];
      for (let i = 0; i < EDGES.length; i++) {
        const e = smooth((p - i * STEP) / DUR);
        edgeE.push(e);
        masks[i].style.strokeDashoffset = (1 - e).toFixed(4);
        // glowing head riding the tip of the route while it is being drawn
        const pt = routes[i].getPointAtLength(e * lens[i]);
        heads[i].setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
        heads[i].style.opacity =
          e > 0.01 && e < 0.99 ? Math.min(1, Math.sin(e * Math.PI) * 2.2).toFixed(2) : "0";
      }
      rings.forEach((ring, i) => {
        const e = smooth((edgeE[FIRST_EDGE[i]] - 0.72) / 0.28);
        ring.style.opacity = (e * 0.9).toFixed(3);
        ring.style.transform = `scale(${(0.3 + 0.7 * e).toFixed(3)})`;
      });
      waves.forEach((w, i) => {
        const q = clamp01((p - i * 0.1) / 0.5);
        w.setAttribute("r", (24 + q * 860).toFixed(1));
        w.style.opacity = q > 0 && q < 1 ? ((1 - q) * 0.5).toFixed(3) : "0";
      });
      if (label) label.style.opacity = smooth((p - 0.03) / 0.1).toFixed(3);

      const nowLive = !reduce && (liveNow ? p > LIVE_OFF : p > LIVE_ON);
      if (nowLive !== liveNow) {
        liveNow = nowLive;
        setLive(nowLive);
      }
    };

    if (reduce) {
      apply(1);
      return;
    }

    // The scroll sets a target; the drawing eases toward it so it glides instead of snapping
    let target = 0;
    let cur = 0;
    const tick = () => {
      cur += (target - cur) * 0.075;
      if (Math.abs(target - cur) < 0.0005) {
        cur = target;
        raf = 0;
      } else {
        raf = requestAnimationFrame(tick);
      }
      apply(cur);
    };
    const update = () => {
      const vh = window.innerHeight;
      const r = svg.getBoundingClientRect();
      // hidden (phone layout) or far off-screen: nothing to do
      if (r.width === 0 || r.bottom < -150 || r.top > vh + 150) return;
      // 0 as the map's top edge rises past 95% of the screen, 1 when the map's top reaches the
      // top of the screen (the whole time the map is on screen)
      target = clamp01((0.95 * vh - r.top) / (0.95 * vh + r.height * 0.1));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onScroll = update;

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
    <svg
      ref={svgRef}
      viewBox="0 0 1853 849"
      className={`pointer-events-none absolute inset-0 z-10 h-full w-full ${className}`}
      aria-hidden="true"
    >
      <defs>
        {EDGES.map(([from, to], i) => (
          <mask
            key={`m-${i}`}
            id={`india-route-mask-${i}`}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1853"
            height="849"
          >
            <path
              data-mask
              d={curve(PINS[from], PINS[to], i)}
              fill="none"
              stroke="white"
              strokeWidth="8"
              pathLength={1}
              style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
            />
          </mask>
        ))}
      </defs>

      {/* Ripple spreading out of the NCR hub */}
      {[0, 1].map((i) => (
        <circle
          key={`w-${i}`}
          data-wave
          cx={PINS[HUB].x}
          cy={PINS[HUB].y}
          r="24"
          fill="none"
          stroke="#b8862d"
          strokeWidth="2.2"
          style={{ opacity: 0 }}
        />
      ))}

      {/* Dashed routes, revealed by the scroll through their masks */}
      {EDGES.map(([from, to], i) => (
        <path
          key={`r-${i}`}
          data-route
          d={curve(PINS[from], PINS[to], i)}
          fill="none"
          stroke="#5c3d1e"
          strokeOpacity="0.78"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="2 9"
          mask={`url(#india-route-mask-${i})`}
        />
      ))}

      {/* Glowing head at the tip of each route while it is drawn */}
      {EDGES.map((_, i) => (
        <g key={`h-${i}`} data-head style={{ opacity: 0 }}>
          <circle r="11" fill="#e6b450" opacity="0.28" />
          <circle r="4.6" fill="#c9922f" />
        </g>
      ))}

      {/* A ring lights on each pin as its first route arrives */}
      {PINS.map((p, i) => (
        <circle
          key={`p-${i}`}
          data-ring
          cx={p.x}
          cy={p.y}
          r="13"
          fill="none"
          stroke="#b8862d"
          strokeWidth="1.8"
          style={{ opacity: 0, transformBox: "fill-box", transformOrigin: "center" }}
        />
      ))}

      {/* Fully connected: couriers run along every route, pins pulse */}
      {live && (
        <g className="india-compass-fade">
          {EDGES.map(([from, to], i) => (
            <circle key={`d-${i}`} r="4.5" fill="#c9922f" opacity="0">
              <animateMotion
                dur="3.4s"
                begin={`${i * 0.22}s`}
                repeatCount="indefinite"
                path={curve(PINS[from], PINS[to], i)}
                calcMode="spline"
                keyTimes="0;1"
                keySplines="0.45 0 0.55 1"
              />
              <animate
                attributeName="opacity"
                values="0;0.95;0.95;0"
                keyTimes="0;0.12;0.85;1"
                dur="3.4s"
                begin={`${i * 0.22}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
          {PINS.map((p, i) => (
            <circle
              key={`pp-${i}`}
              cx={p.x}
              cy={p.y}
              r="13"
              fill="none"
              stroke="#b8862d"
              strokeWidth="1.6"
              className="india-pin-pulse"
              style={{ animationDelay: `${(i % 4) * 0.35}s` }}
            />
          ))}
        </g>
      )}

      {/* Hub label */}
      <text
        data-label
        x={PINS[HUB].x - 24}
        y={PINS[HUB].y + 6}
        textAnchor="end"
        className="font-allura"
        fontSize="34"
        fill="#3a2a1a"
        style={{ opacity: 0 }}
      >
        NCR
      </text>
    </svg>
  );
};

/** Small hand-drawn compass rose. Mount when in view; it draws itself, then its needle sways. */
export const IndiaCompass: React.FC<{ className?: string }> = ({ className = "" }) => {
  const ticks = Array.from({ length: 16 }, (_, i) => i);
  return (
    <svg viewBox="0 0 120 120" className={`pointer-events-none ${className}`} aria-hidden="true">
      <g fill="none" stroke="#5c3d1e" strokeLinecap="round">
        <circle
          cx="60"
          cy="60"
          r="52"
          strokeWidth="1.4"
          pathLength={1}
          className="india-compass-draw"
          style={{ animationDelay: "1.2s" }}
        />
        <circle
          cx="60"
          cy="60"
          r="44"
          strokeWidth="0.8"
          strokeDasharray="1 4"
          className="india-compass-fade"
          style={{ animationDelay: "1.8s" }}
        />
        {ticks.map((i) => {
          const a = (i * 22.5 * Math.PI) / 180;
          const r1 = i % 2 === 0 ? 46 : 49;
          return (
            <line
              key={i}
              x1={60 + Math.sin(a) * r1}
              y1={60 - Math.cos(a) * r1}
              x2={60 + Math.sin(a) * 52}
              y2={60 - Math.cos(a) * 52}
              strokeWidth="1"
              className="india-compass-fade"
              style={{ animationDelay: `${2 + i * 0.05}s` }}
            />
          );
        })}
        <g className="india-compass-needle">
          <path
            d="M60 12 L66 60 L60 108 L54 60 Z"
            fill="#5c3d1e"
            fillOpacity="0.16"
            strokeWidth="1.1"
            pathLength={1}
            className="india-compass-draw"
            style={{ animationDelay: "1.6s" }}
          />
          <path
            d="M12 60 L60 54 L108 60 L60 66 Z"
            fill="#5c3d1e"
            fillOpacity="0.1"
            strokeWidth="1"
            pathLength={1}
            className="india-compass-draw"
            style={{ animationDelay: "1.9s" }}
          />
        </g>
      </g>
      <text
        x="60"
        y="9"
        textAnchor="middle"
        fontSize="10"
        fill="#3a2a1a"
        className="india-compass-fade"
        style={{ animationDelay: "2.6s", fontFamily: "serif" }}
      >
        N
      </text>
    </svg>
  );
};
