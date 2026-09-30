"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { getLenis, smoothScrollTo } from "@/lib/smooth-scroll";

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { label: string; href: string; id: string }[];
  active?: string | null;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, links, active }) => {
  const router = useRouter();

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

  if (!isOpen) return null;

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    onClose();
    // let the page unfreeze first, then glide
    window.setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) router.push(`/#${id}`);
      else smoothScrollTo(el, 1.6);
    }, 60);
  };

  return (
    <div
      className="nav-menu-in fixed inset-0 z-[60] flex flex-col justify-between bg-[#0c0b0a] px-7 py-7 text-white sm:px-12"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
    >
      {/* warm glow, purely decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[10%] -right-[25%] h-[60%] w-[90%]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(230,201,143,0.16), transparent 100%)",
        }}
      />

      {/* Top bar */}
      <div className="relative flex items-center justify-between border-b border-white/10 pb-5">
        <span className="font-bodoni text-sm tracking-[0.25em] text-white/90 uppercase">
          MAISON D&apos;VINE
        </span>
        <button
          type="button"
          onClick={onClose}
          className="-mr-2 p-2 text-white/80 transition-colors hover:text-white"
          aria-label="Close Menu"
        >
          <X className="h-6 w-6 stroke-[1.3]" />
        </button>
      </div>

      {/* Chapters */}
      <nav className="relative my-auto flex flex-col" aria-label="Chapters">
        {links.map((link, i) => {
          const isActive = active === link.id;
          return (
            <a
              key={link.id}
              href={link.href}
              onClick={(e) => go(e, link.id)}
              className="nav-link-rise group flex items-baseline gap-5 border-b border-white/[0.08] py-4 sm:py-5"
              style={{ animationDelay: `${0.12 + i * 0.07}s` }}
            >
              <span
                className={`w-7 text-[11px] tracking-[0.2em] transition-colors ${
                  isActive ? "text-[#e6c98f]" : "text-white/35"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`font-serif text-[30px] leading-none tracking-[0.04em] transition-all duration-300 sm:text-4xl ${
                  isActive
                    ? "text-[#f3dfb6] italic"
                    : "text-white/90 group-active:translate-x-1.5 group-active:text-white"
                }`}
              >
                {link.label}
              </span>
              <span
                aria-hidden="true"
                className="ml-auto text-lg text-[#e6c98f]/70 transition-transform duration-300 group-active:translate-x-1"
              >
                &rarr;
              </span>
            </a>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="nav-link-rise relative flex flex-col gap-4 border-t border-white/10 pt-5"
        style={{ animationDelay: `${0.12 + links.length * 0.07}s` }}
      >
        <a
          href="#closer"
          onClick={(e) => go(e, "closer")}
          className="flex items-center justify-between border border-[#e6c98f]/60 px-5 py-3 text-[11px] tracking-[0.22em] text-[#f3dfb6] uppercase active:bg-[#e6c98f] active:text-[#14100c]"
        >
          <span>Join the Archive</span>
          <span aria-hidden="true">&rarr;</span>
        </a>
        <p className="text-center text-[10.5px] tracking-[0.25em] text-white/45 uppercase">
          Not just dresses, but stories
        </p>
      </div>
    </div>
  );
};
