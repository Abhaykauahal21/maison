"use client";

import React, { useId } from "react";

export type LockPhase = "locked" | "key" | "open";

const SPARKS = [
  { x: 14, y: 70, d: 0 },
  { x: 150, y: 58, d: 0.8 },
  { x: 144, y: 168, d: 1.5 },
  { x: 10, y: 150, d: 0.4 },
  { x: 80, y: 8, d: 1.1 },
];

// Gold dust that flies out of the keyhole when the lock opens
const BURST = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2 + (i % 2) * 0.2;
  const r = 70 + (i % 3) * 22;
  return { dx: Math.cos(a) * r, dy: Math.sin(a) * r - 20, s: 2 + (i % 3) * 0.8 };
});

/**
 * Animated brass padlock.
 *  locked: rattles now and then while the keyhole glows
 *  key:    a brass key slides into the keyhole and the lock trembles
 *  open:   the key turns, the shackle lifts and swings free, gold dust bursts out
 * (Animations live in globals.css under .gate-lock.)
 */
export const StoryLock: React.FC<{ phase?: LockPhase; className?: string; label?: string }> = ({
  phase = "locked",
  className = "",
  label,
}) => {
  const uid = useId().replace(/:/g, "");
  const gold = `gold${uid}`;
  const steel = `steel${uid}`;
  const glow = `glow${uid}`;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 160 230"
      className={`gate-lock is-${phase} ${className}`}
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6dc95" />
          <stop offset="0.5" stopColor="#caa24d" />
          <stop offset="1" stopColor="#8a6a28" />
        </linearGradient>
        <linearGradient id={steel} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6c757d" />
          <stop offset="0.45" stopColor="#f4f6f8" />
          <stop offset="1" stopColor="#8a939b" />
        </linearGradient>
        <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd37a" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#f0a93c" stopOpacity="0.4" />
          <stop offset="1" stopColor="#f0a93c" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* floor shadow */}
      <ellipse cx="80" cy="218" rx="52" ry="6" fill="#1c1815" opacity="0.22" />

      <g className="gate-all">
        {/* shackle: lifts and swings about its right foot when opened */}
        <g className="gate-shackle">
          <path d="M48 106 V68 C48 28 112 28 112 68 V106" fill="none" stroke="#4d565e" strokeWidth="17" strokeLinecap="round" />
          <path d="M48 106 V68 C48 28 112 28 112 68 V106" fill="none" stroke={`url(#${steel})`} strokeWidth="12" strokeLinecap="round" />
          <path d="M53 100 V68 C53 36 107 36 107 68" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" />
        </g>

        {/* body */}
        <rect x="22" y="98" width="116" height="108" rx="18" fill={`url(#${gold})`} stroke="#6b4f1a" strokeWidth="2" />
        <rect x="28" y="104" width="104" height="96" rx="13" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.4" />
        <path d="M34 190 C50 178 64 196 80 186 C96 176 110 194 126 182" fill="none" stroke="#7a5a1f" strokeOpacity="0.55" strokeWidth="1.3" />
        {[[34, 110], [126, 110], [34, 194], [126, 194]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" fill="#f6dc95" stroke="#6b4f1a" strokeWidth="0.8" />
        ))}

        {/* engraved text on the lock body */}
        {label && (
          <text
            x="80"
            y="126"
            textAnchor="middle"
            fontSize="9.5"
            fontWeight="700"
            letterSpacing="1.8"
            fill="#4a3411"
            fillOpacity="0.85"
            style={{ fontFamily: "var(--font-sans, sans-serif)", textTransform: "uppercase" }}
          >
            {label}
          </text>
        )}

        {/* keyhole + glow */}
        <circle className="gate-glow" cx="80" cy="146" r="34" fill={`url(#${glow})`} />
        <circle cx="80" cy="140" r="9.5" fill="#2a1d12" />
        <path d="M74.5 144 H85.5 L88 168 H72 Z" fill="#2a1d12" />
        <circle cx="77.5" cy="137.5" r="2.2" fill="#fff" opacity="0.35" />

        {/* the key: slides in, then turns */}
        <g className="gate-key">
          <g fill="none" strokeLinecap="round">
            <line x1="82" y1="143" x2="120" y2="181" stroke="#5a4216" strokeWidth="8" />
            <line x1="82" y1="143" x2="120" y2="181" stroke="#e2bd63" strokeWidth="5" />
            <line x1="94" y1="155" x2="89" y2="160" stroke="#5a4216" strokeWidth="7" />
            <line x1="94" y1="155" x2="89" y2="160" stroke="#e2bd63" strokeWidth="4" />
            <line x1="104" y1="165" x2="99" y2="170" stroke="#5a4216" strokeWidth="7" />
            <line x1="104" y1="165" x2="99" y2="170" stroke="#e2bd63" strokeWidth="4" />
            <circle cx="130" cy="191" r="13" stroke="#5a4216" strokeWidth="8" />
            <circle cx="130" cy="191" r="13" stroke="#e2bd63" strokeWidth="5" />
            <circle cx="130" cy="191" r="4" fill="#5a4216" stroke="none" />
          </g>
        </g>
      </g>

      {/* gold dust bursting out of the keyhole when it opens */}
      {BURST.map((b, i) => (
        <circle
          key={i}
          className="gate-burst-dot"
          cx="80"
          cy="146"
          r={b.s}
          fill="#f0c866"
          style={{ ["--dx" as string]: `${b.dx.toFixed(1)}px`, ["--dy" as string]: `${b.dy.toFixed(1)}px` }}
        />
      ))}

      {/* sparkles */}
      {SPARKS.map((s, i) => (
        <path
          key={i}
          className="gate-spark"
          style={{ animationDelay: `${s.d}s` }}
          transform={`translate(${s.x} ${s.y})`}
          d="M0 -6 L1.6 -1.6 L6 0 L1.6 1.6 L0 6 L-1.6 1.6 L-6 0 L-1.6 -1.6Z"
          fill="#e9bf62"
        />
      ))}
    </svg>
  );
};
