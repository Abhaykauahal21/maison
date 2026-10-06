"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
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
  /** Vertical variant: true while this card's story is open (the card stays fallen until it closes). */
  fallen?: boolean;
  /** Vertical variant: fired once the pulled card has dropped, to open its story. */
  onPinFall?: () => void;
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
  fallen = false,
  onPinFall,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, isHovered: false });
  // Pin game: pull the pin and the card swings loose and drops, which opens its story;
  // when the story closes (fallen -> false) the card swings back onto its pin.
  const [phase, setPhase] = useState<"idle" | "falling" | "hanging">("idle");
  const [prevFallen, setPrevFallen] = useState(false);
  if (prevFallen !== fallen) {
    setPrevFallen(fallen);
    if (!fallen && phase === "falling") setPhase("hanging");
    // story opened from elsewhere (e.g. the Explore button): drop this card too
    if (fallen && phase === "idle") setPhase("falling");
  }
  const timers = useRef<number[]>([]);
  useEffect(() => {
    const t = timers.current;
    return () => t.forEach((id) => window.clearTimeout(id));
  }, []);
  const startFall = () => {
    if (phase !== "idle") return;
    setPhase("falling");
    timers.current.push(
      window.setTimeout(() => {
        if (onPinFall) onPinFall();
        else setPhase("hanging");
      }, 1350)
    );
  };
  const pullPin = (e: React.MouseEvent) => {
    e.stopPropagation();
    startFall();
  };

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
            <p className="overflow-hidden font-serif text-[13px] xs:text-[14px] sm:text-[16px] leading-[1.3] tracking-wide text-[#2e2418] italic">
              <span className="mt-1 block">{descLines[0]}</span>
              <span className="block">{descLines[1]}</span>
              {tag && (
                <span className="mt-1.5 block font-sans text-[10px] xs:text-[10.5px] font-medium not-italic uppercase tracking-[0.2em] text-[#6b5638]">
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

  // DESKTOP VERTICAL LOOKBOOK CARD: a photo print on cream card stock, caption written on the card
  return (
    <article
      ref={cardRef}
      onClick={onPinFall ? startFall : onClick}
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
      {/* the card itself: hangs from the pin, so it swings and falls about the top-centre */}
      <div
        className={`flex flex-1 flex-col ${
          phase === "falling"
            ? "echo-fall pointer-events-none"
            : phase === "hanging"
              ? "echo-rehang"
              : ""
        }`}
        style={{ transformOrigin: "50% 0", "--dir": index && index % 2 === 0 ? -1 : 1 } as React.CSSProperties}
        onAnimationEnd={(e) => {
          if (e.animationName === "echoRehang") setPhase("idle");
        }}
      >
      <div className="flex flex-1 flex-col bg-gradient-to-b from-[#fdf9ef] to-[#f5ecda] p-[clamp(6px,0.6vw,11px)] pb-[clamp(10px,0.95vw,18px)] shadow-[0_3px_10px_rgba(40,28,16,0.18),0_14px_30px_rgba(40,28,16,0.16)] ring-1 ring-[#3a3026]/10 transition-shadow duration-500 group-hover:shadow-[0_6px_14px_rgba(40,28,16,0.22),0_22px_40px_rgba(40,28,16,0.22)]">
        {/* Photo */}
        <div className="relative aspect-[0.74/1] w-full overflow-hidden bg-[#e0d6c8] ring-1 ring-black/10">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            loading="lazy"
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 30vw, 300px"
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

        {/* Look label + title + action */}
        <div className="mt-[clamp(8px,0.85vw,16px)] flex items-end justify-between gap-2 px-[clamp(2px,0.2vw,4px)]">
          <div className="min-w-0">
            {index !== undefined && (
              <span className="mb-1 block font-sans text-[10px] font-semibold tracking-[0.28em] text-[#7a6140] sm:text-[11px] lg:text-[clamp(10px,0.7vw,13px)]">
                LOOK {String(index).padStart(2, "0")}
              </span>
            )}
            <h3 className="font-bodoni text-sm leading-none font-normal tracking-[0.2em] text-[#1a140e] uppercase sm:text-base lg:text-[clamp(15px,1.15vw,24px)]">
              {title}
            </h3>
          </div>
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#3a3026]/50 text-[#3a3026] transition-all duration-300 group-hover:scale-110 group-hover:-rotate-45 group-hover:border-[#1a140e] group-hover:bg-[#1a140e] group-hover:text-white sm:h-7 sm:w-7 lg:h-[clamp(24px,1.8vw,36px)] lg:w-[clamp(24px,1.8vw,36px)]">
            <ArrowRight className="h-3 w-3 stroke-[1.4] lg:h-[clamp(12px,0.9vw,18px)] lg:w-[clamp(12px,0.9vw,18px)]" />
          </div>
        </div>

        {/* Hairline that draws out on hover */}
        <div className="mx-[clamp(2px,0.2vw,4px)] mt-[clamp(6px,0.6vw,12px)] h-px bg-[#3a3026]/15">
          <div className="h-full w-6 bg-[#a98a55] transition-all duration-700 ease-out group-hover:w-full" />
        </div>

        {/* Poetic caption (the girl's own voice) + fabric tag */}
        <p className="mt-2 px-[clamp(2px,0.2vw,4px)] font-serif text-[13px] leading-[1.45] tracking-wide text-[#2e2418] italic sm:text-sm lg:text-[clamp(14px,0.98vw,20px)]">
          {descLines[0]}
          <br />
          {descLines[1]}
        </p>
        {tag && (
          <span className="mt-1.5 block px-[clamp(2px,0.2vw,4px)] font-sans text-[10px] font-medium tracking-[0.2em] text-[#7a6140] uppercase sm:text-[11px] lg:text-[clamp(10px,0.7vw,13px)]">
            {tag}
          </span>
        )}
      </div>
      </div>

      {/* long curved steel pin through the top of the card: click to pull it out */}
      <button
        type="button"
        onClick={pullPin}
        aria-label={`Pull the pin to read the story of ${title}`}
        className={`group/pin absolute -top-[2.4vw] left-1/2 z-20 -translate-x-1/2 cursor-pointer px-1.5 ${
          phase === "falling" ? "echo-pin-out" : phase === "hanging" ? "echo-pin-in" : ""
        }`}
      >
        <svg
          viewBox="0 0 24 96"
          className="h-[clamp(52px,4.2vw,84px)] w-auto drop-shadow-[2px_4px_3px_rgba(40,28,16,0.4)] transition-transform duration-200 group-hover/pin:-translate-y-1"
        >
          <defs>
            <linearGradient id={`steel-${title}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#5f6870" />
              <stop offset="0.45" stopColor="#f2f5f7" />
              <stop offset="1" stopColor="#7d868e" />
            </linearGradient>
            <radialGradient id={`steelHead-${title}`} cx="0.35" cy="0.3" r="0.8">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.5" stopColor="#c3cad0" />
              <stop offset="1" stopColor="#6c757d" />
            </radialGradient>
          </defs>
          {/* curvy steel shaft ending in a sharp point */}
          <path
            d="M12 12 C7 28 17 42 11 58 C7 70 14 82 12 94"
            fill="none"
            stroke={`url(#steel-${title})`}
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path d="M12.6 14 C8 29 17.6 43 11.8 59" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="0.7" strokeLinecap="round" />
          {/* collar + steel ball head */}
          <rect x="9.2" y="10" width="5.6" height="3.2" rx="1.2" fill="#8d969d" />
          <circle cx="12" cy="6.5" r="5.4" fill={`url(#steelHead-${title})`} stroke="#5b646c" strokeWidth="0.8" />
          <circle cx="10.2" cy="4.8" r="1.5" fill="#fff" fillOpacity="0.85" />
        </svg>
      </button>
    </article>
  );
};
