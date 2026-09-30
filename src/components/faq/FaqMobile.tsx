"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

export interface FaqMobileItem {
  id: string;
  question: string;
  answer: string;
}

/**
 * FAQ: mobile (< md).
 * The torn parchment (/images/echo-bg-mobile.png: torn top + bottom, dried flowers in the corner)
 * IS the page: questions sit straight on the paper as an index, no boxes.
 *
 * Scroll-scrubbed (plays forward and backward with your thumb):
 *  - eyebrow, FAQs (letter by letter) and the poem rise out of their masks
 *  - each question slides in from the right as it reaches the reading line, its hairline draws
 *  - the handwritten note is written by the scroll and its heart draws itself
 *  - the paper drifts slowly, and a soft band of light crosses it as you scroll
 *
 * Accordion: one open at a time. The row gets a gold bar and a gold number, the plus turns to a
 * cross, the answer unfolds and its words settle in one after another.
 */

const STYLES = `
.fq-sheen { background: linear-gradient(105deg, transparent 38%, rgba(255,250,235,.42) 50%, transparent 62%); mix-blend-mode: soft-light; }
.fq-row-btn:focus-visible { outline: 1px solid #8a6a3a; outline-offset: 4px; }
.fq-word { display: inline-block; opacity: 0; animation: fq-word .55s cubic-bezier(.22,1,.36,1) var(--d, 0s) both; }
@keyframes fq-word { from { opacity: 0; transform: translateY(8px); filter: blur(2px); } to { opacity: 1; transform: none; filter: none; } }
.fq-bar { transform-origin: top; transition: transform .6s cubic-bezier(.22,1,.36,1); }
.fq-btn { position: relative; overflow: hidden; isolation: isolate; }
.fq-btn::before { content: ""; position: absolute; inset: 0; z-index: -1; background: #2b2118; transform: translateX(-101%); transition: transform .55s cubic-bezier(.22,1,.36,1); }
.fq-btn:hover::before, .fq-btn:active::before, .fq-btn:focus-visible::before { transform: none; }
.fq-btn:hover, .fq-btn:active, .fq-btn:focus-visible { color: #faf6ee; }
.fq-dot { animation: fq-dot 2.4s ease-in-out infinite; }
@keyframes fq-dot { 0%,100% { transform: scale(1); opacity: .7; } 50% { transform: scale(1.35); opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .fq-word { animation: none; opacity: 1; } .fq-dot { animation: none; } }
`;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};

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
    <span
      data-inner
      className="block will-change-transform"
      style={{ transform: "translateY(112%)" }}
    >
      {children}
    </span>
  </span>
);

