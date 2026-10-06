"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { GoldMotes } from "@/components/common/GoldMotes";

/**
 * FOOTER: mobile (< md).
 * The Tuscan terrace at sunset (/images/footer-web.webp) stays the backdrop, full-bleed and as
 * bright as the art allows: a cinematic fade into the page above, a warm wash behind the copy,
 * and a slow pan from the domes across to the setting sun as the footer comes into view.
 *
 * Scroll-scrubbed (forward and backward). The whole footer shares one progress value `t`
 * (0 = footer just peeking in, 1 = fully on screen) and each piece starts at its own point on it,
 * top to bottom, so the last line still completes when the page runs out of room.
 */

const WORDMARK_LINES = ["MAISON", "D’VINE"];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};

const STYLES = `
.fm-glow { animation: fm-glow 7s ease-in-out infinite; }
@keyframes fm-glow { 0%,100% { opacity: .55; transform: scale(1); } 50% { opacity: .95; transform: scale(1.08); } }
.fm-sun { animation: fm-sun 5s ease-in-out infinite; }
@keyframes fm-sun { 0%,100% { opacity: .5; transform: scale(1); } 50% { opacity: .85; transform: scale(1.18); } }
@media (prefers-reduced-motion: reduce) { .fm-glow, .fm-sun { animation: none; } }
`;

