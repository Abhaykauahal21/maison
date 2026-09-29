"use client";

import React from "react";

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

const DRAW_START = 1.0; // s after the section comes into view
const DRAW_STEP = 0.22; // s between routes
const DRAW_DURATION = 1.5; // s per route

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

export interface IndiaRoutesProps {
  className?: string;
}

/**
 * Animated connectivity overlay for the India map. Mount it only once the section is in
 * view: the route drawing and the travelling dots start from the moment it mounts.
 */
export const IndiaRoutes: React.FC<IndiaRoutesProps> = ({ className = "" }) => {
  return (
    <svg
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
              d={curve(PINS[from], PINS[to], i)}
              fill="none"
              stroke="white"
              strokeWidth="8"
              pathLength={1}
              className="india-route-draw"
              style={{
                animationDelay: `${DRAW_START + i * DRAW_STEP}s`,
                animationDuration: `${DRAW_DURATION}s`,
              }}
            />
          </mask>
        ))}
      </defs>

      {/* Dashed routes, revealed progressively by their masks */}
      {EDGES.map(([from, to], i) => (
        <path
          key={`r-${i}`}
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

      {/* Light travelling along each route once it is drawn */}
      {EDGES.map(([from, to], i) => {
        const begin = DRAW_START + i * DRAW_STEP + DRAW_DURATION;
        return (
          <circle key={`d-${i}`} r="4.5" fill="#c9922f" opacity="0">
            <animateMotion
              dur="3.4s"
              begin={`${begin}s`}
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
              begin={`${begin}s`}
              repeatCount="indefinite"
            />
          </circle>
        );
      })}

      {/* Pulse rings: each pin "switches on" as its first route arrives */}
      {PINS.map((p, i) => {
        const firstEdge = EDGES.findIndex(([a, b]) => a === i || b === i);
        const on = DRAW_START + Math.max(0, firstEdge) * DRAW_STEP + 0.4;
        return (
          <circle
            key={`p-${i}`}
            cx={p.x}
            cy={p.y}
            r="13"
            fill="none"
            stroke="#b8862d"
            strokeWidth="1.6"
            className="india-pin-pulse"
            style={{ animationDelay: `${on + (i % 4) * 0.35}s` }}
          />
        );
      })}

      {/* Hub label */}
      <text
        x={PINS[HUB].x - 24}
        y={PINS[HUB].y + 6}
        textAnchor="end"
        className="india-hub-label font-allura"
        fontSize="34"
        fill="#3a2a1a"
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
