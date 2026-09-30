"use client";

import React, { useEffect, useRef } from "react";
import { makeTops } from "@/lib/scrub";

export interface FaqDesktopItem {
  id: string;
  question: string;
  answer: string;
}

/**
 * FAQ: desktop / tablet (md+), laid over the torn-paper collage (FAQ-page-web.webp).
 * The questions sit straight on the paper as a numbered index, no panel, no boxes.
 *
 * Scroll-scrubbed (plays forward AND backward):
 *  - eyebrow, the letters of "FAQs" and the poem rise out of their masks
 *  - each question slides in as it reaches the reading line and its hairline is drawn
 *  - the handwritten note is written and its heart draws itself
 *  - a soft band of light crosses the paper as you scroll
 * Accordion: one open at a time. The row gets a gold bar and a gold number, the plus turns to a
 * cross, the answer unfolds and its words settle in one after another.
 */

const STYLES = `
.fd-sheen { mix-blend-mode: soft-light; }
.fd-sheen-band { background: linear-gradient(105deg, transparent 38%, rgba(255,250,235,.45) 50%, transparent 62%); will-change: transform; }
.fd-word { display: inline-block; opacity: 0; animation: fd-word .6s cubic-bezier(.22,1,.36,1) var(--d, 0s) both; }
@keyframes fd-word { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.fd-bar { transform-origin: top; transition: transform .6s cubic-bezier(.22,1,.36,1); }
.fd-btn { position: relative; overflow: hidden; isolation: isolate; }
.fd-btn::before { content: ""; position: absolute; inset: 0; z-index: -1; background: #2b2118; transform: translateX(-101%); transition: transform .55s cubic-bezier(.22,1,.36,1); }
.fd-btn:hover::before, .fd-btn:focus-visible::before { transform: none; }
.fd-btn:hover, .fd-btn:focus-visible { color: #faf6ee; }
@media (prefers-reduced-motion: reduce) { .fd-word { animation: none; opacity: 1; } }
`;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};

/** A line that rises out of its own mask (driven by scroll). */
const Rise: React.FC<{
  lag?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ lag = 0, className = "", style, children }) => (
  <span
    data-s="rise"
    data-lag={lag}
    className={`-mb-[0.14em] block overflow-hidden pb-[0.14em] ${className}`}
    style={style}
  >
    <span data-inner className="block will-change-transform" style={{ transform: "translateY(112%)" }}>
      {children}
    </span>
  </span>
);

