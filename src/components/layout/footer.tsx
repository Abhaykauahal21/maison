"use client";

import { smoothScrollTo } from "@/lib/smooth-scroll";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { GoldMotes } from "@/components/common/GoldMotes";
import { FooterMobile } from "@/components/layout/FooterMobile";

const WORDMARK = "MAISON D\u2019VINE";

/**
 * Giant wordmark: letters rise out of a mask one by one, then a slow golden wave
 * keeps travelling through them.
 */
const Wordmark: React.FC<{ inView: boolean; className: string; lineHeight: number }> = ({
  inView,
  className,
  lineHeight,
}) => (
  <h2
    aria-label={WORDMARK}
    className={className}
    style={{ lineHeight, whiteSpace: "nowrap", textShadow: "0 8px 32px rgba(0,0,0,0.85)" }}
  >
    <span className="block overflow-hidden pt-[0.04em] pb-[0.08em]" aria-hidden="true">
      {Array.from(WORDMARK).map((ch, i) => (
        <span
          key={i}
          className={`inline-block transition-transform duration-[1300ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
            inView ? "animate-footer-wave" : ""
          }`}
          style={
            {
              transform: inView ? "translateY(0)" : "translateY(115%)",
              transitionDelay: inView ? `${250 + i * 60}ms` : "0ms",
              "--i": i,
            } as React.CSSProperties
          }
        >
          {/* scroll layer: the letters converge as the footer arrives */}
          <span data-fs className="inline-block will-change-transform">
            {/* mouse layer: letters near the cursor lift and glow */}
            <span data-fm className="inline-block will-change-transform">
              {ch === " " ? "\u00A0" : ch}
            </span>
          </span>
        </span>
      ))}
    </span>
  </h2>
);

const BackToTop: React.FC<{ className?: string }> = ({ className = "" }) => (
  <button
    type="button"
    onClick={() => smoothScrollTo(0)}
    aria-label="Back to top"
    className={`group inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#F3DFC1]/45 text-[#F3DFC1] transition-all duration-300 hover:border-[#F3DFC1] hover:bg-[#F3DFC1]/15 ${className}`}
  >
    <span className="animate-footer-bob text-sm leading-none transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true">
      &uarr;
    </span>
  </button>
);

