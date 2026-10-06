"use client";

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { getLenis } from "@/lib/smooth-scroll";
import { StoryLock, type LockPhase } from "@/components/gate/StoryLock";

/** Hand-torn outline on all four edges, as a % polygon (same family as the Echo story page). */
const tornPage = (() => {
  const wob = (t: number, seed: number) =>
    (Math.sin(t * 0.9 + seed) * 0.5 + Math.sin(t * 2.3 + seed * 2) * 0.3 + Math.sin(t * 5.1 + seed * 3) * 0.2 + 1) / 2;
  const pts: string[] = [];
  for (let i = 0; i <= 50; i++) pts.push(`${(i * 2).toFixed(1)}% ${(wob(i, 2.1) * 1.6).toFixed(2)}%`);
  for (let i = 1; i <= 40; i++) pts.push(`${(100 - wob(i, 3.4) * 1.1).toFixed(2)}% ${(i * 2.5).toFixed(1)}%`);
  for (let i = 50; i >= 0; i--) pts.push(`${(i * 2).toFixed(1)}% ${(100 - wob(i, 4.7) * 1.6).toFixed(2)}%`);
  for (let i = 39; i >= 1; i--) pts.push(`${(wob(i, 5.9) * 1.1).toFixed(2)}% ${(i * 2.5).toFixed(1)}%`);
  return `polygon(${pts.join(", ")})`;
})();

const PAPER = "radial-gradient(120% 90% at 0% 0%, #fbf5e9 0%, #f3ead9 55%, #ebdfc9 100%)";
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .35 0 0 0 0 .27 0 0 0 0 .18 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.3'/%3E%3C/svg%3E\")";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CLOSE_MS = 1050;

type Status = "idle" | "sending" | "done";

interface Props {
  open: boolean;
  /** Already signed up on this browser: show the "you're on the list" view straight away. */
  registered: boolean;
  onClose: () => void;
  onRegistered: () => void;
}