export const FaqDesktop: React.FC<{
  items: FaqDesktopItem[];
  openIndex: number | null;
  onToggle: (i: number) => void;
}> = ({ items, openIndex, onToggle }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const q = <T extends Element>(sel: string) => Array.from(root.querySelectorAll<T>(sel));
    const risers = q<HTMLElement>("[data-s='rise']");
    const rows = q<HTMLElement>("[data-s='row']");
    const rules = q<HTMLElement>("[data-s='rule']");
    const inks = q<HTMLElement>("[data-s='ink']");
    const draws = q<SVGPathElement>("[data-s='draw']");
    const fades = q<HTMLElement>("[data-s='fade']");
    const sheen = root.querySelector<HTMLElement>("[data-sheen]");

    let raf = 0;
    const T = makeTops();
    const prog = (el: Element, lag = 0, span = 0.16) => {
      const vh = window.innerHeight;
      return smooth((vh * 0.96 - T.top(el) - lag) / (vh * span));
    };

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const rr = root.getBoundingClientRect();
      if (rr.width === 0 || rr.bottom < -100 || rr.top > vh + 100) return;
      // all reads first (one style/layout pass), then all writes
      T.read(risers, rows, rules, inks, draws, fades);
      const t = clamp01((vh - rr.top) / (vh + rr.height));
      if (sheen) sheen.style.transform = `translate3d(${(-0.5455 * (t * 260 - 80)).toFixed(2)}%, 0, 0)`;

      risers.forEach((el) => {
        const inner = el.querySelector<HTMLElement>("[data-inner]");
        if (!inner) return;
        const e = prog(el, Number(el.dataset.lag || 0));
        inner.style.transform = `translate3d(0, ${((1 - e) * 112).toFixed(1)}%, 0)`;
        inner.style.opacity = String(0.3 + 0.7 * e);
      });
      rows.forEach((el) => {
        const e = prog(el, Number(el.dataset.lag || 0), 0.13);
        el.style.opacity = String(0.2 + 0.8 * e);
        el.style.transform = `translate3d(${((1 - e) * 56).toFixed(1)}px, 0, 0)`;
      });
      rules.forEach((el) => {
        el.style.transform = `scaleX(${prog(el, Number(el.dataset.lag || 0), 0.12).toFixed(3)})`;
      });
      inks.forEach((el) => {
        const e = prog(el, Number(el.dataset.lag || 0), 0.18);
        el.style.clipPath = `inset(-6% ${((1 - e) * 104).toFixed(1)}% -6% 0)`;
      });
      draws.forEach((el) => {
        el.style.strokeDashoffset = String((1 - prog(el, 0, 0.2)).toFixed(3));
      });
      fades.forEach((el) => {
        const e = prog(el, Number(el.dataset.lag || 0), 0.16);
        el.style.opacity = String(0.15 + 0.85 * e);
        el.style.transform = `translate3d(0, ${((1 - e) * 16).toFixed(1)}px, 0)`;
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const ink = "#241a13";

  return (
    <div ref={rootRef} className="pointer-events-auto absolute inset-0 z-20" style={{ color: ink }}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* A band of light crosses the paper with the scroll */}
      <div aria-hidden="true" className="fd-sheen pointer-events-none absolute inset-0 overflow-hidden">
        <div
          data-sheen
          className="fd-sheen-band absolute inset-y-0 left-0 w-[220%]"
          style={{ transform: "translate3d(43.64%, 0, 0)" }}
        />
      </div>

      {/* ================= LEFT: EDITORIAL COLUMN ================= */}
      <div className="absolute top-[15%] left-[9.5%] flex w-[27%] flex-col text-left">
        <div className="flex items-center gap-3 font-sans text-[#605043] uppercase">
          <span
            data-s="rule"
            className="block h-px w-9 origin-left bg-[#8a6a3a]"
            style={{ transform: "scaleX(0)" }}
          />
          <Rise className="leading-[1.5]" style={{ fontSize: "clamp(10px, 0.78vw, 13px)", letterSpacing: "0.26em" }}>
            Questions you may have
          </Rise>
        </div>

        <h2
          aria-label="FAQs"
          className="mt-[0.4vw] flex font-serif leading-[0.95] font-normal tracking-tight"
          style={{ fontSize: "clamp(56px, 7.2vw, 128px)" }}
        >
          {Array.from("FAQs").map((ch, i) => (
            <Rise key={i} lag={i * 22}>
              <span aria-hidden="true" className={ch === "s" ? "text-[#8a6a3a] italic" : ""}>
                {ch}
              </span>
            </Rise>
          ))}
        </h2>

        <p
          className="mt-[1.2vw] font-serif text-[#46392f]"
          style={{ fontSize: "clamp(14px, 1.15vw, 20px)", lineHeight: 1.45 }}
        >
          {[
            "Little questions,",
            "thoughtful answers —",
            "because your journey",
            "with us should feel effortless.",
          ].map((l, i) => (
            <Rise key={l} lag={40 + i * 18}>
              {l}
            </Rise>
          ))}
        </p>

        {/* Handwritten note + heart */}
        <p
          className="font-allura allura-regular font-script font-cursive mt-[2.6vw] origin-bottom-left -rotate-[5deg] leading-[1.14] tracking-wide text-[#413328]"
          style={{ fontSize: "clamp(26px, 2.4vw, 42px)" }}
        >
          {["Still wondering?", "We're here for you"].map((l, i) => (
            <span
              key={l}
              data-s="ink"
              data-lag={i * 30}
              className="block"
              style={{ clipPath: "inset(-6% 104% -6% 0)" }}
            >
              {l}
              {i === 1 && (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#413328"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2 inline-block rotate-6 align-middle"
                  aria-hidden="true"
                >
                  <path
                    data-s="draw"
                    pathLength={1}
                    style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
                    d="M12 21 C10 19, 3.5 13.5, 3.5 8.5 C3.5 5.5, 6 3.5, 9 3.5 C10.8 3.5, 12 4.6, 12 5.5 C12 4.6, 13.2 3.5, 15 3.5 C18 3.5, 20.5 5.5, 20.5 8.5 C20.5 13.5, 14 19, 12 21 Z"
                  />
                </svg>
              )}
            </span>
          ))}
        </p>

        <div data-s="fade" data-lag={20} className="mt-[1.6vw]" style={{ opacity: 0.15 }}>
          <button
            type="button"
            className="fd-btn group inline-flex cursor-pointer items-center gap-6 border border-[#2b2118] bg-transparent px-7 py-3 font-serif font-medium tracking-[0.22em] text-[#2b2118] uppercase transition-transform duration-300 active:scale-[0.98]"
            style={{ fontSize: "clamp(10px, 0.78vw, 13px)" }}
          >
            <span>View all FAQs</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1.5">&rarr;</span>
          </button>
        </div>
      </div>

      {/* ================= RIGHT: THE INDEX ================= */}
      <div className="absolute top-[13.5%] left-[40.5%] w-[44%]">
        {/* index header */}
        <div
          data-s="fade"
          className="mb-[0.6vw] flex items-center justify-between font-serif tracking-[0.26em] text-[#7a6a59] uppercase"
          style={{ fontSize: "clamp(9px, 0.7vw, 12px)", opacity: 0.15 }}
        >
          <span>The index</span>
          <span className="tabular-nums">
            {String((openIndex ?? -1) + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
        </div>

        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          const words = item.answer.split(" ");
          return (
            <div
              key={item.id}
              data-s="row"
              data-lag={idx * 5}
              className="relative will-change-transform"
              style={{ opacity: 0.2 }}
            >
              <span
                data-s="rule"
                data-lag={idx * 5}
                className="block h-px w-full origin-left bg-[#b9a78d]/80"
                style={{ transform: "scaleX(0)" }}
              />

              {/* Gold bar on the open row */}
              <span
                aria-hidden="true"
                className="fd-bar absolute top-0 bottom-0 left-[-2.2%] w-[2px] bg-[#b8862d]"
                style={{ transform: isOpen ? "scaleY(1)" : "scaleY(0)" }}
              />

              <button
                type="button"
                onClick={() => onToggle(idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-desktop-${idx}`}
                id={`faq-question-desktop-${idx}`}
                className="group flex w-full cursor-pointer items-start gap-[1.6vw] text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#8a6a3a]"
                style={{ padding: "clamp(11px, 1.05vw, 18px) 0" }}
              >
                <span
                  className="mt-[0.35em] w-[2.2em] shrink-0 font-serif tracking-[0.18em] tabular-nums transition-colors duration-500"
                  style={{
                    fontSize: "clamp(10px, 0.78vw, 13px)",
                    color: isOpen ? "#b8862d" : "#8b7a66",
                  }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span
                  className="min-w-0 flex-1 font-serif leading-[1.3] transition-all duration-500 group-hover:translate-x-1.5"
                  style={{
                    fontSize: "clamp(15px, 1.4vw, 24px)",
                    color: isOpen ? "#8a5d12" : ink,
                    fontStyle: isOpen ? "italic" : "normal",
                  }}
                >
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-[0.15em] flex shrink-0 items-center justify-center rounded-full border text-[#3e3025] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-[#4a3b2f]/70"
                  style={{
                    width: "clamp(22px, 1.8vw, 30px)",
                    height: "clamp(22px, 1.8vw, 30px)",
                    borderColor: isOpen ? "#8a5d12" : "rgba(131,112,93,0.5)",
                    background: isOpen ? "rgba(237,228,212,0.9)" : "transparent",
                    transform: isOpen ? "rotate(135deg)" : "none",
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                    <line x1="6" y1="3.6" x2="6" y2="8.4" />
                    <line x1="3.6" y1="6" x2="8.4" y2="6" />
                  </svg>
                </span>
              </button>

              <div
                id={`faq-answer-desktop-${idx}`}
                role="region"
                aria-labelledby={`faq-question-desktop-${idx}`}
                className="grid transition-[grid-template-rows,opacity] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0 }}
              >
                <div className="overflow-hidden">
                  <p
                    className="font-serif text-[#4f4033]"
                    style={{
                      fontSize: "clamp(12.5px, 1vw, 17px)",
                      lineHeight: 1.7,
                      padding: "0 6% clamp(12px, 1.2vw, 20px) calc(2.2em + 1.6vw)",
                    }}
                  >
                    {words.map((w, i) => (
                      <span
                        key={i}
                        className={isOpen ? "fd-word" : "inline-block"}
                        style={{
                          ["--d" as string]: `${0.1 + i * 0.02}s`,
                          marginRight: "0.27em",
                          opacity: isOpen ? undefined : 0,
                        }}
                      >
                        {w}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <span
          data-s="rule"
          data-lag={items.length * 5}
          className="block h-px w-full origin-left bg-[#b9a78d]/80"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </div>
  );
};
