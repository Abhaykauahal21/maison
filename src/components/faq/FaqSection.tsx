"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { FaqMobile } from "@/components/faq/FaqMobile";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "different",
    question: "What makes Maison O’Vine different?",
    answer:
      "Every Maison O’Vine creation is conceived as a living story rather than a fleeting trend. We craft small-batch capsule pieces using heirloom-quality silks, hand-guided embroidery, and intentional silhouettes designed to bring effortless poetry to your every day.",
  },
  {
    id: "custom-sizing",
    question: "Do you offer custom sizing?",
    answer:
      "Yes. We celebrate individuality with bespoke made-to-measure tailoring for select silhouettes. Share your precise measurements with our atelier concierge, and our artisans will tailor your piece to drape impeccably.",
  },
  {
    id: "shipping",
    question: "How long does shipping take?",
    answer:
      "Ready-to-wear orders dispatch within 24–48 hours, arriving within 4–7 business days. Bespoke and artisanal hand-finished pieces require 10–14 days in our atelier before complimentary, fully insured delivery to your doorstep.",
  },
  {
    id: "returns",
    question: "Can I return or exchange a product?",
    answer:
      "We warmly accept returns and exchanges on unworn, unaltered creations with all original tags and packaging intact within 14 days of delivery. Bespoke and personalized pieces remain final sale.",
  },
  {
    id: "care",
    question: "How do I take care of my dress?",
    answer:
      "Due to our delicate natural fibers, hand-dyed silks, and fine threadwork, we recommend specialized dry cleaning or a gentle hand wash in cold water using delicate silk detergent. Store away from direct sunlight on padded hangers.",
  },
];

