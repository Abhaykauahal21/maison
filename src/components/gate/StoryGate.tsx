"use client";

import React, { useEffect, useRef, useState } from "react";
import { LockedScene } from "@/components/gate/LockedScene";
import { StoryGatePopup } from "@/components/gate/StoryGatePopup";

/**
 * Set to false to switch the whole gate off: page.tsx then renders every section as before.
 * (Delete the `gate` folder, the /api/subscribe route and the .gate-* CSS to remove it for good.)
 */
export const STORY_GATE_ENABLED = true;

const AUTO_POPUP = false;

/** Hand-torn top and bottom edges for the peek (deterministic jitter, so server and client markup match). */
const tornBottom = (() => {
  const pts: string[] = [];
  const steps = 56;
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 100;
    const wave = Math.sin(i * 0.7 + 1) * 4;
    const depth = 10 + wave + rnd() * 14;
    pts.push(`${x.toFixed(2)}% ${depth.toFixed(1)}px`);
  }
  for (let i = steps; i >= 0; i--) {
    const x = (i / steps) * 100;
    const wave = Math.sin(i * 0.55) * 5;
    const depth = 14 + wave + rnd() * 16;
    pts.push(`${x.toFixed(2)}% calc(100% - ${depth.toFixed(1)}px)`);
  }
  return `polygon(${pts.join(", ")})`;
})();
const STORAGE_KEY = "maison-story-registered";
export const GATE_OPEN_EVENT = "story-gate:open";

/**
 * Wraps the sections that are not released yet. Only a peek of the first one is shown, dimmed
 * behind a small brass padlock (which stays shut), and the page ends there. Reaching the end (or pushing further down)
 * opens the registration popup; the page cannot scroll past it.
 */
export const StoryGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [seen, setSeen] = useState(false);
  const peekRef = useRef<HTMLDivElement | null>(null);

  const openRef = useRef(false);
  const registeredRef = useRef(false);
  const cooldownRef = useRef(0);
  const seenAtRef = useRef(0);

  useEffect(() => {
    openRef.current = open;
  }, [open]);
  useEffect(() => {
    registeredRef.current = registered;
  }, [registered]);

  // remembered sign-up (read after mount; localStorage can be unavailable)
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        if (window.localStorage.getItem(STORAGE_KEY)) setRegistered(true);
      } catch {
        /* ignore */
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // lock drops in once the peek is on screen
  useEffect(() => {
    const el = peekRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          seenAtRef.current = Date.now();
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const atBottom = () =>
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 6;
    const show = () => {
      if (openRef.current) return;
      if (Date.now() < cooldownRef.current) return;
      setOpen(true);
    };
    // a visitor who already registered is not interrupted; explicit entry points still open it
    // (and not before the sealing scene has finished playing)
    const push = () => {
      // the rest of the page is open now, so scrolling to the bottom no longer opens the popup
      if (!AUTO_POPUP) return;
      if (registeredRef.current) return;
      if (!seenAtRef.current || Date.now() - seenAtRef.current < 2600) return;
      if (atBottom()) show();
    };

    let arriveTimer = 0;
    let armed = true;
    const onScroll = () => {
      if (!atBottom()) {
        if (document.documentElement.scrollHeight - window.scrollY - window.innerHeight > 240) armed = true;
        return;
      }
      if (!armed) return;
      armed = false;
      window.clearTimeout(arriveTimer);
      arriveTimer = window.setTimeout(push, 2800);
    };
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) push();
    };
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY - (e.touches[0]?.clientY ?? touchY) > 24) push();
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", "End", " "].includes(e.key)) push();
    };
    const onOpenEvent = () => {
      cooldownRef.current = 0;
      show();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener(GATE_OPEN_EVENT, onOpenEvent);
    return () => {
      window.clearTimeout(arriveTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(GATE_OPEN_EVENT, onOpenEvent);
    };
  }, []);

  const handleClose = () => {
    cooldownRef.current = Date.now() + 900;
    setOpen(false);
  };
  const handleRegistered = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setRegistered(true);
  };

  return (
    <>
      <div
        ref={peekRef}
        className="relative z-20 -mt-[7vw] h-[clamp(300px,23vw,450px)] w-full md:-mt-[4.5vw]"
        style={{ clipPath: tornBottom }}
      >
        {/* the locked page: visible, but not usable. Its own negative top margin is cancelled so the clip keeps its torn top */}
        <div inert aria-hidden="true" className="pointer-events-none select-none [&>section]:mt-0!">
          {children}
        </div>

        {/* the sealed scene: chains, padlock, light, dust, caption + action */}
        <LockedScene
          seen={seen}
          registered={registered}
          onOpen={() => window.dispatchEvent(new Event(GATE_OPEN_EVENT))}
        />
      </div>

      <StoryGatePopup open={open} registered={registered} onClose={handleClose} onRegistered={handleRegistered} />
    </>
  );
};
