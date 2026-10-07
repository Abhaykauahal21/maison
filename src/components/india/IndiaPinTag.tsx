"use client";

import React, { useEffect } from "react";

/**
 * Names of the ten map pins, in the same order as the pin coordinates in IndiaRoutes (desktop) and
 * IndiaMobileMap (phone). Edit a name here to rename a pin on both maps.
 */
export const INDIA_PIN_NAMES: { name: string; sub?: string }[] = [
  { name: "Chandigarh" }, // 0
  { name: "Dehradun" }, // 1
  { name: "Lucknow" }, // 2
  { name: "Delhi NCR", sub: "where our stories live today" }, // 3  hub
  { name: "Jaipur" }, // 4
  { name: "Patna" }, // 5
  { name: "Ahmedabad" }, // 6
  { name: "Mumbai" }, // 7
  { name: "Hyderabad" }, // 8
  { name: "Bengaluru" }, // 9
];

interface TagProps {
  x: number;
  y: number;
  name: string;
  sub?: string;
  /** SVG units per CSS pixel: 1 on the desktop map, larger on the phone map (its viewBox is wider than the screen). */
  u?: number;
}

/**
 * A little paper tag that pops out above a pin with the place's name written on it, with a ring bursting
 * out of the pin. SVG only, so it scales with the map it sits on.
 */
export const IndiaPinTag: React.FC<TagProps> = ({ x, y, name, sub, u = 1 }) => {
  const font = 31 * u;
  const subFont = 12.5 * u;
  const padX = 22 * u;
  const w = Math.max(name.length * font * 0.42 + padX * 2, sub ? sub.length * subFont * 0.5 + padX * 2 : 0);
  const h = (sub ? 64 : 48) * u;
  const gap = 30 * u; // clear of the pin head
  const top = y - gap - h;

  return (
    <g pointerEvents="none">
      {/* bursting rings + a warm halo on the pin itself */}
      <circle cx={x} cy={y} r={15 * u} fill="#e6b450" fillOpacity="0.3" className="india-hot" />
      {[0, 0.18].map((d) => (
        <circle
          key={d}
          cx={x}
          cy={y}
          r={15 * u}
          fill="none"
          stroke="#b8862d"
          strokeWidth={2.2 * u}
          className="india-burst"
          style={{ animationDelay: `${d}s` }}
        />
      ))}

      <g className="india-tag" style={{ filter: "drop-shadow(0 6px 8px rgba(40,24,10,0.35))" }}>
        {/* tag body + the little point down to the pin */}
        <path
          d={`M ${x - w / 2 + 8 * u} ${top} H ${x + w / 2 - 8 * u} Q ${x + w / 2} ${top} ${x + w / 2} ${top + 8 * u} V ${top + h - 8 * u} Q ${x + w / 2} ${top + h} ${x + w / 2 - 8 * u} ${top + h} H ${x + 9 * u} L ${x} ${top + h + 11 * u} L ${x - 9 * u} ${top + h} H ${x - w / 2 + 8 * u} Q ${x - w / 2} ${top + h} ${x - w / 2} ${top + h - 8 * u} V ${top + 8 * u} Q ${x - w / 2} ${top} ${x - w / 2 + 8 * u} ${top} Z`}
          fill="#f6ecd5"
          stroke="#8a6a3a"
          strokeWidth={1.5 * u}
          strokeLinejoin="round"
        />
        <path
          d={`M ${x - w / 2 + 6 * u} ${top + 5 * u} H ${x + w / 2 - 6 * u}`}
          stroke="#8a6a3a"
          strokeOpacity="0.35"
          strokeWidth={1 * u}
          strokeDasharray={`${3 * u} ${4 * u}`}
          fill="none"
        />
        <text
          x={x}
          y={top + (sub ? 36 : 33) * u}
          textAnchor="middle"
          className="font-allura india-tag-text"
          fontSize={font}
          fill="#2a1d10"
        >
          {name}
        </text>
        {sub && (
          <text
            x={x}
            y={top + 55 * u}
            textAnchor="middle"
            className="india-tag-text"
            fontSize={subFont}
            letterSpacing={0.6 * u}
            fill="#5a4630"
            style={{ fontFamily: "var(--font-serif), serif", fontStyle: "italic", animationDelay: "0.45s" }}
          >
            {sub}
          </text>
        )}
      </g>
    </g>
  );
};

/** Closes the open tag on Escape, on a press anywhere that is not a pin, or after a few seconds. */
export const useDismissPinTag = (active: number | null, close: () => void, ms = 5500) => {
  useEffect(() => {
    if (active === null) return;
    const t = window.setTimeout(close, ms);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onDown = (e: PointerEvent) => {
      if (!(e.target as Element | null)?.closest?.("[data-pinhit]")) close();
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [active, close, ms]);
};
