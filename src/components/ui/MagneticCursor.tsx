"use client";

import React, { useEffect, useRef, useState } from "react";

export const MagneticCursor: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Target mouse position
  const mousePos = useRef({ x: -100, y: -100 });
  // Interpolated smooth ring position
  const ringPos = useRef({ x: -100, y: -100 });
  // Animation frame id
  const rafId = useRef<number | null>(null);

  // Active magnetic target element
  const magneticTarget = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Only enable on devices with fine pointer (mouse/trackpad), not touchscreens
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) return;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!visible) setVisible(true);

      // Fast direct update for inner dot for 0 latency
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check for magnetic interactive elements
      const target = (e.target as HTMLElement)?.closest(
        'button, a, [role="button"], .cursor-pointer, input, select, textarea'
      ) as HTMLElement | null;

      if (target) {
        setHovered(true);
        magneticTarget.current = target;

        // Apply subtle magnetic pull to the element if it's a button or link
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.22;
        const deltaY = (e.clientY - centerY) * 0.22;

        target.style.transition = "transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)";
        target.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
      } else {
        if (magneticTarget.current) {
          magneticTarget.current.style.transition =
            "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)";
          magneticTarget.current.style.transform = "translate3d(0, 0, 0)";
          magneticTarget.current = null;
        }
        setHovered(false);
      }
    };

    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);
    const onMouseLeave = () => {
      setVisible(false);
      if (magneticTarget.current) {
        magneticTarget.current.style.transform = "translate3d(0, 0, 0)";
        magneticTarget.current = null;
      }
    };
    const onMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // Smooth lerp loop for the outer magnetic ring
    const render = () => {
      // Lerp factor
      const ease = 0.18;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ease;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(render);
    };

    rafId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-300 opacity-100"
      aria-hidden="true"
    >
      {/* 1. Inner Precision Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 -ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full bg-white transition-transform duration-100 ease-out will-change-transform mix-blend-difference ${
          hovered ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
      />

      {/* 2. Outer Smooth Magnetic Follower Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full will-change-transform transition-[width,height,margin,background-color,border-color,transform] duration-300 ease-out mix-blend-difference ${
          hovered
            ? "-ml-[28px] -mt-[28px] h-[56px] w-[56px] border border-white bg-white/20 backdrop-blur-[0.5px]"
            : clicked
              ? "-ml-[15px] -mt-[15px] h-[30px] w-[30px] border border-white/70 bg-white/10"
              : "-ml-[18px] -mt-[18px] h-[36px] w-[36px] border border-white/50 bg-transparent"
        }`}
      />
    </div>
  );
};
