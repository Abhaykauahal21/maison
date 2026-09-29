"use client";

import React, { useEffect, useRef } from "react";

export const GardenParticles: React.FC<{ className?: string }> = ({ className = "" }) => {
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
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    // Warm golden sunlit pollen and floral sparkles
    const particles: {
      x: number;
      y: number;
      size: number;
      alpha: number;
      speedX: number;
      speedY: number;
      pulseSpeed: number;
    }[] = [];

    const count = width < 768 ? 25 : 45;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.5 + 0.2,
        speedX: (Math.random() - 0.4) * 0.25,
        speedY: -0.15 - Math.random() * 0.2,
        pulseSpeed: 0.006 + Math.random() * 0.01,
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

    let angle = 0;
    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      angle += 0.015;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.speedX + Math.sin(angle + i) * 0.15;
        p.y += p.speedY;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha = p.alpha + Math.sin(angle * 2 + i) * 0.15;

        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        gradient.addColorStop(0, `rgba(255, 235, 185, ${Math.max(0, currentAlpha)})`);
        gradient.addColorStop(1, "rgba(255, 220, 160, 0)");
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
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