export const StoryGatePopup: React.FC<Props> = ({ open, registered, onClose, onRegistered }) => {
  const [closing, setClosing] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [lockPhase, setLockPhase] = useState<LockPhase>("locked");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const close = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      setStatus("idle");
      setLockPhase("locked");
      onClose();
    }, CLOSE_MS);
  };

  // Freeze the page while the form is up; Escape closes it
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const focus = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 1700);
    return () => {
      document.body.style.overflow = prev;
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, closing]);

  if (!open) return null;

  // "already on the list" view for a returning visitor (not while this visit's unlocking plays out)
  const done = status === "done" || (registered && status === "idle" && lockPhase === "locked");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setError("Please enter a valid email address.");
      setShake((n) => n + 1);
      return;
    }
    setError("");
    setStatus("sending");
    // The key slides into the lock while the request is in flight (and is always given time to
    // arrive); once the email is saved it turns, the shackle opens, and only then the text changes.
    setLockPhase("key");
    const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));
    const keyArrives = wait(1100);
    const fail = (message: string) => {
      setStatus("idle");
      setLockPhase("locked");
      setError(message);
      setShake((n) => n + 1);
    };
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      await keyArrives;
      if (!res.ok || !data.ok) {
        fail(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      // the lock stays shut: the form just turns into the "you'll be updated" message
      setLockPhase("locked");
      setStatus("done");
      onRegistered();
    } catch {
      await keyArrives;
      fail("We couldn't reach the server. Please try again.");
    }
  };

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 [perspective:1400px] sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Register to unlock the next story"
    >
      <div
        onClick={close}
        aria-hidden="true"
        className="absolute inset-0 bg-[#0c0b0a]/65 backdrop-blur-md transition-opacity duration-700"
        style={{ opacity: closing ? 0 : 1 }}
      />

      {/* torn paper page, hung from a steel pin (same entrance/exit as the story page) */}
      <div
        className={`relative w-full max-w-[920px] ${closing ? "echo-story-out" : "echo-story-in"}`}
        style={{ filter: "drop-shadow(0 12px 22px rgba(30,20,10,0.4))" }}
      >
        <div
          className="relative max-h-[90vh] overflow-y-auto text-[#1c1815] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            clipPath: tornPage,
            backgroundColor: "#f3ead9",
            backgroundImage: `${GRAIN}, ${PAPER}`,
            backgroundBlendMode: "multiply, normal",
          }}
        >
          <div className="echo-story-shine-wrap pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="echo-story-shine absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent" />
          </div>

          <div
            className="relative grid items-center gap-4 px-6 py-10 sm:px-10 md:grid-cols-[0.78fr_1fr] md:gap-8 md:px-14 md:py-14"
            style={{ opacity: closing ? 0 : 1, transition: "opacity 0.25s ease" }}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="group absolute top-4 right-5 z-10 p-2 text-[#1c1815]/70 transition-colors hover:text-[#1c1815] sm:top-6 sm:right-8"
            >
              <X className="h-6 w-6 stroke-[1.3] transition-transform duration-500 group-hover:rotate-90" />
            </button>

            {/* the lock */}
            <div className="gate-pop-lock relative mx-auto flex w-full max-w-[230px] items-center justify-center md:max-w-none">
              <div
                aria-hidden="true"
                className="absolute inset-[8%] rounded-full opacity-60"
                style={{ background: "radial-gradient(closest-side, rgba(230,190,110,0.5), transparent 100%)" }}
              />
              <StoryLock phase="locked" label="Coming soon" className="relative h-auto w-[clamp(110px,13vw,170px)]" />
            </div>

            {/* the form */}
            <div className="flex flex-col">
              <span
                className="nav-link-rise font-sans text-[11px] font-semibold tracking-[0.28em] text-[#7a6140] uppercase"
                style={{ animationDelay: "1s" }}
              >
                {done ? "Registered" : "The next chapter is locked"}
              </span>
              <h2
                className="echo-story-ink font-allura allura-regular font-script font-cursive mt-2 text-[40px] leading-[1.05] text-[#8a6a3b] sm:text-[52px]"
                style={{ animationDelay: "1.15s" }}
              >
                {done ? "You’ll stay updated." : "Stay with the story"}
              </h2>

              <p
                className="nav-link-rise mt-3 font-serif text-[15px] leading-[1.75] text-[#2e2418] sm:text-[16.5px]"
                style={{ animationDelay: "1.5s" }}
              >
                {done
                  ? "Thank you. The lock stays closed for now, but we’ll keep you posted on every upcoming story and write to you the moment a new one is released."
                  : "To know about the story, register yourself and stay with us for the upcoming stories. The moment the next one unlocks, we’ll write to you."}
              </p>

              {done ? (
                <button
                  type="button"
                  onClick={close}
                  className="nav-link-rise group mt-6 inline-flex w-fit cursor-pointer items-center gap-3 border border-[#221c17] px-6 py-3 font-sans text-[11px] font-medium tracking-[0.22em] text-[#1c1815] uppercase transition-colors duration-300 hover:bg-[#1c1815] hover:text-[#f4efe8]"
                  style={{ animationDelay: "1.8s" }}
                >
                  Back to the story
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">&rarr;</span>
                </button>
              ) : (
                <form onSubmit={submit} noValidate className="mt-6" key={shake}>
                  <label
                    htmlFor="gate-email"
                    className="nav-link-rise block font-sans text-[10.5px] font-semibold tracking-[0.24em] text-[#7a6140] uppercase"
                    style={{ animationDelay: "1.75s" }}
                  >
                    Your email
                  </label>
                  <div
                    className={`nav-link-rise group/field relative mt-1 ${error ? "gate-shake" : ""}`}
                    style={{ animationDelay: "1.85s" }}
                  >
                    <input
                      ref={inputRef}
                      id="gate-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      placeholder="you@example.com"
                      aria-invalid={!!error}
                      aria-describedby={error ? "gate-error" : undefined}
                      className="w-full border-b border-[#1c1815]/30 bg-transparent py-2.5 font-serif text-[18px] text-[#1c1815] italic placeholder:text-[#1c1815]/35 focus:outline-none sm:text-[20px]"
                    />
                    {/* ink line that draws along the field when it is focused */}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-px left-0 h-[2px] w-full origin-left scale-x-0 transition-transform duration-700 ease-out group-focus-within/field:scale-x-100 ${error ? "bg-[#8c2f3a]" : "bg-[#8a6a3b]"}`}
                    />
                  </div>
                  <p
                    id="gate-error"
                    role="alert"
                    className="mt-2 min-h-[1.25rem] font-sans text-[12.5px] text-[#8c2f3a]"
                  >
                    {error}
                  </p>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="nav-link-rise group relative mt-3 inline-flex cursor-pointer items-center gap-3 overflow-hidden bg-[#1c1815] px-7 py-3.5 font-sans text-[11px] font-medium tracking-[0.22em] text-[#f4efe8] uppercase transition-colors duration-300 hover:bg-[#8a6a3b] disabled:cursor-wait disabled:opacity-80"
                    style={{ animationDelay: "2s" }}
                  >
                    <span aria-hidden="true" className="dream-shine pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    {status === "sending" ? (
                      <>
                        <span aria-hidden="true" className="gate-spin h-3.5 w-3.5 rounded-full border border-[#f4efe8]/40 border-t-[#f4efe8]" />
                        Sealing your place
                      </>
                    ) : (
                      <>
                        Register &amp; stay with us
                        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">&rarr;</span>
                      </>
                    )}
                  </button>

                  <p
                    className="nav-link-rise mt-4 font-sans text-[11.5px] text-[#4f4132]/80"
                    style={{ animationDelay: "2.15s" }}
                  >
                    No spam. Only stories.{" "}
                    <button type="button" onClick={close} className="cursor-pointer underline underline-offset-4 hover:text-[#1c1815]">
                      Maybe later
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* steel pin holding the page up */}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 96"
          className={`pointer-events-none absolute -top-9 left-1/2 z-10 h-[78px] w-auto -translate-x-1/2 drop-shadow-[2px_4px_3px_rgba(40,28,16,0.4)] ${closing ? "echo-story-pin-out" : "echo-story-pin"}`}
        >
          <defs>
            <linearGradient id="gatePinSteel" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#5f6870" />
              <stop offset="0.45" stopColor="#f2f5f7" />
              <stop offset="1" stopColor="#7d868e" />
            </linearGradient>
            <radialGradient id="gatePinHead" cx="0.35" cy="0.3" r="0.8">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.5" stopColor="#c3cad0" />
              <stop offset="1" stopColor="#6c757d" />
            </radialGradient>
          </defs>
          <path d="M12 12 C7 28 17 42 11 58 C7 70 14 82 12 94" fill="none" stroke="url(#gatePinSteel)" strokeWidth="2.6" strokeLinecap="round" />
          <rect x="9.2" y="10" width="5.6" height="3.2" rx="1.2" fill="#8d969d" />
          <circle cx="12" cy="6.5" r="5.4" fill="url(#gatePinHead)" stroke="#5b646c" strokeWidth="0.8" />
          <circle cx="10.2" cy="4.8" r="1.5" fill="#fff" fillOpacity="0.85" />
        </svg>
      </div>
    </div>
  );
};
