/**
 * Helpers for scroll-scrubbed sections.
 *
 * Reading an element's position right after writing another element's style forces the browser
 * to recalculate styles / layout again for every element. `makeTops` reads every position in ONE
 * pass first (a single recalculation), so the writes that follow never trigger another.
 */
export function makeTops() {
  const tops = new Map<Element, number>();
  return {
    /** Read the top edge of every given element before anything is written. */
    read(...lists: (Element | null | undefined)[][]) {
      tops.clear();
      for (const list of lists) {
        for (const el of list) if (el) tops.set(el, el.getBoundingClientRect().top);
      }
    },
    top(el: Element) {
      return tops.get(el) ?? el.getBoundingClientRect().top;
    },
  };
}

/** True while a box is within `buffer` viewport-heights of the screen (used to skip offscreen work). */
export const nearViewport = (r: DOMRect, vh: number, buffer = 1) =>
  r.width > 0 && r.bottom > -vh * buffer && r.top < vh * (1 + buffer);
