"use client";

import React, { useRef, useState, useEffect } from "react";

export interface ScrollTextRevealProps {
  text: string;
  className?: string;
  as?: "p" | "h2" | "h3" | "span" | "div";
  unrevealedOpacity?: number;
  highlightClass?: string;
}

export const ScrollTextReveal: React.FC<ScrollTextRevealProps> = ({
  text,
  className = "",
  as: Component = "p",
  unrevealedOpacity = 0.22,
  highlightClass = "text-current",
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start revealing when element enters 85% from top of viewport
      // Complete revealing when it reaches 42% from top
      const start = windowHeight * 0.85;
      const end = windowHeight * 0.42;

      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const words = text.split(" ");

  return (
    <Component
      ref={containerRef as any}
      className={`inline-block select-none ${className}`}
    >
      {words.map((word, i) => {
        // Calculate each individual word's progress (0 to 1)
        const wordStart = i / words.length;
        const wordEnd = (i + 1) / words.length;
        const wordRaw = (scrollProgress - wordStart) / (wordEnd - wordStart);
        const wordFactor = Math.min(1, Math.max(0, wordRaw));

        const currentOpacity =
          unrevealedOpacity + (1 - unrevealedOpacity) * wordFactor;
        const translateY = (1 - wordFactor) * 4; // subtle 4px upward settling

        return (
          <span
            key={i}
            className={`inline-block mr-[0.28em] will-change-transform ${highlightClass}`}
            style={{
              opacity: currentOpacity,
              transform: `translateY(${translateY}px)`,
              transition: "opacity 0.15s ease-out, transform 0.15s ease-out",
            }}
          >
            {word}
          </span>
        );
      })}
    </Component>
  );
};
