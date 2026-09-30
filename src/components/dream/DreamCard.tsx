"use client";

import React, { useRef, useState, useCallback } from "react";
import Image from "next/image";

export interface DreamCardProps {
  titleLines: [string, string];
  descriptionLines: [string, string];
  ctaText?: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
  onClick?: () => void;
  inView?: boolean;
  delayMs?: number;
}

export const DreamCard: React.FC<DreamCardProps> = ({
  titleLines,
  descriptionLines,
  ctaText = "VIEW DETAILS",
  imageSrc,
  imageAlt,
  className = "",
  onClick,
  inView = true,
  delayMs = 0,
}) => {
  const cardRef = useRef<HTMLElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, isHovered: false });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltX = (y / rect.height - 0.5) * -8;
    const tiltY = (x / rect.width - 0.5) * 8;

    setTilt({ x: tiltX, y: tiltY, isHovered: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0, isHovered: false });
  }, []);

  return (
    <article
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative flex cursor-pointer flex-col justify-end overflow-hidden border border-white/20 bg-[#12100e] text-left select-none will-change-transform ${className}`}
      style={{
        // Curtain reveal: the card unveils bottom -> top
        clipPath: inView ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
        transform: tilt.isHovered
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`
          : "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)",
        transition: `clip-path 1400ms cubic-bezier(0.77, 0, 0.175, 1) ${delayMs}ms, ${
          tilt.isHovered
            ? "transform 0.15s ease-out, border-color 0.3s ease"
            : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease"
        }`,
      }}
    >
      {/* Background Image inside card - object-cover with smooth zoom */}
      <div
        className="absolute inset-0 z-0"
        style={{
          transform: inView ? "scale(1)" : "scale(1.3)",
          transition: `transform 1900ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
        }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          loading="lazy"
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 20vw"
          className="pointer-events-none object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />
      </div>

      {/* Cinematic dark bottom gradient */}
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/50 via-45% to-transparent transition-opacity duration-300 group-hover:opacity-90"
        aria-hidden="true"
      />

      {/* Card Content Overlay */}
      <div
        className="relative z-20 flex flex-col justify-end p-3 sm:p-5 lg:p-3.5 xl:p-4.5"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(14px)",
          transition: `opacity 900ms ease-out ${delayMs + 850}ms, transform 900ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs + 850}ms`,
        }}
      >
        {/* Title: 2 lines */}
        <div className="font-serif text-sm sm:text-base lg:text-[0.98vw] font-normal leading-[1.22] tracking-[0.14em] text-white uppercase transition-colors group-hover:text-white">
          <div>{titleLines[0]}</div>
          <div>{titleLines[1]}</div>
        </div>

        {/* Poetic Description: 2 lines */}
        <p className="mt-1.5 sm:mt-2.5 font-serif text-[10.5px] sm:text-xs lg:text-[0.68vw] leading-[1.48] tracking-wide text-[#d4cbbf] italic transition-colors group-hover:text-white">
          {descriptionLines[0]}
          <br />
          {descriptionLines[1]}
        </p>

        {/* CTA: VIEW DETAILS → */}
        <div className="mt-2.5 sm:mt-3.5 flex items-center space-x-1.5 text-[8.5px] sm:text-[10px] lg:text-[0.62vw] font-sans font-medium tracking-[0.2em] text-[#f2e7db] uppercase transition-colors group-hover:text-white">
          <span>{ctaText}</span>
          <span className="text-xs lg:text-[0.72vw] transition-transform duration-300 group-hover:translate-x-1.5">
            →
          </span>
        </div>
      </div>
    </article>
  );
};
