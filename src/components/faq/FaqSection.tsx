"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaqMobile } from "@/components/faq/FaqMobile";
import { FaqDesktop } from "@/components/faq/FaqDesktop";
import { useMatches } from "@/hooks/use-matches";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "different",
    question: "What makes Maison D’Vine different?",
    answer:
      "Every Maison D’Vine creation is conceived as a living story rather than a fleeting trend. We craft small-batch capsule pieces using heirloom-quality silks, hand-guided embroidery, and intentional silhouettes designed to bring effortless poetry to your every day.",
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
  // The first question starts open, so the page never looks like an empty list
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const wide = useMatches("(min-width: 768px)");

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions"
      className="relative z-30 w-full select-none bg-transparent -mt-[10vw] md:-mt-16 lg:-mt-22 xl:-mt-28"
    >
      {/* ========================================================
          1. DESKTOP & TABLET VIEW (md: 768px+)
          - /images/FAQ-page-web.webp (1672 x 941) is the page; overlaps OurStory (z-30 over z-20
            with negative top margin)
          - Left: heading, poem, handwritten note, button. Right: the questions as an index
            sitting straight on the paper, with scroll-scrubbed reveals and a word-by-word accordion
          ======================================================== */}
      {wide !== false && (
        <div className="relative hidden w-full overflow-x-clip md:block">
          <Image
            src="/images/FAQ-page-web.webp"
            alt="Maison D'Vine FAQ - Scrapbook of Curiosities"
            width={1672}
            height={941}
            quality={100}
            unoptimized
            className="pointer-events-none block h-auto w-full select-none drop-shadow-[0_-12px_24px_rgba(0,0,0,0.5)]"
            style={{ width: "100%", height: "auto" }}
          />
          <FaqDesktop items={FAQ_ITEMS} openIndex={openIndex} onToggle={handleToggle} />
        </div>
      )}

      {/* ========================================================
          2. MOBILE VIEW (< 768px)
          - The torn parchment (echo-bg-mobile.webp) is the page; questions sit on it as an
            index with scroll-scrubbed motion and a word-by-word accordion
          ======================================================== */}
      {wide !== true && (
        <div className="relative md:hidden">
          {/* Soft upward shadow cast onto the section above (static, replaces the old section-wide filter) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-5 -translate-y-full bg-gradient-to-t from-black/35 to-transparent"
          />
          <FaqMobile items={FAQ_ITEMS} openIndex={openIndex} onToggle={handleToggle} />
        </div>
      )}
    </section>
  );
};