export const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement | null>(null);
  const deskRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  // Desktop only. Scroll: the terrace settles (dolly + parallax), the sun blooms, the wordmark
  // letters converge. Mouse: the terrace shifts against the cursor, a warm light follows it over
  // the stone, and the wordmark letters near the cursor lift and glow.
  useEffect(() => {
    const root = deskRef.current;
    if (!root) return;
    const bg = root.querySelector<HTMLElement>("[data-fbg]");
    const sun = root.querySelector<HTMLElement>("[data-fsun]");
    const light = root.querySelector<HTMLElement>("[data-flight]");
    const scrollEls = Array.from(root.querySelectorAll<HTMLElement>("[data-fs]"));
    const mouseEls = Array.from(root.querySelectorAll<HTMLElement>("[data-fm]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

    let t = 0; // scroll progress: 0 as the footer's top reaches the screen bottom, 1 when it is in view
    let inside = false;
    let tx = 0; // mouse target, in px relative to the footer
    let ty = 0;
    let mx = 0;
    let my = 0;
    let raf = 0;

    const paint = () => {
      const e = t * t * (3 - 2 * t);
      const w = root.clientWidth || 1;
      const h = root.clientHeight || 1;
      const nx = mx / w - 0.5; // -0.5 .. 0.5
      const ny = my / h - 0.5;
      if (bg) {
        bg.style.transform = `translate3d(${(-nx * 26).toFixed(1)}px, ${((1 - e) * -34 - ny * 14).toFixed(1)}px, 0) scale(${(1.14 - 0.1 * e).toFixed(4)})`;
      }
      if (sun) {
        sun.style.opacity = (0.25 + 0.75 * e).toFixed(3);
        sun.style.transform = `translate3d(0,0,0) scale(${(0.75 + 0.35 * e).toFixed(3)})`;
      }
      scrollEls.forEach((el, i) => {
        const c = (scrollEls.length - 1) / 2;
        el.style.transform = `translate3d(${((i - c) * 0.045 * (1 - e)).toFixed(3)}em, 0, 0)`;
      });
    };

    const frame = () => {
      raf = 0;
      mx += (tx - mx) * 0.1;
      my += (ty - my) * 0.1;
      paint();
      if (light) light.style.transform = `translate3d(${mx.toFixed(1)}px, ${my.toFixed(1)}px, 0)`;

      // letters near the cursor lift and glow
      const gx = root.getBoundingClientRect().left + mx;
      const gy = root.getBoundingClientRect().top + my;
      const reach = Math.max(120, window.innerWidth * 0.1);
      mouseEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        const d = Math.hypot(gx - (r.left + r.width / 2), (gy - (r.top + r.height / 2)) * 0.7);
        const f = inside ? Math.pow(clamp01(1 - d / reach), 2) : 0;
        el.style.transform = f > 0.003 ? `translate3d(0, ${(-f * 0.11).toFixed(3)}em, 0) scale(${(1 + f * 0.09).toFixed(3)})` : "";
        el.style.textShadow = f > 0.02 ? `0 0 ${(f * 26).toFixed(1)}px rgba(255, 214, 140, ${(f * 0.95).toFixed(2)})` : "";
      });

      const settled = Math.abs(tx - mx) < 0.4 && Math.abs(ty - my) < 0.4;
      if (inside || !settled) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onScroll = () => {
      const r = root.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.width === 0 || r.bottom < -100 || r.top > vh + 100) return;
      t = clamp01((vh - r.top) / Math.min(r.height, vh));
      paint();
    };
    const onMove = (ev: MouseEvent) => {
      const r = root.getBoundingClientRect();
      tx = ev.clientX - r.left;
      ty = ev.clientY - r.top;
      if (!inside) {
        inside = true;
        mx = tx;
        my = ty;
        if (light) light.style.opacity = "1";
      }
      kick();
    };
    const onLeave = () => {
      inside = false;
      tx = root.clientWidth / 2;
      ty = root.clientHeight / 2;
      if (light) light.style.opacity = "0";
      kick();
    };

    tx = mx = root.clientWidth / 2;
    ty = my = root.clientHeight / 2;
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    if (!reduce) {
      root.addEventListener("mousemove", onMove);
      root.addEventListener("mouseleave", onLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      root.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -20px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { label: "SHOP", href: "/#story" },
    { label: "ABOUT", href: "/about" },
    { label: "JOURNAL", href: "/#journal" },
    { label: "CONTACT", href: "/#epilogue" },
  ];

  return (
    <footer
      ref={footerRef}
      id="footer"
      aria-label="Maison D'Vine Footer"
      className="relative z-20 md:z-30 -mt-[14vw] md:mt-0 w-full max-w-full select-none bg-[#0e0d0c] overflow-x-clip"
    >
      {/* ========================================================
          1. DESKTOP & TABLET VIEW (md: 768px+)
          - Direct load of /images/footer-web.webp (2159 x 728)
          - Full natural width and height with 100% pixel fidelity
          - Zero downscaling, quality={100}, unoptimized
          ======================================================== */}
      <div
        ref={deskRef}
        className="relative hidden w-full max-w-full min-w-0 overflow-hidden md:block"
      >
        <div
          className={`relative w-full max-w-full overflow-hidden transition-opacity duration-1000 ease-out ${
            inView ? "opacity-100" : "opacity-95"
          }`}
        >
          {/* Base high-resolution 2159 x 728 background image (scroll dolly + mouse parallax) */}
          <div data-fbg className="will-change-transform" style={{ transform: "scale(1.14)" }}>
            <div className={inView ? "animate-footer-drift" : ""}>
              <Image
                src="/images/footer-web.webp"
                alt="Maison D'Vine Tuscan Sunset Terrace Atmosphere"
                width={2159}
                height={728}
                quality={100}
                unoptimized
                className="pointer-events-none block h-auto w-full select-none"
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            </div>
          </div>

          {/* The setting sun blooms as the footer arrives (sun sits at ~73% x, 19% y of the photo) */}
          <div
            data-fsun
            className="pointer-events-none absolute z-[4] will-change-transform"
            style={{
              left: "73.3%",
              top: "19%",
              width: "38vw",
              height: "38vw",
              marginLeft: "-19vw",
              marginTop: "-19vw",
              opacity: 0.25,
              background:
                "radial-gradient(closest-side, rgba(255,226,160,0.55), rgba(255,170,80,0.18) 42%, transparent 100%)",
              mixBlendMode: "screen",
            }}
            aria-hidden="true"
          />

          {/* Warm light that follows the cursor over the stone */}
          <div
            className="pointer-events-none absolute inset-0 z-[6] overflow-hidden"
            aria-hidden="true"
          >
            <div
              data-flight
              className="absolute top-0 left-0 will-change-transform"
              style={{
                width: "30vw",
                height: "30vw",
                marginLeft: "-15vw",
                marginTop: "-15vw",
                opacity: 0,
                transition: "opacity 0.6s ease",
                background:
                  "radial-gradient(closest-side, rgba(255,222,160,0.4), rgba(255,190,110,0.12) 55%, transparent 100%)",
                mixBlendMode: "screen",
              }}
            />
          </div>

          {/* Warm terrace light drifting across the scene, plus a little dust */}
          <div
            className="animate-hero-glow pointer-events-none absolute inset-0 z-[5]"
            style={{
              background:
                "radial-gradient(45vw circle at 50% 70%, rgba(255, 214, 150, 0.16) 0%, rgba(255, 214, 150, 0.04) 50%, transparent 75%)",
            }}
            aria-hidden="true"
          />
          {inView && <GoldMotes count={16} className="z-[8]" />}

          {/* Cinematic top gradient blend from previous section */}
          <div
            className="pointer-events-none absolute top-0 left-0 right-0 h-24 lg:h-32 z-10"
            style={{
              background:
                "linear-gradient(180deg, #0e0d0c 0%, rgba(14,13,12,0.65) 45%, transparent 100%)",
            }}
            aria-hidden="true"
          />

          {/* Bottom subtle shadow anchor */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-14 lg:h-20 z-10"
            style={{
              background:
                "linear-gradient(0deg, rgba(14,13,12,0.6) 0%, transparent 100%)",
            }}
            aria-hidden="true"
          />

          {/* ====================================================
              OVERLAID EDITORIAL CONTENT (Desktop / Tablet)
              - Perfectly balanced hierarchy with zero clipping
              ==================================================== */}
          <div className="pointer-events-auto absolute inset-0 z-20 flex flex-col justify-between pt-5 md:pt-7 lg:pt-9 pb-3 md:pb-4 px-6 lg:px-12 xl:px-16 max-w-[1580px] mx-auto w-full max-w-full min-w-0">
            
            {/* Top Area: Navigation, Statement, Social Links */}
            <div className="w-full flex flex-col items-center">
              
              {/* Minimal Top Navigation */}
              <div
                className={`w-full flex items-center justify-center gap-6 lg:gap-12 transition-all duration-1000 ease-out ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                }`}
              >
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#EAD5B8]/30 to-[#EAD5B8]/60 max-w-[140px] lg:max-w-[280px]" />

                <nav className="flex items-center gap-8 lg:gap-14 text-[11px] lg:text-[12px] tracking-[0.32em] text-[#FBF6EE] uppercase font-serif drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">
                  {navLinks.map((item, i) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="group relative py-1 hover:text-[#EAD5B8]"
                      style={{
                        opacity: inView ? 1 : 0,
                        transform: inView ? "translateY(0)" : "translateY(-10px)",
                        transition: `opacity 800ms ease-out ${250 + i * 110}ms, transform 900ms cubic-bezier(0.16, 1, 0.3, 1) ${250 + i * 110}ms, color 300ms`,
                      }}
                    >
                      <span>{item.label}</span>
                      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#EAD5B8] transition-all duration-300 ease-out group-hover:w-full" />
                    </Link>
                  ))}
                </nav>

                <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#EAD5B8]/30 to-[#EAD5B8]/60 max-w-[140px] lg:max-w-[280px]" />
              </div>

              {/* Tagline & Brand Philosophy */}
              <div
                className={`flex flex-col items-center text-center mt-3 lg:mt-4 transition-all duration-1000 delay-150 ease-out ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                }`}
              >
                <p className="font-serif text-[10.5px] lg:text-[11.5px] tracking-[0.36em] text-[#F3DFC1] uppercase font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  ARTISANAL LIVING, TIMELESS STORIES
                </p>

                <p className="mt-1.5 font-serif text-[12px] lg:text-[13.5px] text-[#FBF6EE]/90 max-w-[520px] leading-relaxed tracking-[0.015em] font-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                  Curated pieces, thoughtful details, and timeless objects for a more beautiful, slower way of living.
                </p>

                {/* Minimal Social Links */}
                <div className="mt-2.5 lg:mt-3 flex items-center justify-center gap-5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.75)]">
                  <SocialIcons inView={inView} />
                </div>
              </div>

            </div>

            {/* Bottom Area: Massive Wordmark + Colophon */}
            <div className="w-full max-w-full min-w-0 flex flex-col items-center overflow-hidden">
              
              {/* THE GRAND FINALE: MASSIVE MAISON D'VINE WORDMARK */}
              <div
                className={`w-full max-w-full min-w-0 text-center overflow-hidden transition-all duration-1000 delay-300 ease-out select-none cursor-default py-1 ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{
                  WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 35%, rgba(0,0,0,0) 100%)",
                  maskImage: "linear-gradient(to bottom, #000 0%, #000 35%, rgba(0,0,0,0) 100%)",
                }}
              >
                <Wordmark
                  inView={inView}
                  lineHeight={0.95}
                  className="w-full max-w-full font-serif font-normal uppercase text-[#FAF4E8] text-center tracking-[-0.03em] text-[clamp(2.5rem,10.2vw,14rem)]"
                />
              </div>

              {/* Bottom Copyright & Legal Line */}
              <div className="w-full mt-1.5 lg:mt-2.5 pt-2.5 lg:pt-3 border-t border-[#F3DFC1]/25 grid grid-cols-[1fr_auto_1fr] items-center text-[10px] lg:text-[10.5px] tracking-[0.2em] uppercase font-serif text-[#FBF6EE]/80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
                <div className="justify-self-start">
                  &copy; 2026 MAISON D’VINE
                </div>

                <div className="flex items-center gap-5 lg:gap-8 text-[#FBF6EE]/90">
                  <a href="#privacy" className="hover:text-[#F3DFC1] transition-colors duration-200">
                    Terms
                  </a>
                  <span className="text-[#F3DFC1]/40">&bull;</span>
                  <a href="#privacy" className="hover:text-[#F3DFC1] transition-colors duration-200">
                    Privacy
                  </a>
                  <span className="text-[#F3DFC1]/40">&bull;</span>
                  <a href="#privacy" className="hover:text-[#F3DFC1] transition-colors duration-200">
                    Cookies
                  </a>
                </div>

                <div className="flex items-center justify-self-end gap-4">
                  <span>All rights reserved.</span>
                  <BackToTop />
                </div>
              </div>

              {/* Studio credit */}
              <div className="mt-3 lg:mt-4 flex items-center justify-center gap-3 font-serif text-[9px] lg:text-[10px] tracking-[0.34em] uppercase text-[#F3DFC1]/70 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
                <span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-transparent to-[#F3DFC1]/50" />
                <span>
                  Designed &amp; crafted by <span className="font-medium text-[#F3DFC1]">Angaar Labs</span>
                </span>
                <span aria-hidden="true" className="h-px w-8 bg-gradient-to-l from-transparent to-[#F3DFC1]/50" />
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ========================================================
          2. MOBILE VIEW (< 768px)
          - The Tuscan terrace stays the backdrop (panning domes -> sun with the scroll)
          - Scroll-scrubbed reveals, two-line wordmark
          ======================================================== */}
      <div className="md:hidden">
        <FooterMobile navLinks={navLinks} social={<SocialIcons inView />} backToTop={<BackToTop />} />
      </div>
    </footer>
  );
};

/* ==============================================================
   Minimal, Monochrome Luxury Social Icons
   (Instagram, Pinterest, YouTube, Email)
   With subtle hover elevation animation
   ============================================================== */
const SocialIcons: React.FC<{ inView?: boolean }> = ({ inView = true }) => {
  const pop = (i: number): React.CSSProperties => {
    const d = 900 + i * 100;
    return {
      opacity: inView ? 1 : 0,
      transform: inView ? "scale(1)" : "scale(0.4)",
      transition: `opacity 600ms ease-out ${d}ms, transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1) ${d}ms, color 300ms, translate 300ms`,
    };
  };
  return (
    <div className="flex items-center gap-4">
      {/* Instagram */}
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="text-[#FBF6EE]/80 hover:text-[#F3DFC1] transition-all duration-300 hover:-translate-y-0.5 p-1"
        style={pop(0)}
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      </a>

      {/* Pinterest */}
      <a
        href="https://pinterest.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Pinterest"
        className="text-[#FBF6EE]/80 hover:text-[#F3DFC1] transition-all duration-300 hover:-translate-y-0.5 p-1"
        style={pop(1)}
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.1-1.8.1-2.6l1.3-5.4s-.3-.6-.3-1.6c0-1.5.9-2.6 2-2.6.9 0 1.4.7 1.4 1.5 0 1-.6 2.4-.9 3.7-.3 1.1.6 2 1.6 2 2 0 3.3-2.5 3.3-5.5 0-2.3-1.6-4-4.3-4-3.1 0-5 2.3-5 4.8 0 .9.3 1.5.8 2 .1.1.1.2.1.3l-.3 1.2c0 .2-.2.3-.4.2-1.3-.6-1.9-2.2-1.9-3.6 0-2.7 2.3-5.9 6.8-5.9 3.6 0 6 2.6 6 5.4 0 3.8-2.1 6.5-5.2 6.5-1 0-2-.6-2.3-1.2l-.6 2.5c-.2.9-.8 2-1.2 2.7A10 10 0 1 0 12 2z" />
        </svg>
      </a>

      {/* YouTube */}
      <a
        href="https://youtube.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="YouTube"
        className="text-[#FBF6EE]/80 hover:text-[#F3DFC1] transition-all duration-300 hover:-translate-y-0.5 p-1"
        style={pop(2)}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
        </svg>
      </a>

      {/* Email */}
      <a
        href="mailto:concierge@maisondvine.com"
        aria-label="Email Concierge"
        className="text-[#FBF6EE]/80 hover:text-[#F3DFC1] transition-all duration-300 hover:-translate-y-0.5 p-1"
        style={pop(3)}
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </a>
    </div>
  );
};

export default Footer;
