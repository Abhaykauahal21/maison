"use client";

import React, { useRef, useState, useCallback } from "react";
import Image from "next/image";

export interface StepPhotoProps {
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
  inView?: boolean;
}

export const StepPhoto: React.FC<StepPhotoProps> = ({
  imageSrc = "/images/step-model.webp",
  imageAlt = "Maison D'Vine Model in Crimson Gown Touching Stone Wall",
  className = "",
  inView = true,
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0, isHovered: false });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tiltX = (y / rect.height - 0.5) * -6;
    const tiltY = (x / rect.width - 0.5) * 6;

    setTilt({ x: tiltX, y: tiltY, isHovered: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0, isHovered: false });
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden bg-[#e0d6c8] select-none will-change-transform ${className}`}
      style={{
        transform: tilt.isHovered
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`
          : "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)",
        transition: tilt.isHovered
          ? "transform 0.15s ease-out, box-shadow 0.3s ease"
          : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease",
        boxShadow: tilt.isHovered
          ? "0 22px 45px rgba(0, 0, 0, 0.28)"
          : "0 10px 30px rgba(0, 0, 0, 0.18)",
      }}
    >
      {/* Model Photograph */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        loading="lazy"
        unoptimized
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 28vw"
        className={`pointer-events-none object-cover object-[52%_22%] transition-transform duration-700 ease-out group-hover:scale-106 ${
          inView ? "animate-step-develop" : "opacity-0"
        }`}
      />

      {/* Subtle vintage photo grain & vignette overlay */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 transition-opacity duration-300 group-hover:opacity-60"
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
