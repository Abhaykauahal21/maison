"use client";

import React, { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { ArrowRight, Eye } from "lucide-react";

export interface EchoCardProps {
  title: string;
  descLines: [string, string];
  imageSrc: string;
  imageAlt: string;
  objectPosition?: string;
  className?: string;
  onClick?: () => void;
  variant?: "vertical" | "horizontal";
  delayMs?: number;
  inView?: boolean;
}

export const EchoCard: React.FC<EchoCardProps> = ({
  title,
  descLines,
  imageSrc,
  imageAlt,
  objectPosition = "center",
  className = "",
  onClick,
  variant = "vertical",
  delayMs = 0,
  inView = true,
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
        className={`group flex h-full w-full cursor-pointer items-center justify-between gap-3 text-left select-none transition-all duration-300 active:scale-[0.98] ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        } ${className}`}
        style={{
          transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
        }}
      >
        {/* Left: Portrait Image Card with smooth hover zoom */}
        <div className="relative h-full aspect-[0.82/1] flex-shrink-0 overflow-hidden bg-[#e0d6c8] shadow-sm rounded-[1px]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            loading="lazy"
            unoptimized
            sizes="160px"
            style={{ objectPosition }}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
        </div>

        {/* Middle: Title & 2-Line Poetic Caption */}
        <div className="flex flex-1 flex-col justify-center min-w-0 pl-2.5 xs:pl-3.5 pr-2">
          <h3 className="font-bodoni text-[15px] xs:text-[17px] sm:text-[19px] font-normal tracking-[0.16em] text-[#1a140e] uppercase transition-colors group-hover:text-black">
            {title}
          </h3>
          <p className="mt-1 font-serif text-[12px] xs:text-[13.5px] sm:text-[15px] leading-[1.3] tracking-wide text-[#554739] italic transition-colors group-hover:text-[#2c2217]">
            <span>{descLines[0]}</span>
            <br />
            <span>{descLines[1]}</span>
          </p>
        </div>

        {/* Right: Circular Arrow Action with hover transition */}
        <div className="flex h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#3a3026]/40 text-[#3a3026] transition-all duration-300 group-hover:scale-110 group-hover:border-[#1a140e] group-hover:bg-[#1a140e] group-hover:text-white group-hover:-rotate-45">
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

      {/* 2. Title & Action Row */}
      <div className="mt-3.5 flex items-center justify-between">
        <h3 className="font-bodoni text-xs font-normal tracking-[0.2em] text-[#1a140e] uppercase transition-colors duration-300 group-hover:text-black sm:text-sm lg:text-[0.95vw]">
          {title}
        </h3>
        <div className="flex h-5 w-5 sm:h-6 sm:w-6 lg:h-[1.55vw] lg:w-[1.55vw] items-center justify-center rounded-full border border-[#3a3026]/50 text-[#3a3026] transition-all duration-300 group-hover:scale-115 group-hover:border-[#1a140e] group-hover:bg-[#1a140e] group-hover:text-white group-hover:-rotate-45">
          <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-[0.78vw] lg:w-[0.78vw] stroke-[1.4]" />
        </div>
      </div>

      {/* 3. Poetic Caption (2 lines) */}
      <p className="mt-1 font-serif text-[11px] sm:text-xs lg:text-[0.72vw] leading-tight tracking-wide text-[#554739] italic transition-colors duration-300 group-hover:text-[#2a2016]">
        {descLines[0]}
        <br />
        {descLines[1]}
      </p>
    </article>
  );
};
