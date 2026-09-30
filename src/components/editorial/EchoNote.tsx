"use client";

import React, { useEffect, useRef, useState } from "react";

const PETALS = Array.from({ length: 9 }, (_, i) => (i * 360) / 9);
const LINES = ["A whisper", "before", "every dream."];

/** One dried chamomile: cream petals around a golden, slightly browned heart. It blooms open. */
const Chamomile: React.FC<{ x: number; y: number; s: number; r: number; delay: number }> = ({
  x,
  y,
  s,
  r,
  delay,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <g className="echo-anim echo-bloom" style={{ animationDelay: `${delay}s` }}>
      {PETALS.map((a) => (
        <ellipse
          key={a}
          cx="0"
          cy="-9"
          rx="3.4"
          ry="8"
          fill="#f4ecdc"
          stroke="#cdb894"
          strokeWidth="0.4"
          transform={`rotate(${a})`}
        />
      ))}
      <circle r="4.6" fill="#d9a441" />
      <circle r="4.6" fill="none" stroke="#8a5a1f" strokeWidth="0.6" opacity="0.55" />
      <circle cx="-1" cy="-1" r="1.5" fill="#f0c766" opacity="0.8" />
    </g>
  </g>
);

const STEMS: { d: string; w: number; delay: number }[] = [
  { d: "M2 236 C30 190 62 140 96 66", w: 2.2, delay: 0.5 },
  { d: "M46 168 C60 150 70 128 62 96", w: 1.6, delay: 1.0 },
  { d: "M70 120 C92 112 112 96 124 76", w: 1.5, delay: 1.1 },
  { d: "M84 92 C78 74 70 60 54 52", w: 1.4, delay: 1.2 },
];

/**
 * The torn note that used to be baked into echo-bg.png: a sprig of dried flowers laid across a
 * slip of paper with a handwritten line. When it scrolls into view the slip drops in, the line is
 * written, the stems draw, the flowers bloom and the sprig then sways gently. Decorative only.
 */
export const EchoNote: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-in={inView}
      className="echo-note pointer-events-none absolute top-[7%] left-[0.6%] z-[12] w-[14.5%] select-none"
      aria-hidden="true"
    >
      {/* Paper slip */}
      <div className="echo-anim echo-note-drop ml-[14%] w-[82%]">
        <div
          className="relative flex aspect-[250/400] w-full items-center justify-center"
          style={{
            transform: "rotate(7deg)",
            background:
              "radial-gradient(120% 90% at 40% 30%, #f3e8d3 0%, #ead9bb 70%, #dcc8a3 100%)",
            clipPath:
              "polygon(0 2%, 6% 0, 14% 1.5%, 30% 0, 52% 1.2%, 74% 0, 92% 1.5%, 100% 0, 99% 30%, 100% 62%, 98% 100%, 70% 98.5%, 40% 100%, 12% 98.8%, 0 100%, 1.5% 60%, 0 28%)",
          }}
        >
          <p
            className="font-allura allura-regular font-script font-cursive -rotate-[8deg] pt-[18%] pr-[6%] text-center leading-[1.15] tracking-wide text-[#2a2118]"
            style={{ fontSize: "clamp(16px, 1.95vw, 34px)" }}
          >
            {LINES.map((line, i) => (
              <span
                key={line}
                className="echo-anim echo-ink block"
                style={{ animationDelay: `${1.0 + i * 0.6}s` }}
              >
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Dried flower sprig across the top-left corner of the slip */}
      <div className="echo-anim echo-sway absolute -top-[6%] -left-[2%] w-[78%]">
        <svg
          viewBox="0 0 160 240"
          className="h-auto w-full overflow-visible"
          style={{ filter: "drop-shadow(0 3px 4px rgba(40,25,10,0.3))" }}
        >
          <g fill="none" stroke="#3f2f20" strokeLinecap="round">
            {STEMS.map((st) => (
              <path
                key={st.d}
                d={st.d}
                pathLength={1}
                strokeWidth={st.w}
                className="echo-anim echo-stem"
                style={{ animationDelay: `${st.delay}s` }}
              />
            ))}
          </g>
          <Chamomile x={96} y={58} s={1.15} r={10} delay={1.5} />
          <Chamomile x={56} y={84} s={0.95} r={-20} delay={1.7} />
          <Chamomile x={126} y={68} s={0.85} r={32} delay={1.9} />
          <Chamomile x={52} y={44} s={0.8} r={5} delay={2.1} />
          <Chamomile x={80} y={22} s={0.7} r={-12} delay={2.3} />
        </svg>
      </div>
    </div>
  );
};
