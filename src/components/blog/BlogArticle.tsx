"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost, getReadMinutes } from "./types";
import { BlogCard } from "./BlogCard";

/** Fades/rises its children in the first time they scroll into view. */
const Reveal: React.FC<{ children: React.ReactNode; className?: string; delayMs?: number }> = ({
  children,
  className = "",
  delayMs = 0,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: shown ? `${delayMs}ms` : "0ms" }}
    >
      {children}
    </div>
  );
};

interface BlogArticleProps {
  post: BlogPost;
  related: BlogPost[];
}

export const BlogArticle: React.FC<BlogArticleProps> = ({ post, related }) => {
  const articleRef = useRef<HTMLElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);

  // Reading progress bar (direct DOM writes, no re-render per scroll frame)
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const article = articleRef.current;
      const bar = barRef.current;
      if (!article || !bar) return;
      const rect = article.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      bar.style.transform = `scaleX(${progress.toFixed(4)})`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Start the hero entrance on the next frame so the initial hidden state is painted first
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable: nothing to do */
    }
  };

  const words = post.title.split(" ");
  const readMinutes = getReadMinutes(post);
  const firstParagraphIndex = post.content.findIndex((b) => b.type === "p");

  return (
    <>
      {/* Reading progress */}
      <div className="pointer-events-none fixed top-0 right-0 left-0 z-[60] h-[2px] bg-white/5" aria-hidden="true">
        <div
          ref={barRef}
          className="h-full origin-left bg-gradient-to-r from-[#b8862d] via-[#f0d9a0] to-[#b8862d]"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <article ref={articleRef} className="relative w-full">
        {/* ============ HERO ============ */}
        <header className="relative h-[72vh] min-h-[480px] w-full overflow-hidden bg-[#0a0908]">
          <div className="animate-hero-image-settle absolute inset-0">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              unoptimized
              sizes="100vw"
              className="pointer-events-none object-cover object-center select-none"
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0908]/70 via-[#0a0908]/25 to-[#0e0d0c]"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto flex h-full w-full max-w-[980px] flex-col justify-end px-6 pb-32 sm:px-10 sm:pb-36">
            <Link
              href="/blog"
              className={`mb-6 inline-flex w-fit items-center gap-2 font-sans text-[11px] font-medium tracking-[0.24em] text-white/80 uppercase transition-all duration-700 hover:text-white ${
                ready ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              }`}
            >
              <span aria-hidden="true">&larr;</span> The Journal
            </Link>

            <div
              className={`flex items-center gap-3 font-sans text-[11px] font-medium tracking-[0.24em] text-[#f0d9a0] uppercase transition-all duration-700 delay-150 ${
                ready ? "opacity-100" : "opacity-0"
              }`}
            >
              <span
                className="block h-px bg-gradient-to-r from-[#f0d9a0] to-transparent transition-[width] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ width: ready ? "2.6em" : "0em", transitionDelay: "250ms" }}
                aria-hidden="true"
              />
              {post.category}
            </div>

            <h1 className="mt-4 font-serif text-4xl leading-[1.05] font-normal tracking-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)] sm:text-5xl md:text-6xl">
              {words.map((w, i) => (
                <span key={i} className="mr-[0.25em] inline-block overflow-hidden align-bottom pb-[0.08em]">
                  <span
                    className="inline-block transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      transform: ready ? "translateY(0)" : "translateY(115%)",
                      transitionDelay: ready ? `${300 + i * 90}ms` : "0ms",
                    }}
                  >
                    {w}
                  </span>
                </span>
              ))}
            </h1>

            <p
              className={`mt-5 font-sans text-[11px] font-medium tracking-[0.22em] text-white/75 uppercase transition-all duration-1000 delay-[900ms] ${
                ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
            >
              {post.date} <span className="mx-2 opacity-50">|</span> {readMinutes} min read
            </p>
          </div>
        </header>

        {/* ============ PAPER BODY ============ */}
        <div className="relative z-10 mx-auto -mt-24 w-full max-w-[820px] px-4 sm:-mt-28 sm:px-6">
          <div className="relative bg-[#fbf7ee] px-6 py-14 shadow-[0_30px_70px_-10px_rgba(0,0,0,0.6),0_8px_20px_rgba(0,0,0,0.3)] sm:px-14 sm:py-20">
            {/* washi tape */}
            <span
              className="pointer-events-none absolute -top-3 left-1/2 h-6 w-32 -translate-x-1/2 -rotate-2 bg-[#dccb9f]/85 shadow-[0_1px_3px_rgba(60,40,20,0.25)]"
              style={{
                clipPath:
                  "polygon(0 10%, 3% 0, 6% 12%, 9% 0, 91% 0, 94% 12%, 97% 0, 100% 10%, 100% 90%, 97% 100%, 94% 88%, 91% 100%, 9% 100%, 6% 88%, 3% 100%, 0 90%)",
              }}
              aria-hidden="true"
            />

            <Reveal>
              <p className="mb-10 text-center font-sans text-[10.5px] font-medium tracking-[0.3em] text-[#8a7764] uppercase">
                Maison D&apos;Vine &middot; The Journal
              </p>
            </Reveal>

            {post.content.map((block, i) => {
              switch (block.type) {
                case "h2":
                  return (
                    <Reveal key={i}>
                      <h2 className="mt-12 mb-4 font-serif text-2xl leading-tight text-[#1d1611] sm:text-[1.9rem]">
                        {block.text}
                      </h2>
                    </Reveal>
                  );
                case "quote":
                  return (
                    <Reveal key={i}>
                      <blockquote className="my-12 border-l-2 border-[#b8862d] pl-6 sm:pl-8">
                        <p className="font-allura allura-regular font-script text-[2rem] leading-[1.2] text-[#2c231b] sm:text-[2.6rem]">
                          &ldquo;{block.text}&rdquo;
                        </p>
                      </blockquote>
                    </Reveal>
                  );
                case "image":
                  return (
                    <Reveal key={i}>
                      <figure className="my-12 -mx-2 sm:-mx-6">
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#241c15] shadow-[0_14px_30px_-8px_rgba(15,10,5,0.4)]">
                          <Image
                            src={block.src}
                            alt={block.alt}
                            fill
                            unoptimized
                            sizes="(max-width: 820px) 100vw, 820px"
                            className="object-cover object-center"
                          />
                        </div>
                        <figcaption className="mt-3 text-center font-serif text-sm text-[#6b5a49] italic">
                          {block.caption}
                        </figcaption>
                      </figure>
                    </Reveal>
                  );
                default: {
                  const isFirst = i === firstParagraphIndex;
                  return (
                    <Reveal key={i}>
                      <p
                        className={`mb-6 font-serif text-[1.06rem] leading-[1.85] text-[#3a2f26] sm:text-[1.15rem] ${
                          isFirst
                            ? "first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:font-serif first-letter:text-[4.4rem] first-letter:leading-[0.8] first-letter:text-[#1d1611]"
                            : ""
                        }`}
                      >
                        {block.text}
                      </p>
                    </Reveal>
                  );
                }
              }
            })}

            {/* Sign-off */}
            <Reveal>
              <div className="mt-14 flex flex-col items-center gap-4 border-t border-[#d8cbbb] pt-10 text-center">
                <span className="text-lg text-[#b8862d]" aria-hidden="true">
                  &#10022;
                </span>
                <p className="font-allura allura-regular font-script text-3xl text-[#2c231b]">
                  With love, the Maison D&apos;Vine atelier
                </p>
                <button
                  type="button"
                  onClick={copyLink}
                  className="mt-2 inline-flex cursor-pointer items-center gap-3 border border-[#2b2118]/80 px-6 py-2.5 font-sans text-[11px] font-medium tracking-[0.22em] text-[#1c1510] uppercase transition-colors duration-300 hover:bg-[#1c1510] hover:text-[#fbf7ee]"
                  aria-live="polite"
                >
                  {copied ? "Link copied" : "Share this story"}
                  <span aria-hidden="true">{copied ? "✓" : "↗"}</span>
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </article>

      {/* ============ RELATED ============ */}
      {related.length > 0 && (
        <section className="mx-auto w-full max-w-[1100px] px-6 pt-24 pb-28 sm:px-8" aria-label="More from the journal">
          <Reveal>
            <div className="mb-10 flex items-end justify-between gap-6">
              <h2 className="font-serif text-3xl text-white sm:text-4xl">Keep reading</h2>
              <Link
                href="/blog"
                className="font-sans text-[11px] font-medium tracking-[0.22em] text-white/75 uppercase transition-colors hover:text-white"
              >
                All stories &rarr;
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
            {related.map((p, i) => (
              <Reveal key={p.id} delayMs={i * 150}>
                <BlogCard post={p} index={i} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
};
