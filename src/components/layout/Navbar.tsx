"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Menu } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { MobileMenu } from "@/components/layout/MobileMenu";

const navLinks = [
  { label: "The Story", href: "#story" },
  { label: "Collections", href: "#collections" },
  { label: "Journal", href: "#journal" },
  { label: "About", href: "#about" },
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // While EditorialSection freezes the page (body { position: fixed; top: -Ypx }),
      // window.scrollY reads 0; the real offset lives in body.style.top.
      const lockedY = Math.abs(parseFloat(document.body.style.top || "0")) || 0;
      setIsScrolled(Math.max(window.scrollY, lockedY) > 25);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 z-50 w-full transition-all duration-300 ease-out ${
          isScrolled
            ? "bg-[#0e0d0c]/40 backdrop-blur-md border-b border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.25)] py-3 sm:py-3.5"
            : "bg-transparent py-5 sm:py-6 lg:py-7 border-b border-transparent"
        }`}
      >
        <div className="flex w-full items-center justify-between px-6 sm:px-8 lg:px-[6.2vw]">
          {/* LEFT: Elegant Wordmark Logo */}
          <div className="flex-1 text-left">
            <Link
              href="/"
              className="inline-block font-bodoni text-[15px] sm:text-[16px] md:text-[17px] lg:text-[17.5px] font-normal tracking-[0.24em] text-white uppercase transition-opacity select-none hover:opacity-85"
            >
              MAISON D&apos;VINE
            </Link>
          </div>

          {/* CENTER: Refined Navigation Links - Desktop Only (1025px+) */}
          <nav
            className="hidden items-center justify-center gap-7 sm:gap-9 lg:gap-11 text-[13px] font-sans font-light tracking-[0.05em] text-white/90 lg:flex"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative py-1 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:text-white hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex flex-1 items-center justify-end gap-3 text-white sm:gap-4 lg:gap-5">
            {/* Search - Hidden on small mobile, visible on tablet & desktop */}
            <div className="hidden sm:block">
              <IconButton
                icon={<Search className="h-[17px] w-[17px] stroke-[1.3]" />}
                label="Search"
              />
            </div>

            {/* Shopping Bag with Cart Count - Hidden on small mobile, visible on tablet & desktop */}
            <div className="hidden sm:flex items-center gap-1">
              <IconButton
                icon={<ShoppingBag className="h-[17px] w-[17px] stroke-[1.3]" />}
                label="Shopping Cart"
              />
              <span className="font-sans text-[12px] font-light tracking-tight text-white/90 select-none">
                (0)
              </span>
            </div>

            {/* Hamburger Menu Icon - Always visible */}
            <IconButton
              icon={<Menu className="h-5 w-5 stroke-[1.3]" />}
              label="Open Menu"
              onClick={() => setMobileMenuOpen(true)}
            />
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={navLinks}
      />
    </>
  );
};
