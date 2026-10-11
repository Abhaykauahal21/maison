"use client";

import { useEffect } from "react";
import "./story-fx.css";

const RAIL = ["Prologue", "The Beginning", "The Unanswered", "The Echo", "Onward"];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Wrap every word (or character) of an element in a span so CSS can stagger them in. */
const splitText = (el: HTMLElement, mode: "words" | "chars" | "scrub") => {
  let i = 0;
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? "";
        const frag = document.createDocumentFragment();
        const parts = text.split(/(\s+)/);
        parts.forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
            return;
          }
          if (mode === "scrub") {
            const w = document.createElement("span");
            w.className = "fx-scrub-word";
            w.textContent = part;
            frag.appendChild(w);
            return;
          }
          const makeMask = (label: string) => {
            const mask = document.createElement("span");
            mask.className = "fx-mask";
            const inner = document.createElement("span");
            inner.className = "fx-inner";
            inner.style.setProperty("--i", String(i++));
            inner.textContent = label;
            mask.appendChild(inner);
            return mask;
          };
          if (mode === "chars") {
            // letters stay glued inside a no-wrap word so a line can never break mid-word
            const word = document.createElement("span");
            word.className = "fx-word";
            Array.from(part).forEach((ch) => word.appendChild(makeMask(ch)));
            frag.appendChild(word);
          } else {
            frag.appendChild(makeMask(part));
          }
        });
        child.replaceWith(frag);
      } else if (child.nodeName !== "BR") {
        walk(child);
      }
    });
  };
  walk(el);
};

/**
 * Cinematic scroll layer for the story page. Dependency-free:
 *  - reveals ([data-fx]) fire once via IntersectionObserver: rise, words, chars, line, mask, zoom
 *  - parallax ([data-parallax]) and the hero push-in are scrubbed by scroll, lerped for weight
 *  - a gold progress hairline, letterbox intro bars and soft film grain sit over the page
 * Renders only the overlay chrome; everything else is wired to existing markup by data attributes.
 */
