"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useUiStore } from "@/store/ui-store";
import { navigationConfig } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { X, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const MobileNavigation: React.FC = () => {
  const { isMobileNavOpen, setMobileNavOpen } = useUiStore();

  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileNavOpen]);

  if (!isMobileNavOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="animate-in fade-in fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setMobileNavOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-out Drawer */}
      <div className="animate-in slide-in-from-right fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col bg-white p-6 shadow-xl duration-300">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-6">
          <div className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white">
              <Layers className="h-4 w-4" />
            </span>
            <span>{siteConfig.name}</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 py-6">
          {navigationConfig.mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium text-zinc-800 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
            >
              <span>{item.title}</span>
              {item.badge && (
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="space-y-3 border-t border-zinc-100 pt-6">
          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              setMobileNavOpen(false);
              const contactEl = document.getElementById("contact");
              contactEl?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Get In Touch
          </Button>
          <p className="text-center text-xs text-zinc-400">Frontend Architecture v0.1.0</p>
        </div>
      </div>
    </div>
  );
};
