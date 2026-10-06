"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { MobileMenu } from "@/components/layout/MobileMenu";

/** Chapters of the page, in scroll order. `id` is the section's DOM id. */
const NAV_CHAPTERS = [
  { label: "The Echo", id: "story" },
  { label: "The Dream", id: "dream" },
  { label: "Stories", id: "whispers" },
  { label: "Journey", id: "journey" },
  { label: "Journal", id: "blog" },
];

/** Ragged torn-paper edge (viewBox 1200 x 24), same idea as the intro loader's cover. */
const tearPath = (seed: number, base: number, amp: number) => {
  let d = `M0 0 L1200 0 L1200 ${base}`;
  for (let x = 1200; x >= 0; x -= 8) {
    const n =
      (Math.sin(x * 0.013 + seed) * 0.5 +
        Math.sin(x * 0.041 + seed * 2) * 0.3 +
        Math.sin(x * 0.13 + seed * 3) * 0.14 +
        Math.sin(x * 0.36 + seed * 5) * 0.06 +
        1) /
      2;
    d += ` L${x} ${(base + amp * n).toFixed(1)}`;
  }
  return `${d} Z`;
};
const TEAR_FRONT = tearPath(5.6, 2, 10);

const TAPE_CLIP =
  "polygon(0 8%, 4% 0, 8% 10%, 12% 0, 92% 0, 96% 10%, 100% 0, 100% 92%, 96% 100%, 92% 90%, 88% 100%, 8% 100%, 4% 92%, 0 100%)";

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // Transparent over the hero; once the hero is scrolled past, a paper strip is lowered in
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Which chapter is on screen (shown in the menu)
  useEffect(() => {
    const els = NAV_CHAPTERS.map((c) => document.getElementById(c.id)).filter(
      (e): e is HTMLElement => !!e
    );
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const ink = scrolled ? "text-[#1c1815]" : "text-white";

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 w-full">
        {/* The paper strip: lowered into place (transform only), torn along the bottom */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: scrolled ? "translate3d(0,0,0)" : "translate3d(0,calc(-100% - 40px),0)" }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 140% at 50% 0%, #f8f2e6 0%, #f3ead9 55%, #ebdfc9 100%)",
            }}
          />
          <svg
            className="absolute left-0 w-full"
            style={{ top: "calc(100% - 1px)", height: 12 }}
            viewBox="0 0 1200 24"
            preserveAspectRatio="none"
          >
            <path d={TEAR_FRONT} fill="#f1e8d6" />
          </svg>
          {/* washi tape holding the strip up */}
          {[
            { side: "left-[2.5%]", rot: "-32deg" },
            { side: "right-[2.5%]", rot: "30deg" },
          ].map((t) => (
            <span
              key={t.side}
              className={`absolute -top-1 h-[11px] w-[40px] bg-[#d6c291]/85 shadow-[0_1px_2px_rgba(60,40,20,0.25)] ${t.side}`}
              style={{ transform: `rotate(${t.rot})`, clipPath: TAPE_CLIP }}
            />
          ))}
        </div>

        <div className="relative grid w-full grid-cols-[1fr_auto_1fr] items-center px-5 py-1.5 sm:px-8 lg:px-[4vw] lg:py-2">
          {/* LEFT: menu */}
          <div className="flex items-center justify-start">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open Menu"
              aria-haspopup="dialog"
              className={`font-allura allura-regular font-script font-cursive -ml-2 flex cursor-pointer items-center gap-2.5 p-2 text-[19px] leading-none transition-colors duration-500 hover:opacity-70 focus-visible:ring-1 focus-visible:ring-current focus-visible:outline-none ${ink}`}
              style={{ textShadow: scrolled ? "none" : "0 1px 10px rgba(0,0,0,0.45)" }}
            >
              <span className="flex w-5 flex-col gap-[5px]" aria-hidden="true">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-3/4 bg-current" />
              </span>
              <span className="hidden sm:block">Menu</span>
            </button>
          </div>

          {/* CENTER: wordmark, written in by hand once the intro loader lifts */}
          <Link
            href="/"
            aria-label="Maison D'Vine, home"
            className={`nav-ink font-allura allura-regular font-script font-cursive block px-2 text-[26px] leading-[1.1] whitespace-nowrap select-none transition-colors duration-500 sm:text-[30px] lg:text-[34px] ${ink}`}
            style={{ textShadow: scrolled ? "none" : "0 1px 14px rgba(0,0,0,0.5)" }}
          >
            Maison D&rsquo;Vine
          </Link>

          {/* RIGHT: search + bag */}
          <div className={`flex items-center justify-end gap-1 sm:gap-3 ${ink} transition-colors duration-500`}>
            <IconButton
              icon={<Search className="h-[16px] w-[16px] stroke-[1.3]" />}
              label="Search"
              className={scrolled ? "text-[#1c1815]!" : ""}
            />
            <div className="flex items-center gap-1">
              <IconButton
                icon={<ShoppingBag className="h-[16px] w-[16px] stroke-[1.3]" />}
                label="Shopping Cart"
                className={`-mr-1 sm:mr-0 ${scrolled ? "text-[#1c1815]!" : ""}`}
              />
              <span className="hidden text-[12px] font-light select-none sm:inline">(0)</span>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={NAV_CHAPTERS.map((c) => ({ label: c.label, href: `#${c.id}`, id: c.id }))}
        active={active}
      />
    </>
  );
};