export function StoryFX() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".story-fx");
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    root.querySelectorAll<HTMLElement>('[data-fx="words"]').forEach((el) => splitText(el, "words"));
    root.querySelectorAll<HTMLElement>('[data-fx="chars"]').forEach((el) => splitText(el, "chars"));
    root
      .querySelectorAll<HTMLElement>("[data-scrub-words]")
      .forEach((el) => splitText(el, "scrub"));

    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-fx]"));
    targets.forEach((el) => {
      const delay = el.dataset.delay;
      if (delay) el.style.setProperty("--fx-delay", `${delay}s`);
    });

    if (reduce) {
      targets.forEach((el) => el.classList.add("fx-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          // masked elements are watched through their parent (a fully clipped box never intersects)
          const el = (entry.target as HTMLElement & { _fx?: HTMLElement })._fx ?? entry.target;
          el.classList.add("fx-in");
          io.unobserve(entry.target);
        }),
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
    );
    targets.forEach((el) => {
      if (el.dataset.fx === "mask" && el.parentElement) {
        (el.parentElement as HTMLElement & { _fx?: HTMLElement })._fx = el;
        io.observe(el.parentElement);
      } else {
        io.observe(el);
      }
    });

    // Lite mode (phones / touch): no blur filters, no pointer lean, no scroll easing, static grain.
    const lite = window.matchMedia("(pointer: coarse), (max-width: 767px)").matches;
    root.classList.toggle("fx-lite", lite);

    const bar = document.querySelector<HTMLElement>("[data-fx-progress]");
    const heroBg = root.querySelector<HTMLElement>("[data-hero-bg]");
    const heroCopy = root.querySelector<HTMLElement>("[data-hero-copy]");
    const heroVeil = root.querySelector<HTMLElement>("[data-hero-veil]");
    const heroSection = heroBg?.closest("section") ?? null;

    type Job =
      | { kind: "parallax"; el: HTMLElement; box: HTMLElement; speed: number }
      | { kind: "scrubImg"; el: HTMLElement; imgs: HTMLElement[] }
      | { kind: "scrubText"; el: HTMLElement; words: HTMLElement[] }
      | { kind: "slide"; el: HTMLElement; dir: number; dist: number };

    const jobs: Job[] = [];
    root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) =>
      jobs.push({
        kind: "parallax",
        el,
        box: el.parentElement ?? el,
        speed: Number(el.dataset.parallax) || 0.1,
      })
    );
    root
      .querySelectorAll<HTMLElement>("[data-scrub-img]")
      .forEach((el) =>
        jobs.push({ kind: "scrubImg", el, imgs: Array.from(el.querySelectorAll("img")) })
      );
    root.querySelectorAll<HTMLElement>("[data-scrub-words]").forEach((el) =>
      jobs.push({
        kind: "scrubText",
        el,
        words: Array.from(el.querySelectorAll<HTMLElement>(".fx-scrub-word")),
      })
    );
    root.querySelectorAll<HTMLElement>("[data-slide]").forEach((el) =>
      jobs.push({
        kind: "slide",
        el,
        dir: el.dataset.slide === "left" ? -1 : 1,
        dist: (Number(el.dataset.dist) || 180) * (lite ? 0.45 : 1),
      })
    );

    // Only elements near the screen get measured or written each frame.
    const live = new Set<Job>();
    const jobByNode = new Map<Element, Job>();
    jobs.forEach((j) => jobByNode.set(j.kind === "parallax" ? j.box : j.el, j));
    const liveIo = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          const job = jobByNode.get(entry.target);
          if (!job) return;
          if (entry.isIntersecting) live.add(job);
          else live.delete(job);
          kick();
        }),
      { rootMargin: "200px 0px 200px 0px" }
    );
    jobByNode.forEach((_, node) => liveIo.observe(node));

    const steps = Array.from(root.querySelectorAll<HTMLElement>(":scope > section"));
    const railItems = Array.from(document.querySelectorAll<HTMLElement>("[data-rail-step]"));
    let activeStep = -1;

    // pointer parallax (desktop only): the hero leans toward the cursor, with weight
    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      kick();
    };
    if (!lite) window.addEventListener("pointermove", onMove, { passive: true });

    let current = window.scrollY;
    let raf = 0;

    // The loop sleeps whenever nothing is moving, and wakes on scroll / pointer / visibility changes.
    function kick() {
      if (!raf) raf = requestAnimationFrame(frame);
    }

    function frame() {
      raf = 0;
      const target = window.scrollY;
      current = lite ? target : current + (target - current) * 0.14;
      if (Math.abs(target - current) < 0.3) current = target;
      mx += (tx - mx) * 0.08;
      my += (ty - my) * 0.08;

      const vh = window.innerHeight;

      // ---- reads (all layout measurements first, so the browser lays out once) ----
      const reads: { job: Job; top: number; bottom: number; height: number }[] = [];
      live.forEach((job) => {
        const r = (job.kind === "parallax" ? job.box : job.el).getBoundingClientRect();
        reads.push({ job, top: r.top, bottom: r.bottom, height: r.height });
      });
      let idx = 0;
      if (railItems.length) {
        steps.forEach((sec, i) => {
          if (sec.getBoundingClientRect().top <= vh * 0.5) idx = i;
        });
      }
      const heroH = heroSection ? heroSection.offsetHeight || vh : vh;
      const max = document.documentElement.scrollHeight - vh;

      // ---- writes ----
      if (bar) bar.style.transform = `scaleX(${max > 0 ? clamp(current / max) : 0})`;

      if (heroSection && current < heroH * 1.1) {
        const p = clamp(current / heroH);
        if (heroBg) {
          heroBg.style.translate = `${(-mx * 14).toFixed(1)}px calc(${(p * 14).toFixed(2)}% + ${(-my * 8).toFixed(1)}px)`;
          heroBg.style.scale = (1 + p * (lite ? 0.14 : 0.28)).toFixed(4);
        }
        if (heroCopy) {
          heroCopy.style.translate = `0 ${(-p * 110).toFixed(1)}px`;
          heroCopy.style.opacity = clamp(1 - p * 1.7).toFixed(3);
        }
        if (heroVeil) heroVeil.style.opacity = (p * 0.75).toFixed(3);
      }

      reads.forEach(({ job, top, bottom, height }) => {
        if (job.kind === "scrubImg") {
          const p = clamp((vh - top) / (vh + height));
          const k = (lite ? 1.16 - p * 0.16 : 1.32 - p * 0.32).toFixed(4);
          const y = `0 ${((0.5 - p) * 7).toFixed(2)}%`;
          job.imgs.forEach((img) => {
            img.style.scale = k;
            img.style.translate = y;
          });
        } else if (job.kind === "scrubText") {
          const p = clamp((vh * 0.92 - top) / (vh * 0.55));
          const n = job.words.length + 4;
          job.words.forEach((w, i) => {
            w.style.opacity = (0.16 + 0.84 * clamp(p * n - i)).toFixed(2);
          });
        } else if (job.kind === "slide") {
          // fully on screen always means fully arrived, so nothing can stay half-hidden
          const p = bottom <= vh * 0.96 ? 1 : clamp((vh * 0.98 - top) / (vh * 0.5));
          const e = 1 - Math.pow(1 - p, 3);
          // `transform`, not `translate`: Tailwind centres some of these boxes with the translate property
          job.el.style.transform = `translateX(${(job.dir * (1 - e) * job.dist).toFixed(1)}px) rotate(${(job.dir * (1 - e) * 2.5).toFixed(2)}deg)`;
          job.el.style.opacity = clamp(e * 1.4).toFixed(3);
        } else {
          const offset = top + height / 2 - vh / 2;
          job.el.style.translate = `0 ${(-offset * job.speed * (lite ? 0.6 : 1)).toFixed(1)}px`;
        }
      });

      if (idx !== activeStep) {
        activeStep = idx;
        railItems.forEach((it, i) => it.toggleAttribute("data-on", i === idx));
      }

      // keep going while the scroll is still catching up or the pointer is still easing
      if (current !== target || Math.abs(tx - mx) > 0.002 || Math.abs(ty - my) > 0.002) {
        raf = requestAnimationFrame(frame);
      }
    }

    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    kick();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      liveIo.disconnect();
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <>
      <div className="fx-progress" aria-hidden="true">
        <span data-fx-progress />
      </div>
      <div className="fx-letterbox fx-letterbox-top" aria-hidden="true" />
      <div className="fx-letterbox fx-letterbox-bottom" aria-hidden="true" />
      <nav className="fx-rail" aria-label="Story chapters">
        {RAIL.map((label, i) => (
          <button
            key={label}
            type="button"
            data-rail-step
            onClick={() =>
              document
                .querySelectorAll<HTMLElement>(".story-fx > section")
                [i]?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span className="fx-rail-label">{label}</span>
            <span className="fx-rail-dot" />
          </button>
        ))}
      </nav>
      <div className="fx-grain" aria-hidden="true" />
    </>
  );
}