export const FaqMobile: React.FC<{
  items: FaqMobileItem[];
  openIndex: number | null;
  onToggle: (i: number) => void;
}> = ({ items, openIndex, onToggle }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const q = <T extends HTMLElement | SVGElement>(sel: string) =>
      Array.from(root.querySelectorAll<T>(sel));
    const risers = q<HTMLElement>("[data-s='rise']");
    const rows = q<HTMLElement>("[data-s='row']");
    const rules = q<HTMLElement>("[data-s='rule']");
    const inks = q<HTMLElement>("[data-s='ink']");
    const draws = q<SVGPathElement>("[data-s='draw']");
    const fades = q<HTMLElement>("[data-s='fade']");

    let raf = 0;
    const prog = (el: Element, lag = 0, span = 0.17) => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      return smooth((vh * 1.0 - r.top - lag) / (vh * span));
    };

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const rr = root.getBoundingClientRect();
      const t = clamp01((vh - rr.top) / (vh + rr.height));
      root.style.setProperty("--sp", t.toFixed(4));
      root.style.setProperty("--sheen", `${(t * 260 - 80).toFixed(1)}%`);

      risers.forEach((el) => {
        const inner = el.querySelector<HTMLElement>("[data-inner]");
        if (!inner) return;
        const e = prog(el, Number(el.dataset.lag || 0));
        inner.style.transform = `translate3d(0, ${((1 - e) * 112).toFixed(1)}%, 0)`;
        inner.style.opacity = String(0.3 + 0.7 * e);
      });
      rows.forEach((el) => {
        const e = prog(el, Number(el.dataset.lag || 0), 0.15);
        el.style.opacity = String(0.22 + 0.78 * e);
        el.style.transform = `translate3d(${((1 - e) * 44).toFixed(1)}px, 0, 0)`;
      });
      rules.forEach((el) => {
        el.style.transform = `scaleX(${prog(el, Number(el.dataset.lag || 0), 0.14).toFixed(3)})`;
      });
      inks.forEach((el) => {
        const e = prog(el, Number(el.dataset.lag || 0), 0.2);
        el.style.clipPath = `inset(-4% ${((1 - e) * 104).toFixed(1)}% -4% 0)`;
      });
      draws.forEach((el) => {
        el.style.strokeDashoffset = String((1 - prog(el, 0, 0.22)).toFixed(3));
      });
      fades.forEach((el) => {
        const e = prog(el, Number(el.dataset.lag || 0));
        el.style.opacity = String(0.2 + 0.8 * e);
        el.style.transform = `translate3d(0, ${((1 - e) * 14).toFixed(1)}px, 0)`;
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
    <div ref={rootRef} className="relative w-full overflow-hidden text-left">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* ===== The paper: drifts slowly, a band of light crosses it ===== */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -inset-y-[2%] will-change-transform"
        style={{
          transform: "translate3d(0, calc((var(--sp, 0.5) - 0.5) * -22px), 0)",
          filter: "drop-shadow(0 -10px 18px rgba(0,0,0,0.45))",
        }}
      >
        <Image
          src="/images/echo-bg-mobile.png"
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="object-fill select-none"
        />
        <div
          className="fq-sheen absolute inset-0"
          style={{ backgroundPositionX: "var(--sheen, 0%)", backgroundSize: "220% 100%" }}
        />
      </div>

      {/* ===== Copy on the paper ===== */}
      <div
        className="relative z-10 px-[8%] pt-[19vw] pb-[18vw]"
        style={{ minHeight: "calc(100vw * 1024 / 487)", color: ink }}
      >
        {/* Header: clear of the dried flowers in the top-right corner */}
        <div className="pr-[24%]">
          <div className="flex items-center gap-3 font-sans text-[10.5px] font-medium tracking-[0.26em] text-[#605043] uppercase">
            <span
              data-s="rule"
              className="block h-px w-8 origin-left bg-[#8a6a3a]"
              style={{ transform: "scaleX(0)" }}
            />
            <Rise className="leading-[1.5]">Questions you may have</Rise>
          </div>

          <h2
            aria-label="FAQs"
            className="mt-2 flex font-serif leading-[0.95] font-normal tracking-tight"
            style={{ fontSize: "clamp(56px,18vw,96px)" }}
          >
            {Array.from("FAQs").map((ch, i) => (
              <Rise key={i} lag={i * 26}>
                <span aria-hidden="true" className={ch === "s" ? "text-[#8a6a3a] italic" : ""}>
                  {ch}
                </span>
              </Rise>
            ))}
          </h2>

          <p className="mt-3 font-serif text-[14.5px] leading-[1.5] text-[#46392f]">
            {[
              "Little questions,",
              "thoughtful answers —",
              "because your journey",
              "with us should feel effortless.",
            ].map((l, i) => (
              <Rise key={l} lag={40 + i * 22}>
                {l}
              </Rise>
            ))}
          </p>
        </div>

        {/* Questions as an index on the paper */}
        <div className="mt-8">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            const words = item.answer.split(" ");
            return (
              <div
                key={item.id}
                data-s="row"
                data-lag={idx * 6}
                className="relative will-change-transform"
                style={{ opacity: 0.22 }}
              >
                <span
                  data-s="rule"
                  data-lag={idx * 6}
                  className="block h-px w-full origin-left bg-[#b9a78d]/80"
                  style={{ transform: "scaleX(0)" }}
                />

                {/* Gold bar on the open row */}
                <span
                  aria-hidden="true"
                  className="fq-bar absolute top-0 bottom-0 left-[-4%] w-[2px] bg-[#b8862d]"
                  style={{ transform: isOpen ? "scaleY(1)" : "scaleY(0)" }}
                />

                <button
                  type="button"
                  onClick={() => onToggle(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-mobile-${idx}`}
                  id={`faq-question-mobile-${idx}`}
                  className="fq-row-btn group flex w-full cursor-pointer items-start gap-4 py-[18px] text-left"
                >
                  <span
                    className="mt-[3px] w-6 shrink-0 font-serif text-[11px] tracking-[0.18em] transition-colors duration-500"
                    style={{ color: isOpen ? "#b8862d" : "#8b7a66" }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="min-w-0 flex-1 font-serif text-[16px] leading-[1.32] tracking-[0.005em] transition-all duration-500"
                    style={{
                      color: isOpen ? "#8a5d12" : ink,
                      fontStyle: isOpen ? "italic" : "normal",
                      transform: isOpen ? "translateX(3px)" : "none",
                    }}
                  >
                    {item.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-[1px] flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[#3e3025] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{
                      borderColor: isOpen ? "#8a5d12" : "rgba(131,112,93,0.5)",
                      background: isOpen ? "rgba(237,228,212,0.9)" : "transparent",
                      transform: isOpen ? "rotate(135deg)" : "none",
                    }}
                  >
                    <svg
                      width="9"
                      height="9"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                    >
                      <line x1="6" y1="3.6" x2="6" y2="8.4" />
                      <line x1="3.6" y1="6" x2="8.4" y2="6" />
                    </svg>
                  </span>
                </button>

                <div
                  id={`faq-answer-mobile-${idx}`}
                  role="region"
                  aria-labelledby={`faq-question-mobile-${idx}`}
                  className="grid transition-[grid-template-rows,opacity] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0 }}
                >
                  <div className="overflow-hidden">
                    <p className="pr-2 pb-5 pl-10 font-serif text-[13.5px] leading-[1.7] text-[#4f4033]">
                      {words.map((w, i) => (
                        <span
                          key={i}
                          className={isOpen ? "fq-word" : "inline-block"}
                          style={{
                            ["--d" as string]: `${0.12 + i * 0.022}s`,
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
            data-lag={items.length * 6}
            className="block h-px w-full origin-left bg-[#b9a78d]/80"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {/* Handwritten note + heart + button */}
        <div className="mt-9 flex items-end justify-between gap-4">
          <p
            className="font-allura allura-regular font-script font-cursive origin-bottom-left -rotate-[4deg] leading-[1.12] tracking-wide text-[#413328]"
            style={{ fontSize: "clamp(25px,7.6vw,38px)" }}
          >
            {["Still wondering?", "We're here for you"].map((l, i) => (
              <span
                key={l}
                data-s="ink"
                data-lag={i * 30}
                className="block"
                style={{ clipPath: "inset(-4% 104% -4% 0)" }}
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
        </div>

        <div data-s="fade" className="mt-6" style={{ opacity: 0.2 }}>
          <button
            type="button"
            className="fq-btn group inline-flex cursor-pointer items-center gap-5 border border-[#2b2118] bg-transparent px-6 py-3 font-serif text-[11px] font-medium tracking-[0.22em] text-[#2b2118] uppercase transition-transform duration-300 active:scale-[0.98]"
          >
            <span>View all FAQs</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1.5">
              &rarr;
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