export const FaqSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      aria-label="Frequently Asked Questions"
      className="relative z-30 w-full select-none bg-transparent -mt-[10vw] md:-mt-16 lg:-mt-22 xl:-mt-28 drop-shadow-[0_-12px_24px_rgba(0,0,0,0.5)]"
    >
      {/* SVG filter definition for realistic organic torn paper deckled edges */}
      <svg className="sr-only" aria-hidden="true" focusable="false">
        <defs>
          <filter id="faq-torn-edge" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="4"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* ========================================================
          1. DESKTOP & TABLET VIEW (md: 768px+)
          - Direct load of /images/FAQ-page-web.webp (1672 x 941)
          - Natural aspect ratio and pixel-for-pixel fidelity
          - Overlaps OurStorySection (z-30 over z-20 with negative top margin)
          - Cursive note and button moved UP into the center
          - Right off-white paper panel with 5 FAQ items
          ======================================================== */}
      <div className="relative hidden w-full overflow-x-clip md:block">
        {/* Full-width Base Parchment Collage */}
        <div
          className={`relative w-full transition-opacity duration-1000 ease-out ${
            inView ? "opacity-100" : "opacity-95"
          }`}
        >
          <Image
            src="/images/FAQ-page-web.webp"
            alt="Maison D'Vine FAQ - Scrapbook of Curiosities"
            width={1672}
            height={941}
            quality={100}
            unoptimized
            priority
            className="pointer-events-none block h-auto w-full select-none"
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </div>

        {/* Content Overlay Layer */}
        <div className="pointer-events-auto absolute inset-0 z-20">
          {/* ================= LEFT EDITORIAL COLUMN ================= */}
          <div
            className={`absolute top-[16%] left-[14.2%] z-20 flex w-[23.8%] max-w-[370px] flex-col text-left transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[9vw]"
            }`}
          >
            {/* Upper Group: Eyebrow + FAQs Heading + Description */}
            <div className="flex flex-col">
              {/* Eyebrow */}
              <span className="font-sans text-[10px] sm:text-[11px] md:text-[0.76vw] lg:text-[12px] font-medium tracking-[0.26em] text-[#605043] uppercase">
                QUESTIONS YOU MAY HAVE
              </span>

              {/* Large Editorial Serif Heading */}
              <h2 className="mt-2 sm:mt-2.5 font-serif text-5xl sm:text-6xl md:text-[4.2vw] lg:text-[4.8vw] xl:text-[5.3rem] font-normal leading-[0.92] tracking-tight text-[#201813]">
                FAQs
              </h2>

              {/* Description Paragraph with poetic line breaks */}
              <p className="mt-3.5 sm:mt-4 md:mt-[1.2vw] lg:mt-4.5 font-serif text-xs sm:text-[13px] md:text-[0.96vw] lg:text-[1.06rem] font-normal leading-[1.38] text-[#46392f] tracking-[0.01em]">
                Little questions,
                <br />
                thoughtful answers &mdash;
                <br />
                because your journey
                <br />
                with us should feel effortless.
              </p>
            </div>

            {/* Middle Group: Handwritten Script Note & Outlined Button nudged slightly down */}
            <div className="flex flex-col mt-8 sm:mt-9 md:mt-[2.4vw] lg:mt-11 xl:mt-12">
              {/* Handwritten Note with Hand-Drawn Heart */}
              <div className="relative mb-5 sm:mb-5.5 md:mb-[1.3vw] lg:mb-6 select-none">
                <p className="font-allura allura-regular font-script font-cursive text-2xl sm:text-3xl md:text-[1.85vw] lg:text-[2.15rem] leading-[1.14] text-[#413328] -rotate-[5deg] origin-bottom-left tracking-wide">
                  Still wondering?
                  <br />
                  We&apos;re here for you
                  <span className="inline-flex items-center ml-2.5 align-middle">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#413328] rotate-6"
                      aria-hidden="true"
                    >
                      <path d="M12 21 C10 19, 3.5 13.5, 3.5 8.5 C3.5 5.5, 6 3.5, 9 3.5 C10.8 3.5, 12 4.6, 12 5.5 C12 4.6, 13.2 3.5, 15 3.5 C18 3.5, 20.5 5.5, 20.5 8.5 C20.5 13.5, 14 19, 12 21 Z" />
                    </svg>
                  </span>
                </p>
              </div>

              {/* Minimal Outlined Button */}
              <div>
                <button
                  type="button"
                  className="group inline-flex items-center justify-between gap-5 sm:gap-6 md:gap-[1.5vw] lg:gap-7 border border-[#2b2118] bg-transparent px-5 sm:px-6 md:px-[1.4vw] lg:px-7 py-2.5 sm:py-3 md:py-[0.7vw] lg:py-3 text-[10px] sm:text-[11px] md:text-[0.74vw] lg:text-xs font-serif font-medium tracking-[0.22em] text-[#2b2118] uppercase transition-all duration-300 hover:bg-[#2b2118] hover:text-[#faf6ee] active:scale-[0.98] cursor-pointer"
                >
                  <span>VIEW ALL FAQS</span>
                  <span className="text-xs transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* ================= RIGHT PAPER FAQ PANEL (5 ITEMS) ================= */}
          <div
            className={`absolute top-[10.8%] bottom-[8.8%] left-[40.4%] right-[14.4%] z-20 flex flex-col transition-all duration-[1400ms] delay-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[12vw]"
            }`}
          >
            <div className="relative h-full w-full">
              {/* Torn paper backdrop layer with organic deckled filter & soft shadow */}
              <div
                className="pointer-events-none absolute inset-0 bg-[#fbf6ec] rounded-[2px] shadow-[0_16px_36px_-6px_rgba(42,26,14,0.18),0_2px_8px_rgba(42,26,14,0.10)]"
                style={{
                  filter: "url(#faq-torn-edge)",
                }}
              />

              {/* Subtle parchment grain & gradient wash */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[2px] opacity-40 mix-blend-multiply"
                style={{
                  background:
                    "linear-gradient(176deg, rgba(255,255,255,0.6) 0%, rgba(246,238,226,0.3) 50%, rgba(235,220,200,0.4) 100%)",
                }}
              />

              {/* Crisp, Sharp HTML Accordion Content (5 items with generous spacing) */}
              <div className="relative z-10 flex h-full flex-col justify-between px-6 sm:px-7 md:px-[2.2vw] lg:px-9 xl:px-11 py-5 sm:py-6 md:py-[1.8vw] lg:py-8 xl:py-9 overflow-y-auto scrollbar-none">
                <div className="flex flex-col h-full justify-between">
                  {FAQ_ITEMS.map((item, idx) => {
                    const isOpen = openIndex === idx;
                    const isLast = idx === FAQ_ITEMS.length - 1;
                    return (
                      <div
                        key={item.id}
                        className={`flex flex-col ${
                          !isLast ? "border-b border-[#ddcdb8]/75" : ""
                        } transition-colors duration-200`}
                      >
                        <button
                          type="button"
                          onClick={() => handleToggle(idx)}
                          aria-expanded={isOpen}
                          aria-controls={`faq-answer-desktop-${idx}`}
                          id={`faq-question-desktop-${idx}`}
                          className="group flex w-full items-center justify-between py-2.5 sm:py-3 md:py-[0.9vw] lg:py-4 xl:py-4.5 text-left cursor-pointer transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#5b4837]"
                        >
                          <span className="font-serif text-[#271f18] text-sm sm:text-base md:text-[1.06vw] lg:text-[1.14rem] xl:text-[1.18rem] font-normal leading-snug tracking-[0.01em] transition-colors duration-200 group-hover:text-[#6a5340]">
                            {item.question}
                          </span>

                          {/* Circular (+) / Animated Close Icon */}
                          <span
                            className={`ml-4 flex h-5 w-5 sm:h-5.5 sm:w-5.5 md:h-[1.35vw] md:w-[1.35vw] md:max-h-6 md:max-w-6 flex-shrink-0 items-center justify-center rounded-full border border-[#83705d]/45 text-[#3e3025] transition-all duration-300 ${
                              isOpen
                                ? "rotate-45 bg-[#ede4d4]/80 border-[#4a3b2f]/70"
                                : "bg-transparent group-hover:border-[#4a3b2f]/70 group-hover:bg-[#f3ece0]/60"
                            }`}
                            aria-hidden="true"
                          >
                            <svg
                              width="8"
                              height="8"
                              viewBox="0 0 12 12"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                              className="transition-transform duration-300"
                            >
                              <line x1="6" y1="4.1" x2="6" y2="7.9" />
                              <line x1="4.1" y1="6" x2="7.9" y2="6" />
                            </svg>
                          </span>
                        </button>

                        {/* Smooth Animated Accordion Answer */}
                        <div
                          id={`faq-answer-desktop-${idx}`}
                          role="region"
                          aria-labelledby={`faq-question-desktop-${idx}`}
                          className={`grid transition-all duration-300 ease-in-out ${
                            isOpen
                              ? "grid-rows-[1fr] opacity-100 pb-3"
                              : "grid-rows-[0fr] opacity-0 pb-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <p className="font-serif text-[#554536] text-xs sm:text-[13px] md:text-[0.9vw] lg:text-[0.96rem] leading-[1.62] pr-8 text-left">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. MOBILE VIEW (< 768px)
          - The torn parchment (echo-bg-mobile.png) is the page; questions sit on it as an
            index with scroll-scrubbed motion and a word-by-word accordion
          ======================================================== */}
      <div className="md:hidden">
        <FaqMobile items={FAQ_ITEMS} openIndex={openIndex} onToggle={handleToggle} />
      </div>
    </section>
  );
};
