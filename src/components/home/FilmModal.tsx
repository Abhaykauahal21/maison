"use client";

import React, { useEffect, useState } from "react";
import { X, Volume2, VolumeX, Play, Pause } from "lucide-react";

interface FilmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FilmModal: React.FC<FilmModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      {/* Dark luxury blurred backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-500"
        onClick={onClose}
      />

      {/* Cinematic Modal Window */}
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-sm border border-[#3a3228] bg-[#0c0b0a] shadow-[0_25px_60px_rgba(0,0,0,0.85)] animate-fade-in-up">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-[#24201b] px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#d4af37] animate-pulse" />
            <span className="font-bodoni text-xs uppercase tracking-[0.25em] text-[#e8ded4]">
              MAISON D&apos;VINE CINEMA
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/20 text-white/70 transition-all duration-200 hover:border-white hover:bg-white/10 hover:text-white"
            aria-label="Close film"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Video / Cinema Player Screen */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
          {/* Cinematic Fashion Reel Background Video */}
          <video
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="h-full w-full object-cover"
            src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-an-avant-garde-gown-42171-large.mp4"
            poster="/images/hero.webp"
          />

          {/* Film Grain & Vignette Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* Film Title Watermark */}
          <div className="pointer-events-none absolute top-6 left-6 z-10">
            <p className="font-bodoni text-xs tracking-[0.3em] text-white/60 uppercase">
              AUTUMN / WINTER 2026
            </p>
            <h3 className="font-bodoni text-lg text-white/95">
              Not Just Dresses, But Stories
            </h3>
          </div>

          {/* Controls Bar */}
          <div className="absolute right-0 bottom-0 left-0 z-20 flex items-center justify-between bg-gradient-to-t from-black/90 to-transparent px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="cursor-pointer text-white/80 transition-colors hover:text-white"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="cursor-pointer text-white/80 transition-colors hover:text-white"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <span className="font-mono text-[11px] tracking-wider text-white/60">
                00:48 / 02:15
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="font-sans text-[10px] tracking-widest text-white/60 uppercase">
                4K REMASTERED
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Editorial Caption */}
        <div className="border-t border-[#24201b] bg-[#110f0d] px-6 py-3 text-center sm:text-left">
          <p className="font-sans text-[12px] text-[#b3a89b] italic">
            &ldquo;Every seam holds a memory, every fold carries a promise.&rdquo; — Maison D&apos;Vine Atelier, Paris
          </p>
        </div>
      </div>
    </div>
  );
};
