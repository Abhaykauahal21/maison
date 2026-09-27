"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, links }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex flex-col justify-between bg-[#0e0d0c]/95 px-8 py-10 text-white backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <span className="font-serif text-sm tracking-[0.25em] text-white/90 uppercase">
          MAISON D&apos;VINE
        </span>
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-white/80 transition-colors hover:text-white"
          aria-label="Close Menu"
        >
          <X className="h-6 w-6 stroke-[1.5]" />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="my-auto flex flex-col space-y-8 text-center">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={onClose}
            className="transform font-serif text-3xl tracking-widest text-white/90 transition-colors duration-300 hover:scale-105 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="border-t border-white/10 pt-6 text-center">
        <p className="text-[11px] tracking-[0.25em] text-white/50 uppercase">
          Haute Couture &amp; Fine Apparel
        </p>
      </div>
    </div>
  );
};
