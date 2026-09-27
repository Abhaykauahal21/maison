"use client";

import React from "react";
import Image from "next/image";

export interface StepPhotoProps {
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}

export const StepPhoto: React.FC<StepPhotoProps> = ({
  imageSrc = "/images/step-model.webp",
  imageAlt = "Maison D'Vine Model in Crimson Gown Touching Stone Wall",
  className = "",
}) => {
  return (
    <div
      className={`group relative overflow-hidden bg-[#e0d6c8] shadow-[0_8px_25px_rgba(0,0,0,0.18)] ${className}`}
    >
      {/* Model Photograph */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        unoptimized
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 28vw"
        className="pointer-events-none object-cover object-[52%_22%] transition-transform duration-700 ease-out group-hover:scale-104"
      />

      {/* Subtle vintage photo grain & vignette overlay */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10"
        aria-hidden="true"
      />

      {/* Inner bevel frame edge */}
      <div
        className="pointer-events-none absolute inset-0 border border-[#b8ab9b]/40 shadow-inner"
        aria-hidden="true"
      />
    </div>
  );
};
