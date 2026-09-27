import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export interface EchoCardProps {
  title: string;
  descLines: [string, string];
  imageSrc: string;
  imageAlt: string;
  objectPosition?: string;
  className?: string;
  onClick?: () => void;
  variant?: "vertical" | "horizontal";
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
}) => {
  if (variant === "horizontal") {
    return (
      <article
        onClick={onClick}
        className={`group flex h-full w-full cursor-pointer items-center justify-between gap-3 text-left transition-all duration-300 select-none ${className}`}
      >
        {/* Left: Portrait Image Card matching media_1790504424306.png */}
        <div className="relative h-full aspect-[0.82/1] flex-shrink-0 overflow-hidden bg-[#e0d6c8] shadow-sm">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            unoptimized
            sizes="160px"
            style={{ objectPosition }}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
        </div>

        {/* Middle: Title & 2-Line Poetic Caption */}
        <div className="flex flex-1 flex-col justify-center min-w-0 pl-2.5 xs:pl-3.5 pr-2">
          <h3 className="font-bodoni text-[15px] xs:text-[17px] sm:text-[19px] font-normal tracking-[0.16em] text-[#1a140e] uppercase transition-colors group-hover:text-black">
            {title}
          </h3>
          <p className="mt-1 font-serif text-[12px] xs:text-[13.5px] sm:text-[15px] leading-[1.3] tracking-wide text-[#554739] italic">
            <span>{descLines[0]}</span>
            <br />
            <span>{descLines[1]}</span>
          </p>
        </div>

        {/* Right: Circular Arrow Action matching media_1790504424306.png */}
        <div className="flex h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#3a3026]/40 text-[#3a3026] transition-all duration-300 group-hover:scale-105 group-hover:border-[#1a140e] group-hover:bg-[#1a140e] group-hover:text-white">
          <ArrowRight className="h-3.5 w-3.5 xs:h-4 xs:w-4 stroke-[1.3]" />
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={onClick}
      className={`group flex cursor-pointer flex-col text-left transition-all duration-300 ${className}`}
    >
      {/* 1. Portrait Image Container - aspect 0.68 / 1 */}
      <div className="relative aspect-[0.68/1] w-full overflow-hidden bg-[#e0d6c8] shadow-xs">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 30vw, 240px"
          style={{ objectPosition }}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
        />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
      </div>

      {/* 2. Title & Action Row */}
      <div className="mt-3 flex items-center justify-between">
        <h3 className="font-bodoni text-xs font-normal tracking-[0.2em] text-[#1a140e] uppercase transition-colors group-hover:text-black sm:text-sm lg:text-[0.95vw]">
          {title}
        </h3>
        <div className="flex h-5 w-5 sm:h-6 sm:w-6 lg:h-[1.55vw] lg:w-[1.55vw] items-center justify-center rounded-full border border-[#3a3026]/50 text-[#3a3026] transition-all duration-300 group-hover:scale-105 group-hover:border-[#1a140e] group-hover:bg-[#1a140e] group-hover:text-white">
          <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-[0.78vw] lg:w-[0.78vw] stroke-[1.4]" />
        </div>
      </div>

      {/* 3. Poetic Caption (2 lines) */}
      <p className="mt-1 font-serif text-[11px] sm:text-xs lg:text-[0.72vw] leading-tight tracking-wide text-[#554739] italic">
        {descLines[0]}
        <br />
        {descLines[1]}
      </p>
    </article>
  );
};
