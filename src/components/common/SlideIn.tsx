"use client";

import React, { useEffect, useRef, useState } from "react";

type From = "left" | "right" | "up" | "down";

export interface SlideInProps {
  children: React.ReactNode;
  /** Side the content flies in from. */
  from?: From;
  /** Travel distance, any CSS length ("10vw", "120px"). Scales with the screen by default. */
  distance?: string;
  /** Delay before the move starts, in ms. */
  delay?: number;
  /** Move duration in ms. */
  duration?: number;
  /** Extra tilt (deg) the element straightens out of while it arrives. */
  rotate?: number;
  /** Start slightly blurred and sharpen on arrival (a soft "motion" feel). */
  blur?: boolean;
  className?: string;
}

const AXIS: Record<From, [number, number]> = {
  left: [-1, 0],
  right: [1, 0],
  up: [0, -1],
  down: [0, 1],
};

/**
 * Wraps content that should fly in from a side when it scrolls into view.
 * Uses its own IntersectionObserver, so it works anywhere without shared state.
 * Respects prefers-reduced-motion (content is simply shown).
 */
export const SlideIn: React.FC<SlideInProps> = ({
  children,
  from = "left",
  distance = "10vw",
  delay = 0,
  duration = 1400,
  rotate = 0,
  blur = false,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }

    // Observe the parent, not the element: once translated off-screen (or clipped by an
    // overflow ancestor) the element itself would never report as intersecting.
    const target = el.parentElement ?? el;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  const [ax, ay] = AXIS[from];
  const tilt = rotate ? ` rotate(${ax !== 0 ? ax * rotate : rotate}deg)` : "";
  const hidden = `translate3d(calc(${ax} * ${distance}), calc(${ay} * ${distance}), 0)${tilt}`;

  return (
    <div
      ref={ref}
      className={`will-change-transform ${className}`}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translate3d(0, 0, 0) rotate(0deg)" : hidden,
        filter: blur ? (shown ? "blur(0px)" : "blur(6px)") : undefined,
        transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity ${Math.round(
          duration * 0.7
        )}ms ease-out ${delay}ms${blur ? `, filter ${Math.round(duration * 0.7)}ms ease-out ${delay}ms` : ""}`,
      }}
    >
      {children}
    </div>
  );
};
