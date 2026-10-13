/** Hand-torn paper edges used across the story pages, as % polygons so they scale with the page. */

export const tornPaperClip = (() => {
  const points: string[] = [];
  const steps = 120;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 100;
    const n =
      (Math.sin(i * 0.91 + 1.2) * 0.5 +
        Math.sin(i * 2.37 + 0.4) * 0.3 +
        Math.sin(i * 5.13 + 2.1) * 0.2 +
        1) /
      2;
    points.push(`${x.toFixed(2)}% ${(2 + n * 11).toFixed(1)}px`);
  }
  for (let i = steps; i >= 0; i--) {
    const x = (i / steps) * 100;
    const n =
      (Math.sin(i * 1.07 + 0.7) * 0.5 +
        Math.sin(i * 2.61 + 1.8) * 0.3 +
        Math.sin(i * 4.73 + 0.3) * 0.2 +
        1) /
      2;
    points.push(`${x.toFixed(2)}% calc(100% - ${(2 + n * 12).toFixed(1)}px)`);
  }
  return `polygon(${points.join(", ")})`;
})();

export const tornBottomPaperClip = (() => {
  const points = ["0 0", "100% 0"];
  const steps = 120;
  for (let i = steps; i >= 0; i--) {
    const x = (i / steps) * 100;
    const n =
      (Math.sin(i * 1.07 + 0.7) * 0.5 +
        Math.sin(i * 2.61 + 1.8) * 0.3 +
        Math.sin(i * 4.73 + 0.3) * 0.2 +
        1) /
      2;
    points.push(`${x.toFixed(2)}% calc(100% - ${(2 + n * 12).toFixed(1)}px)`);
  }
  return `polygon(${points.join(", ")})`;
})();
