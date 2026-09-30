import type Lenis from "lenis";

let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const getLenis = () => instance;

/** Smooth-scroll to an element or a Y offset. Uses Lenis when it is running, native otherwise. */
export const smoothScrollTo = (target: HTMLElement | number | null | undefined, duration = 1.4) => {
  if (target === null || target === undefined) return;
  if (instance) {
    instance.scrollTo(target, { duration });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
};

/** Nudge the page by `px` (used for the small momentum push when a pinned section lets go). */
export const smoothScrollBy = (px: number, duration = 0.9) => {
  if (instance) {
    instance.scrollTo(window.scrollY + px, { duration });
    return;
  }
  window.scrollBy({ top: px, behavior: "smooth" });
};
