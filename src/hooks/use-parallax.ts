"use client";

import { useEffect, useRef } from "react";

interface ParallaxItem {
  el: HTMLElement;
  speed: number;
  max: number;
}

const items = new Set<ParallaxItem>();
let rafId = 0;
let enabled = false;
let listening = false;

const shouldEnable = () =>
  window.innerWidth >= 768 &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const update = () => {
  rafId = 0;
  const vh = window.innerHeight;

  items.forEach(({ el, speed, max }) => {
    if (!enabled) {
      el.style.transform = "";
      return;
    }
    // Measure the (untransformed) parent so our own transform never feeds back.
    // getBoundingClientRect stays correct while EditorialSection freezes the body.
    const parent = el.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    if (rect.bottom < -300 || rect.top > vh + 300) return;

    const offset = rect.top + rect.height / 2 - vh / 2;
    const y = Math.max(-max, Math.min(max, -offset * speed));
    el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
  });
};

const schedule = () => {
  if (!rafId) rafId = requestAnimationFrame(update);
};

const onResize = () => {
  enabled = shouldEnable();
  schedule();
};

const startListening = () => {
  if (listening) return;
  listening = true;
  enabled = shouldEnable();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", onResize);
};

const stopListening = () => {
  if (!listening || items.size > 0) return;
  listening = false;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", onResize);
};

/**
 * Scroll parallax for a decorative element. Shifts it vertically relative to its
 * parent based on where the parent sits in the viewport.
 * speed > 0 lags behind the page, speed < 0 moves ahead of it. `max` caps the shift in px.
 * Desktop/tablet only (>= 768px) and disabled for prefers-reduced-motion.
 * Put the ref on an element that has no transform of its own.
 */
export function useParallax<T extends HTMLElement>(speed = 0.08, max = 40) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const item: ParallaxItem = { el, speed, max };
    items.add(item);
    startListening();
    schedule();

    return () => {
      items.delete(item);
      el.style.transform = "";
      stopListening();
    };
  }, [speed, max]);

  return ref;
}
