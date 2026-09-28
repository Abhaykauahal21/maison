"use client";

import React from "react";
import Image from "next/image";

export interface DreamCardProps {
  titleLines: [string, string];
  descriptionLines: [string, string];
  ctaText?: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
  onClick?: () => void;
}

export const DreamCard: React.FC<DreamCardProps> = ({
  titleLines,
  descriptionLines,
  ctaText = "VIEW DETAILS",
  imageSrc,
  imageAlt,
  className = "",
  onClick,
}) => {
  return (
    <article
      onClick={onClick}
      className={`group relative flex cursor-pointer flex-col justify-end overflow-hidden border border-white/20 bg-[#12100e] text-left transition-all duration-500 hover:border-white/45 ${className}`}
    >
      {/* Background Image inside card - object-cover */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          loading="lazy"
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 20vw"
          className="pointer-events-none object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* Cinematic dark bottom gradient for optimal text contrast */}
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/92 via-black/45 via-45% to-transparent"
        aria-hidden="true"
      />

      {/* Card Content Overlay */}
      <div className="relative z-20 flex flex-col justify-end p-4 sm:p-5 lg:p-3.5 xl:p-4.5">
        {/* Title: 2 lines */}
        <div className="font-serif text-sm sm:text-base lg:text-[0.98vw] font-normal leading-[1.12] tracking-[0.14em] text-white uppercase transition-colors group-hover:text-white">
          <div>{titleLines[0]}</div>
          <div>{titleLines[1]}</div>
        </div>

        {/* Poetic Description: 2 lines */}
        <p className="mt-2 font-serif text-[11px] sm:text-xs lg:text-[0.68vw] leading-snug tracking-wide text-[#d4cbbf] italic">
          {descriptionLines[0]}
          <br />
          {descriptionLines[1]}
        </p>

        {/* CTA: VIEW DETAILS → */}
        <div className="mt-3.5 flex items-center space-x-1.5 text-[9px] sm:text-[10px] lg:text-[0.62vw] font-sans font-medium tracking-[0.2em] text-white/90 uppercase transition-colors group-hover:text-white">
          <span>{ctaText}</span>
          <span className="text-xs lg:text-[0.72vw] transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </article>
  );
};
