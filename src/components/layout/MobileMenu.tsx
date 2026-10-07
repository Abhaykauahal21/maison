"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { getLenis, smoothScrollTo } from "@/lib/smooth-scroll";

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { label: string; href: string; id: string; /** a separate page instead of a section of the home page */ route?: string }[];
  active?: string | null;
}

/** Where the Menu button sits; the paper unfolds from this corner. */
const ORIGIN = "44px 30px";
const EXIT_MS = 800;

/** Ragged torn right edge as a polygon: the paper is ONE clipped element, so edge and body match. */
const tornClip = (() => {
  const pts = ["0 0"];
  for (let i = 0; i <= 200; i++) {
    const y = i * 5;
    const n =
      (Math.sin(y * 0.021 + 1.3) * 0.5 +
        Math.sin(y * 0.067 + 4.1) * 0.3 +
        Math.sin(y * 0.19 + 2.2) * 0.14 +
        Math.sin(y * 0.53 + 0.7) * 0.06 +
        1) /
      2;
    pts.push(`calc(100% - ${(13 * (1 - n)).toFixed(1)}px) ${(i / 2).toFixed(1)}%`);
  }
  pts.push("0 100%");
  return `polygon(${pts.join(", ")})`;
})();

const PAPER =
  "radial-gradient(120% 90% at 0% 0%, #fbf5e9 0%, #f3ead9 55%, #ebdfc9 100%)";
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .35 0 0 0 0 .27 0 0 0 0 .18 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.3'/%3E%3C/svg%3E\")";

const GOWN =
  "M84 98 C80 120 86 140 90 150 C70 200 40 260 22 318 C60 332 140 332 178 318 C160 260 130 200 110 150 C114 140 120 120 116 98 C110 112 90 112 84 98Z";

const PEARLS = [
  { left: "8%", delay: 1.2, dur: 11, size: 9, gold: false },
  { left: "27%", delay: 3.5, dur: 13, size: 8, gold: true },
  { left: "46%", delay: 0.4, dur: 12, size: 10, gold: false },
  { left: "64%", delay: 5.2, dur: 10, size: 8, gold: true },
  { left: "82%", delay: 2.4, dur: 14, size: 11, gold: false },
];

