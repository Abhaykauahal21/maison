"use client";

import { useEffect } from "react";

/**
 * Pauses every CSS animation inside a top-level block of the page while that block is well off screen
 * (see the [data-offscreen] rule in globals.css). The site has dozens of endless decorative loops
 * (petals, motes, glows, sweeps...); without this they all keep ticking and repainting for the whole
 * scroll even though only one section is in view at a time.
 */
export function OffscreenPause() {
  useEffect(() => {
    const root = document.querySelector("main");
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          (e.target as HTMLElement).toggleAttribute("data-offscreen", !e.isIntersecting);
        }
      },
      { rootMargin: "300px 0px 300px 0px" }
    );

    const watch = () => {
      Array.from(root.children).forEach((el) => {
        if (el instanceof HTMLElement && el.tagName !== "NAV" && el.tagName !== "HEADER") io.observe(el);
      });
    };
    watch();

    // the gate renders its wrapper after hydration; pick up late children too
    const mo = new MutationObserver(watch);
    mo.observe(root, { childList: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return null;
}
