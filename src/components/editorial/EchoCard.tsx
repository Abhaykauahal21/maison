"use client";

import React, { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { ArrowRight, Eye } from "lucide-react";

export interface EchoCardProps {
  title: string;
  descLines: [string, string];
  /** Short fabric / mood descriptor, e.g. "Floral Silk · Dawn". */
  tag?: string;
  /** 1-based look number shown as "LOOK 01". */
  index?: number;
  imageSrc: string;
  imageAlt: string;
  objectPosition?: string;
  className?: string;
  onClick?: () => void;
  variant?: "vertical" | "horizontal";
  delayMs?: number;
  inView?: boolean;
  /** Horizontal (mobile) variant only: highlighted/expanded state. */
  active?: boolean;
}

export const EchoCard: React.FC<EchoCardProps> = ({
  title,
  descLines,
  tag,
  index,
  imageSrc,
  imageAlt,
  objectPosition = "center",
  className = "",
  onClick,
  variant = "vertical",
  delayMs = 0,
  inView = true,
  active = true,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, isHovered: false });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Subtle tilt: max ~6 degrees
    const tiltX = (y / rect.height - 0.5) * -10;
    const tiltY = (x / rect.width - 0.5) * 10;

    setTilt({ x: tiltX, y: tiltY, isHovered: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0, isHovered: false });
  }, []);

  if (variant === "horizontal") {
    return (
      <article
        onClick={onClick}
        className={`group relative flex h-full w-full cursor-pointer items-center justify-between gap-3 overflow-hidden rounded-[2px] p-1.5 text-left select-none active:scale-[0.98] ${
          active
            ? "bg-[#fbf5ea]/55 shadow-[0_10px_26px_rgba(40,28,16,0.16)]"
            : "bg-transparent"
        } ${className}`}
        style={{
          opacity: active ? 1 : 0.62,
          transition:
            "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.6s ease, box-shadow 0.6s ease, transform 0.3s ease",
        }}
      >
        {/* Left: Portrait image, brightens + settles when active */}
        <div className="relative h-full aspect-[0.82/1] flex-shrink-0 overflow-hidden bg-[#e0d6c8] shadow-sm rounded-[1px]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            loading="lazy"
            unoptimized
            sizes="160px"
            style={{
              objectPosition,
              transform: active ? "scale(1)" : "scale(1.12)",
              filter: active ? "saturate(1)" : "saturate(0.55)",
              transition:
                "transform 1s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease",
            }}
            className="object-cover"
          />
          {active && (
            <div
              key="shine"
              className="animate-echo-rise pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent"
            />
          )}
        </div>

        {/* Middle: Title always; poetic caption unfolds when active */}
        <div className="flex min-w-0 flex-1 flex-col justify-center pl-1 pr-1">
          <h3
            className="font-bodoni text-[15px] xs:text-[17px] sm:text-[19px] font-normal uppercase text-[#1a140e]"
            style={{
              letterSpacing: active ? "0.2em" : "0.14em",
              transition: "letter-spacing 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {title}
          </h3>
          <div
            className="grid"
            style={{
              gridTemplateRows: active ? "1fr" : "0fr",
              opacity: active ? 1 : 0,
              transition:
                "grid-template-rows 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease 0.1s",
            }}
          >
            <p className="overflow-hidden font-serif text-[12px] xs:text-[13.5px] sm:text-[15px] leading-[1.3] tracking-wide text-[#554739] italic">
              <span className="mt-1 block">{descLines[0]}</span>
              <span className="block">{descLines[1]}</span>
              {tag && (
                <span className="mt-1.5 block font-sans text-[9px] xs:text-[10px] not-italic uppercase tracking-[0.22em] text-[#8a7559]">
                  {tag}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right: Circular arrow, fills in when active */}
        <div
          className={`mr-1 flex h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
            active
              ? "border-[#1a140e] bg-[#1a140e] text-[#f4efe8] -rotate-45"
              : "border-[#3a3026]/40 text-[#3a3026]"
          }`}
        >
          <ArrowRight className="h-3.5 w-3.5 xs:h-4 xs:w-4 stroke-[1.4]" />
        </div>
      </article>
    );
  }

  // DESKTOP VERTICAL EDITORIAL CARD WITH 3D TILT & HOVER REVEAL
  return (
    <article
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative flex cursor-pointer flex-col text-left select-none will-change-transform ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      } ${className}`}
      style={{
        transform: tilt.isHovered
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`
          : "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)",
        transition: tilt.isHovered
          ? "transform 0.15s ease-out"
          : `opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
      }}
    >
      {/* 1. Portrait Image Container - aspect 0.68 / 1 */}
      <div className="relative aspect-[0.68/1] w-full overflow-hidden rounded-[1px] bg-[#e0d6c8] shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow duration-500 group-hover:shadow-[0_16px_32px_rgba(30,24,18,0.18)]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          loading="lazy"
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 30vw, 240px"
          style={{ objectPosition }}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Hover Pill: "QUICK LOOK" */}
        <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 translate-y-3 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/60 px-3.5 py-1 text-[9.5px] font-sans font-medium tracking-[0.2em] text-white uppercase backdrop-blur-xs shadow-md">
            <Eye className="h-3 w-3" />
            <span>DISCOVER</span>
          </span>
        </div>
      </div>

      {/* 2. Look label + Title & Action Row */}
      <div className="mt-4 flex items-end justify-between gap-2">
        <div className="min-w-0">
          {index !== undefined && (
            <span className="mb-1 block font-sans text-[9px] font-medium tracking-[0.3em] text-[#8a7559] sm:text-[10px] lg:text-[0.6vw]">
              LOOK {String(index).padStart(2, "0")}
            </span>
          )}
          <h3 className="font-bodoni text-sm font-normal uppercase leading-none tracking-[0.2em] text-[#1a140e] transition-colors duration-300 group-hover:text-black sm:text-base lg:text-[1.1vw]">
            {title}
          </h3>
        </div>
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#3a3026]/50 text-[#3a3026] transition-all duration-300 group-hover:scale-110 group-hover:border-[#1a140e] group-hover:bg-[#1a140e] group-hover:text-white group-hover:-rotate-45 sm:h-7 sm:w-7 lg:h-[1.8vw] lg:w-[1.8vw]">
          <ArrowRight className="h-3 w-3 stroke-[1.4] lg:h-[0.9vw] lg:w-[0.9vw]" />
        </div>
      </div>

      {/* Hairline that draws out on hover */}
      <div className="mt-3 h-px w-full bg-[#3a3026]/15">
        <div className="h-full w-6 bg-[#8a7559] transition-all duration-700 ease-out group-hover:w-full" />
      </div>

      {/* 3. Poetic caption + fabric tag */}
      <p className="mt-2.5 font-serif text-xs italic leading-[1.45] tracking-wide text-[#463a2d] transition-colors duration-300 group-hover:text-[#2a2016] sm:text-[13px] lg:text-[0.86vw]">
        {descLines[0]}
        <br />
        {descLines[1]}
      </p>
      {tag && (
        <span className="mt-2 block pb-1 font-sans text-[9px] uppercase tracking-[0.24em] text-[#8a7559] sm:text-[10px] lg:text-[0.6vw]">
          {tag}
        </span>
      )}
    </article>
  );
};
