"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Sparkles, Check } from "lucide-react";

export interface EchoItem {
  title: string;
  subtitle: string;
  descLines: [string, string];
  fullStory: string;
  fabric: string;
  silhouette: string;
  imageSrc: string;
  imageAlt: string;
}

export const echoDetails: EchoItem[] = [
  {
    title: "SOLACE",
    subtitle: "Look 01 · The Solace Gown",
    descLines: ["For the moments", "she finds herself."],
    fullStory:
      "Crafted from ethereal hand-printed floral silk organza, Solace embodies the quiet sanctuary of self-discovery. Draped organically in our Parisian atelier, each layer mimics the whisper of morning petals unfolding at dawn.",
    fabric: "100% Hand-woven Silk Organza & French Gossamer Tulle",
    silhouette: "Asymmetrical Draped Column with Trailing Watteau Pleat",
    imageSrc: "/images/solace.webp",
    imageAlt: "Maison D'Vine Solace Gown in Floral Silk",
  },
  {
    title: "LONGING",
    subtitle: "Look 02 · The Longing Gown",
    descLines: ["For what lives", "between hearts."],
    fullStory:
      "A dramatic exploration of desire and restraint. Constructed from sculpted crimson micro-tulle, Longing features thousands of hand-gathered pleats that cascade into a voluminous, breathless train of raw romance.",
    fabric: "Crimson Architectural Tulle with Silk Charmeuse Corsetry",
    silhouette: "Structured Sweetheart Bodice with Architectural Flounce",
    imageSrc: "/images/longing.webp",
    imageAlt: "Maison D'Vine Longing Gown in Crimson Tulle",
  },
  {
    title: "REVERIE",
    subtitle: "Look 03 · The Reverie Gown",
    descLines: ["For the dreams", "she doesn't say out loud."],
    fullStory:
      "Reverie is woven in midnight noir duchess satin with discreet antique gold corded lacework. An homage to nocturnal introspection, its clean, sovereign lines speak of unyielding inner grace.",
    fabric: "Noir Duchess Silk Satin & Antique Gold Filigree Lace",
    silhouette: "Bias-Cut Noir Column with Open Back & Sculpted Train",
    imageSrc: "/images/reverie.webp",
    imageAlt: "Maison D'Vine Reverie Gown in Noir Satin",
  },
];

interface EchoModalProps {
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export const EchoModal: React.FC<EchoModalProps> = ({
  initialIndex,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [inquired, setInquired] = useState(false);

  // Reset to the requested look when a different one is opened (adjusting state during render,
  // the React-recommended way to derive state from a prop, instead of an effect)
  const [prevInitial, setPrevInitial] = useState(initialIndex);
  if (prevInitial !== initialIndex) {
    setPrevInitial(initialIndex);
    setCurrentIndex(initialIndex);
    setInquired(false);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev + 1) % echoDetails.length);
        setInquired(false);
      }
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev - 1 + echoDetails.length) % echoDetails.length);
        setInquired(false);
      }
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

  const currentItem = echoDetails[currentIndex] || echoDetails[0];

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      {/* Blurred dark luxury parchment backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2px] border border-[#4a3e33]/50 bg-[#161310] text-[#f4efe8] shadow-[0_25px_60px_rgba(0,0,0,0.85)] animate-fade-in-up md:flex-row">
        {/* Top Close Button for Mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/40 text-white transition-all hover:bg-white/20"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left Column: Image with Subtle Ken Burns / Zoom */}
        <div className="relative h-[320px] w-full flex-shrink-0 overflow-hidden bg-[#0d0c0b] sm:h-[380px] md:h-auto md:w-[48%]">
          <Image
            key={currentItem.imageSrc}
            src={currentItem.imageSrc}
            alt={currentItem.imageAlt}
            fill
            unoptimized
            priority
            className="object-cover transition-transform duration-700 ease-out hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#161310] via-transparent to-black/30 md:hidden" />

          {/* Navigation Overlay Arrows on Image */}
          <div className="absolute inset-x-3 bottom-3 flex justify-between md:hidden">
            <button
              onClick={() => {
                setCurrentIndex((prev) => (prev - 1 + echoDetails.length) % echoDetails.length);
                setInquired(false);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                setCurrentIndex((prev) => (prev + 1) % echoDetails.length);
                setInquired(false);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Right Column: Editorial Haute Couture Details */}
        <div className="flex flex-1 flex-col justify-between overflow-y-auto p-6 sm:p-8 md:p-10">
          <div>
            {/* Collection Marker */}
            <div className="flex items-center justify-between border-b border-[#3a3026]/40 pb-3">
              <span className="font-sans text-[10px] tracking-[0.3em] text-[#d6be9f] uppercase">
                CHAPTER 0 · THE ECHO
              </span>
              <span className="font-mono text-[11px] text-[#9a8d7e]">
                0{currentIndex + 1} / 0{echoDetails.length}
              </span>
            </div>

            {/* Title & Subtitle */}
            <h2 className="mt-5 font-bodoni text-3xl sm:text-4xl uppercase tracking-[0.1em] text-white">
              {currentItem.title}
            </h2>
            <p className="mt-1 font-serif text-sm italic text-[#cbbba9]">
              &ldquo;{currentItem.descLines[0]} {currentItem.descLines[1]}&rdquo;
            </p>

            {/* Narrative Story */}
            <p className="mt-4 font-sans text-[12.5px] sm:text-[13.5px] leading-[1.65] font-light text-[#dfd6cb]">
              {currentItem.fullStory}
            </p>

            {/* Atelier Specs */}
            <div className="mt-6 space-y-3 rounded-[1px] border border-[#3a3026]/40 bg-[#120f0c] p-4 text-[11.5px] text-[#b5a796]">
              <div>
                <span className="font-semibold text-[#e8ded4] uppercase tracking-wider block text-[10px]">
                  Fabric & Material
                </span>
                <span className="font-sans font-light">{currentItem.fabric}</span>
              </div>
              <div>
                <span className="font-semibold text-[#e8ded4] uppercase tracking-wider block text-[10px]">
                  Couture Silhouette
                </span>
                <span className="font-sans font-light">{currentItem.silhouette}</span>
              </div>
            </div>
          </div>

          {/* Action Row & Cycle Navigation */}
          <div className="mt-8 pt-4 border-t border-[#3a3026]/40 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setInquired(true)}
                disabled={inquired}
                className={`flex-1 flex cursor-pointer items-center justify-center gap-2 px-6 py-3 font-sans text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 ${
                  inquired
                    ? "bg-emerald-800/80 text-white cursor-default"
                    : "bg-[#e8ded4] text-[#14100c] hover:bg-white hover:scale-[1.01]"
                }`}
              >
                {inquired ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Inquiry Sent to Atelier</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Inquire Couture Piece</span>
                  </>
                )}
              </button>
            </div>

            {/* Desktop Navigation Arrows */}
            <div className="hidden md:flex items-center justify-between text-[11px] font-sans tracking-widest text-[#9a8d7e]">
              <button
                onClick={() => {
                  setCurrentIndex((prev) => (prev - 1 + echoDetails.length) % echoDetails.length);
                  setInquired(false);
                }}
                className="cursor-pointer transition-colors hover:text-white flex items-center gap-1.5"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> PREVIOUS LOOK
              </button>
              <button
                onClick={() => {
                  setCurrentIndex((prev) => (prev + 1) % echoDetails.length);
                  setInquired(false);
                }}
                className="cursor-pointer transition-colors hover:text-white flex items-center gap-1.5"
              >
                NEXT LOOK <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