/** A gown on its hanger, sketched in, filled, then hemmed with a running stitch and a needle. */
const Atelier: React.FC = () => (
  <>
    {/* drifting pearls and sequins */}
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {PEARLS.map((p, i) => (
        <svg
          key={i}
          viewBox="0 0 10 10"
          width={p.size}
          height={p.size}
          className="menu-petal absolute -top-6"
          style={{ left: p.left, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }}
        >
          {p.gold ? (
            <path d="M5 0 L10 5 L5 10 L0 5Z" fill="#e2b04a" stroke="#b98a2c" strokeWidth="0.6" />
          ) : (
            <circle cx="5" cy="5" r="4.3" fill="#fffdf7" stroke="#cdb994" strokeWidth="0.7" />
          )}
        </svg>
      ))}
    </div>

    <svg
      aria-hidden="true"
      viewBox="0 0 200 340"
      className="menu-sway pointer-events-none absolute top-[12%] right-[5%] h-[68%] max-h-[600px] w-auto opacity-[0.5] sm:opacity-90"
    >
      {/* soft fabric fill fades in once the outline is drawn */}
      <path className="menu-fill" d={GOWN} fill="#e6cdbd" />

      <g fill="none" stroke="#5a4636" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6">
        {/* hanger */}
        <path className="menu-draw" pathLength="1" d="M100 40 C100 26 111 22 111 13 C111 5 100 3 97 9" />
        <path className="menu-draw" pathLength="1" style={{ animationDelay: "1s" }} d="M100 40 L24 72 Q18 75 24 77 L176 77 Q182 75 176 72 Z" />
        {/* straps */}
        <path className="menu-draw" pathLength="1" style={{ animationDelay: "1.2s" }} d="M80 77 L84 98 M120 77 L116 98" />
        {/* gown outline */}
        <path className="menu-draw" pathLength="1" style={{ animationDelay: "1.35s", animationDuration: "2.2s" }} d={GOWN} />
        {/* skirt folds */}
        <g strokeWidth="1" opacity="0.7">
          <path className="menu-draw" pathLength="1" style={{ animationDelay: "2.4s" }} d="M100 150 C98 210 90 270 76 326" />
          <path className="menu-draw" pathLength="1" style={{ animationDelay: "2.5s" }} d="M100 150 C102 210 110 270 124 326" />
          <path className="menu-draw" pathLength="1" style={{ animationDelay: "2.6s" }} d="M95 150 C84 200 62 262 50 324" />
          <path className="menu-draw" pathLength="1" style={{ animationDelay: "2.7s" }} d="M105 150 C116 200 138 262 150 324" />
        </g>
        {/* waist ribbon with a bow */}
        <path className="menu-draw" pathLength="1" style={{ animationDelay: "2.2s" }} d="M89 150 L111 150 M100 150 C90 140 86 154 100 150 C114 154 110 140 100 150" />
      </g>

      {/* running stitch along the hem */}
      <path
        className="menu-stitch"
        d="M30 311 C66 326 134 326 170 311"
        fill="none"
        stroke="#b98a2c"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeDasharray="5 5"
      />

      {/* needle trailing its thread, bobbing as it sews */}
      <g className="menu-needle" transform="translate(172 296) rotate(-28)">
        <line x1="0" y1="0" x2="34" y2="0" stroke="#8f98a0" strokeWidth="1.8" strokeLinecap="round" />
        <ellipse cx="36" cy="0" rx="1.6" ry="3" fill="none" stroke="#8f98a0" strokeWidth="1" />
      </g>
      <path
        className="menu-draw"
        pathLength="1"
        style={{ animationDelay: "3.2s" }}
        d="M200 282 C190 262 178 280 168 300"
        fill="none"
        stroke="#b98a2c"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  </>
);

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, links, active }) => {
  const router = useRouter();
  const [armed, setArmed] = useState(false);
  // Mount on open, then arm a frame later so the unfold transition actually plays;
  // on close `shown` drops at once (reverse fold) and the tree unmounts after it finishes.
  const mounted = isOpen || armed;
  const shown = isOpen && armed;

  useEffect(() => {
    if (isOpen) {
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setArmed(true)));
      return () => cancelAnimationFrame(raf);
    }
    const t = window.setTimeout(() => setArmed(false), EXIT_MS);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  // Freeze the page behind the menu; Escape closes it
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const go = (e: React.MouseEvent, id: string, route?: string) => {
    e.preventDefault();
    onClose();
    if (route) {
      window.setTimeout(() => {
        if (window.location.pathname !== route) router.push(route);
      }, 60);
      return;
    }
    // let the page unfreeze first, then glide
    window.setTimeout(() => {
      const el = document.getElementById(id);
      if (el) smoothScrollTo(el, 1.6);
      // not on the page: either the story gate is holding it back, or we are on another route
      else if (window.location.pathname === "/") window.dispatchEvent(new Event("story-gate:open"));
      else router.push(`/#${id}`);
    }, 60);
  };

  const ease = "cubic-bezier(0.76, 0, 0.24, 1)";

  return (
    <div
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
    >
      {/* The rest of the page: dimmed and blurred, click to dismiss */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="absolute inset-0 bg-[#0c0b0a]/45 backdrop-blur-md transition-opacity duration-700 motion-reduce:transition-none"
        style={{ opacity: shown ? 1 : 0 }}
      />

      {/* Paper sheet: unfolds from the Menu corner. drop-shadow sits outside the clip. */}
      <div
        className="pointer-events-none absolute top-0 left-0 h-full w-[94%] sm:w-[62%] md:w-1/2 md:min-w-[460px]"
        style={{ filter: "drop-shadow(10px 0 26px rgba(0,0,0,0.5))" }}
      >
        <div
          className="pointer-events-auto relative h-full w-full transition-[clip-path] duration-[800ms] motion-reduce:transition-none"
          style={{
            clipPath: shown ? `circle(160% at ${ORIGIN})` : `circle(0px at ${ORIGIN})`,
            transitionTimingFunction: ease,
          }}
        >
          {/* paper: one element (gradient + grain), torn along the right edge */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage: `${GRAIN}, ${PAPER}`,
              backgroundBlendMode: "multiply",
              clipPath: tornClip,
            }}
          />

          <Atelier />

          {/* content */}
          <div
            className="relative flex h-full flex-col justify-between px-7 py-7 pr-9 text-[#1c1815] sm:px-12 sm:pr-14"
            style={{
              opacity: shown ? 1 : 0,
              transition: `opacity ${shown ? "0.5s ease 0.25s" : "0.2s ease"}`,
            }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between border-b border-[#1c1815]/15 pb-5">
              <span className="font-bodoni text-sm tracking-[0.25em] text-[#1c1815] uppercase">
                MAISON D&apos;VINE
              </span>
              <button
                type="button"
                onClick={onClose}
                className="group -mr-2 p-2 text-[#1c1815]/80 transition-colors hover:text-[#1c1815]"
                aria-label="Close Menu"
              >
                <X className="h-6 w-6 stroke-[1.3] transition-transform duration-500 group-hover:rotate-90" />
              </button>
            </div>

            {/* Chapters */}
            <nav className="my-auto flex flex-col" aria-label="Chapters">
              {links.map((link, i) => {
                const isActive = active === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => go(e, link.id, link.route)}
                    className="nav-link-rise group relative flex items-baseline gap-5 border-b border-[#1c1815]/12 py-4 sm:py-5"
                    style={{ animationDelay: `${0.35 + i * 0.08}s` }}
                  >
                    <span
                      className={`w-7 text-[11px] tracking-[0.2em] transition-colors ${
                        isActive ? "text-[#8a6a3b]" : "text-[#1c1815]/40"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-serif text-[30px] leading-none tracking-[0.04em] transition-all duration-500 group-hover:translate-x-2 sm:text-4xl ${
                        isActive ? "text-[#8a6a3b] italic" : "text-[#1c1815]"
                      }`}
                    >
                      {link.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="ml-auto text-lg text-[#8a6a3b] opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100 max-md:opacity-70"
                    >
                      &rarr;
                    </span>
                    {/* ink line draws under the row on hover */}
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-[#8a6a3b] transition-transform duration-700 ease-out group-hover:scale-x-100"
                    />
                  </a>
                );
              })}
            </nav>

            {/* Footer */}
            <div
              className="nav-link-rise flex flex-col gap-4 border-t border-[#1c1815]/15 pt-5"
              style={{ animationDelay: `${0.35 + links.length * 0.08}s` }}
            >
              <a
                href="#closer"
                onClick={(e) => go(e, "closer")}
                className="flex items-center justify-between border border-[#1c1815]/70 px-5 py-3 text-[11px] tracking-[0.22em] text-[#1c1815] uppercase transition-colors duration-300 hover:bg-[#1c1815] hover:text-[#f4efe8]"
              >
                <span>Join the Archive</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
              <p className="text-center text-[10.5px] tracking-[0.25em] text-[#1c1815]/50 uppercase">
                Not just dresses, but stories
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