export const FooterMobile: React.FC<{
  navLinks: { label: string; href: string }[];
  social: React.ReactNode;
  backToTop: React.ReactNode;
}> = ({ navLinks, social, backToTop }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const q = <T extends HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T>(sel));
    const fades = q("[data-s='fade']");
    const letters = q("[data-s='letter']");
    const rules = q("[data-s='rule']");
    const pops = q("[data-s='pop']");

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const r = root.getBoundingClientRect();
      // offscreen: nothing to do (this handler runs on every scroll, for every section)
      if (r.width === 0 || r.bottom < -window.innerHeight || r.top > window.innerHeight * 2) return;
      // 0 when the footer's top edge reaches the bottom of the screen, 1 when it is fully in view
      const t = clamp01((vh - r.top) / Math.min(r.height, vh));

      // Backdrop: slow pan from the domes to the sun, and a little parallax
      if (imgRef.current) {
        imgRef.current.style.objectPosition = `${(40 + 36 * smooth(t)).toFixed(2)}% 38%`;
      }
      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(0, ${((1 - t) * 34).toFixed(1)}px, 0) scale(${(1.14 - 0.06 * t).toFixed(4)})`;
      }

      const at = (el: HTMLElement) => Number(el.dataset.at || 0);
      fades.forEach((el) => {
        const e = smooth((t - at(el)) / 0.3);
        el.style.opacity = String(e.toFixed(3));
        el.style.transform = `translate3d(0, ${((1 - e) * 18).toFixed(1)}px, 0)`;
      });
      pops.forEach((el) => {
        const e = smooth((t - at(el)) / 0.22);
        el.style.opacity = String(e.toFixed(3));
        el.style.transform = `scale(${(0.4 + 0.6 * e).toFixed(3)}) translate3d(0, ${((1 - e) * 10).toFixed(1)}px, 0)`;
      });
      rules.forEach((el) => {
        el.style.transform = `scaleX(${smooth((t - at(el)) / 0.3).toFixed(3)})`;
      });
      letters.forEach((el) => {
        const e = smooth((t - at(el)) / 0.28);
        el.style.transform = `translate3d(0, ${((1 - e) * 118).toFixed(1)}%, 0)`;
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

  return (
    <div ref={rootRef} className="relative w-full overflow-clip bg-[#0e0d0c] text-center">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* ===== Backdrop: the terrace, panning domes -> sun ===== */}
      <div
        ref={bgRef}
        aria-hidden="true"
        className="absolute inset-0 will-change-transform"
        style={{ transform: "scale(1.14)" }}
      >
        <div ref={imgRef} className="absolute inset-0" style={{ objectPosition: "40% 38%" }}>
          <Image
            src="/images/footer-web.webp"
            alt=""
            fill
            unoptimized
            sizes="100vw"
            className="object-cover select-none"
            style={{ objectPosition: "inherit" }}
          />
        </div>
      </div>

      {/* Sun bloom + warm terrace light */}
      <div
        aria-hidden="true"
        className="fm-sun pointer-events-none absolute top-[6%] right-[-6%] h-[34%] w-[62%]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,205,130,0.6), rgba(255,160,70,0.14) 60%, transparent 100%)",
          mixBlendMode: "screen",
        }}
      />
      <div
        aria-hidden="true"
        className="fm-glow pointer-events-none absolute inset-x-0 bottom-[12%] h-[40%]"
        style={{
          background:
            "radial-gradient(60% 70% at 50% 60%, rgba(255,214,150,0.22), transparent 75%)",
        }}
      />

      {/* Fade into the page above, darken behind the copy and the wordmark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(14,13,12,0.15) 0%, rgba(14,13,12,0.1) 14%, rgba(14,13,12,0.2) 28%, rgba(14,13,12,0.4) 52%, rgba(14,13,12,0.74) 80%, #0e0d0c 100%)",
        }}
      />
      <GoldMotes count={14} className="z-[5]" />

      {/* ===== Copy ===== */}
      <div className="relative z-10 flex flex-col items-center px-[6%] pt-[27vw] pb-[7vw]">
        {/* Navigation between two hairlines */}
        <div
          data-s="fade"
          data-at="0"
          className="flex w-full items-center justify-center gap-3"
          style={{ opacity: 0 }}
        >
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#EAD5B8]/55" />
          <nav className="flex items-center gap-[4.4vw] font-serif text-[10.5px] tracking-[0.26em] text-[#FBF6EE] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {navLinks.map((item) => (
              <Link key={item.label} href={item.href} className="py-1 active:text-[#EAD5B8]">
                {item.label}
              </Link>
            ))}
          </nav>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#EAD5B8]/55" />
        </div>

        <p
          data-s="fade"
          data-at="0.06"
          className="mt-[9vw] font-serif text-[10px] font-medium tracking-[0.34em] text-[#F3DFC1] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
          style={{ opacity: 0 }}
        >
          Artisanal living, timeless stories
        </p>
        <p
          data-s="fade"
          data-at="0.12"
          className="mt-3 max-w-[320px] font-serif text-[13px] leading-[1.65] text-[#FBF6EE]/92 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
          style={{ opacity: 0 }}
        >
          Curated pieces, thoughtful details, and timeless objects for a more beautiful, slower way
          of living.
        </p>

        {/* Social */}
        <div
          className="mt-6 flex items-center justify-center"
          data-s="fade"
          data-at="0.18"
          style={{ opacity: 0 }}
        >
          {social}
        </div>

        {/* Wordmark: two lines, letters rise out of their masks with the scroll */}
        <h2
          aria-label="MAISON D’VINE"
          className="mt-[9vw] w-full font-serif font-normal tracking-[-0.02em] text-[#FAF4E8] uppercase"
          style={{
            fontSize: "clamp(56px,19.5vw,120px)",
            lineHeight: 0.92,
            textShadow: "0 8px 32px rgba(0,0,0,0.85)",
            WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 35%, rgba(0,0,0,0) 100%)",
            maskImage: "linear-gradient(to bottom, #000 0%, #000 35%, rgba(0,0,0,0) 100%)",
          }}
        >
          {WORDMARK_LINES.map((line, li) => (
            <span
              key={line}
              aria-hidden="true"
              className="block overflow-hidden pt-[0.04em] pb-[0.1em]"
            >
              {Array.from(line).map((ch, i) => (
                <span
                  key={i}
                  data-s="letter"
                  data-at={(0.26 + li * 0.1 + i * 0.012).toFixed(3)}
                  className="inline-block will-change-transform"
                  style={{ transform: "translateY(118%)" }}
                >
                  <span
                    className="animate-footer-wave inline-block"
                    style={{ ["--i" as string]: li * 6 + i } as React.CSSProperties}
                  >
                    {ch}
                  </span>
                </span>
              ))}
            </span>
          ))}
        </h2>

        {/* Hairline draws across */}
        <span
          data-s="rule"
          data-at="0.62"
          className="mt-[6vw] block h-px w-full origin-left bg-gradient-to-r from-transparent via-[#F3DFC1]/45 to-transparent"
          style={{ transform: "scaleX(0)" }}
        />

        {/* Legal */}
        <div
          data-s="fade"
          data-at="0.68"
          className="mt-4 flex flex-col items-center gap-2.5 font-serif text-[10px] tracking-[0.2em] text-[#FBF6EE]/80 uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center gap-4 text-[#FBF6EE]/92">
            <a href="#privacy">Terms</a>
            <span className="text-[#F3DFC1]/45">&bull;</span>
            <a href="#privacy">Privacy</a>
            <span className="text-[#F3DFC1]/45">&bull;</span>
            <a href="#privacy">Cookies</a>
          </div>
          <div>&copy; 2026 MAISON D&rsquo;VINE. All rights reserved.</div>
          <div className="mt-1 text-[8.5px] tracking-[0.3em] text-[#F3DFC1]/70">
            Designed &amp; crafted by <span className="font-medium text-[#F3DFC1]">Angaar Labs</span>
          </div>
        </div>

        <div data-s="pop" data-at="0.78" className="mt-4" style={{ opacity: 0 }}>
          {backToTop}
        </div>
      </div>
    </div>
  );
};
