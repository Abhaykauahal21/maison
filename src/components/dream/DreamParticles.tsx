"use client";

import React, { useEffect, useRef } from "react";

export const DreamParticles: React.FC<{ className?: string }> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 800);

    const stars: {
      x: number;
      y: number;
      size: number;
      alpha: number;
      speed: number;
      twinkleDir: number;
    }[] = [];

    const starCount = width < 768 ? 20 : 40;
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.6 + 0.15,
        speed: 0.004 + Math.random() * 0.008,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
      });
    }

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    let isVisible = false;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        s.alpha += s.speed * s.twinkleDir;
        if (s.alpha > 0.85) s.twinkleDir = -1;
        if (s.alpha < 0.1) s.twinkleDir = 1;

        // Slow celestial drift
        s.y -= 0.1;
        if (s.y < -5) s.y = height + 5;

        ctx.beginPath();
        ctx.fillStyle = `rgba(240, 230, 215, ${s.alpha})`;
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-12 ${className}`}
      aria-hidden="true"
    />
  );
};
