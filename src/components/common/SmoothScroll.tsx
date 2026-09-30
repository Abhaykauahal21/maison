"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/smooth-scroll";

/**
 * Site-wide inertial scrolling (Lenis). Mouse wheel and trackpad get the eased glide; touch keeps
 * the native feel. It stays stopped while the intro loader plays (the loader signals it is done
 * with html[data-site-ready]) and is stopped again by sections that pin the page themselves.
 * Anywhere that must scroll on its own (modals) carries data-lenis-prevent.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      autoRaf: true,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      anchors: true, // in-page #links glide too
    });
    setLenis(lenis);

    const root = document.documentElement;
    const syncWithLoader = () => {
      if (root.dataset.siteReady === "true") lenis.start();
      else lenis.stop();
    };
    syncWithLoader();
    const mo = new MutationObserver(syncWithLoader);
    mo.observe(root, { attributes: true, attributeFilter: ["data-site-ready"] });

    return () => {
      mo.disconnect();
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
