"use client";

import React from "react";
import Image from "next/image";
import { EchoCard } from "@/components/editorial/EchoCard";

const echoCollections = [
  {
    title: "SOLACE",
    descLines: ["For the moments", "she finds herself."],
    imageSrc: "/images/solace.webp",
    imageAlt: "Maison D'Vine Solace Gown in Floral Silk",
    objectPosition: "50% 15%",
  },
  {
    title: "LONGING",
    descLines: ["For what lives", "between hearts."],
    imageSrc: "/images/longing.webp",
    imageAlt: "Maison D'Vine Longing Gown in Crimson Tulle",
    objectPosition: "50% 15%",
  },
  {
    title: "REVERIE",
    descLines: ["For the dreams", "she doesn't say out loud."],
    imageSrc: "/images/reverie.webp",
    imageAlt: "Maison D'Vine Reverie Gown in Noir Satin",
    objectPosition: "50% 15%",
  },
];

export const EditorialSection: React.FC = () => {
  return (
    <section
      id="story"
      className="relative z-30 -mt-10 w-full bg-transparent text-[#221c17] select-none sm:-mt-14 md:-mt-18 lg:-mt-24 xl:-mt-28"
    >
      {/* ========================================================
          1. DESKTOP & TABLET EDITORIAL LAYOUT (md: 768px+)
          Uses natural image in document flow:
          - Zero cropping
          - Natural aspect ratio (2048 × 846)
          - Left editorial content aligned at ~15.2%
          - Right 3 portrait cards grouped tightly starting at ~45%
          - High z-index with negative top margin overlapping the hero
          ======================================================== */}
      <div
        className="relative hidden w-full overflow-visible md:block"
        style={{
          filter:
            "drop-shadow(0px -10px 22px rgba(0,0,0,0.5)) drop-shadow(0px 14px 24px rgba(0,0,0,0.55))",
        }}
      >
        {/* Exact background asset in normal flow - NO CROP, NO STRETCH */}
        <Image
          src="/images/echo-bg.png"
          alt="The Echo Parchment"
          width={2048}
          height={846}
          loading="lazy"
          unoptimized
          className="pointer-events-none block h-auto w-full select-none"
        />

        {/* Content layer positioned proportionally over the parchment matching IMAGE 1 */}
        <div className="pointer-events-auto absolute inset-0 z-10">
          {/* Left Text Column */}
          <div className="absolute top-[17%] left-[15.2%] z-20 flex w-[28%] max-w-[410px] flex-col text-left">
            {/* CHAPTER 0 */}
            <div className="font-sans text-[11px] sm:text-xs md:text-[1.1vw] lg:text-[0.82vw] font-medium tracking-[0.25em] text-[#3a3026] uppercase select-none">
              CHAPTER 0
            </div>

            {/* THE ECHO */}
            <h2 className="mt-1 font-bodoni text-3xl sm:text-4xl md:text-[3.8vw] lg:text-[4.2vw] xl:text-[4.5vw] font-normal leading-[0.92] tracking-[0.025em] text-[#14100c] uppercase">
              THE ECHO
            </h2>

            {/* Subtitle */}
            <p className="mt-2 md:mt-3 font-serif italic text-sm sm:text-base md:text-[1.35vw] lg:text-[1.3vw] text-[#2c231b] tracking-wide">
              Before every dream, there is an echo.
            </p>

            {/* Description */}
            <p className="mt-2.5 md:mt-4 max-w-[370px] font-sans text-xs sm:text-[13px] md:text-[1vw] lg:max-w-[22vw] lg:text-[0.9vw] leading-[1.65] text-[#4a3e33] tracking-[0.015em]">
              The Echo Collection captures the quiet thoughts, fleeting emotions, and unspoken
              desires that live within every woman.
            </p>

            {/* CTA */}
            <div className="mt-4 md:mt-6 lg:mt-8">
              <button
                type="button"
                className="group inline-flex cursor-pointer items-center space-x-3 md:space-x-4 border border-[#221c17] bg-transparent px-4 py-2 md:px-5 md:py-2.5 lg:px-7 lg:py-3 text-[10px] md:text-[0.9vw] lg:text-[0.76vw] font-sans font-medium tracking-[0.2em] text-[#1c1815] uppercase transition-all duration-300 hover:bg-[#1c1815] hover:text-[#f4efe8]"
              >
                <span>EXPLORE THE ECHO</span>
                <span className="text-xs transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </div>

          {/* Right Side Cards */}
          <div className="absolute top-[13.5%] left-[45%] z-20 flex w-[50.5%] gap-3 md:gap-4 lg:gap-5 xl:gap-6">
            {echoCollections.map((col) => (
              <div key={col.title} className="flex-1">
                <EchoCard
                  title={col.title}
                  descLines={col.descLines as [string, string]}
                  imageSrc={col.imageSrc}
                  imageAlt={col.imageAlt}
                  objectPosition={col.objectPosition}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================
          2. MOBILE EDITORIAL LAYOUT (< 768px)
          Exact match to Reference Screenshot media_1790504424306.png
          100% Full Width Edge-to-Edge using echo-bg-mobile.png
          ======================================================== */}
      <div className="relative block w-full px-0 py-0 overflow-hidden md:hidden">
        <div className="relative w-full overflow-hidden">
          {/* Exact Mobile Parchment Asset (487 x 1024) spanning 100% full width */}
          <Image
            src="/images/echo-bg-mobile.png"
            alt="The Echo Parchment"
            width={487}
            height={1024}
            loading="lazy"
            unoptimized
            className="pointer-events-none block h-auto w-full select-none"
          />

          {/* Overlay content matching exact positions from reference screenshot */}
          <div className="pointer-events-auto absolute inset-0 z-10">
            {/* Top Text Block: Left-aligned, clearing dried flowers on top right */}
            <div className="absolute top-[6.8%] left-[8%] right-[22%] z-20 flex flex-col text-left">
              {/* CHAPTER 0 */}
              <div className="font-sans text-[11px] xs:text-[12px] font-medium tracking-[0.25em] text-[#3a3026] uppercase select-none">
                CHAPTER 0
              </div>

              {/* THE ECHO */}
              <h2 className="mt-1 font-bodoni text-[30px] xs:text-[34px] sm:text-[38px] font-normal leading-[0.92] tracking-[0.02em] text-[#14100c] uppercase">
                THE ECHO
              </h2>

              {/* Subtitle */}
              <p className="mt-2 font-serif italic text-[13.5px] xs:text-[15px] leading-tight text-[#2c231b] tracking-wide">
                Before every dream, there is an echo.
              </p>

              {/* Description */}
              <p className="mt-3 font-sans text-[11px] xs:text-[12px] sm:text-[13px] leading-[1.55] font-light text-[#44382c] tracking-[0.015em]">
                The Echo Collection captures the quiet thoughts, fleeting emotions, and unspoken
                desires that live within every woman.
              </p>

              {/* EXPLORE THE ECHO Button */}
              <div className="mt-3.5 xs:mt-4.5">
                <button
                  type="button"
                  className="group inline-flex cursor-pointer items-center space-x-3.5 border border-[#221c17] bg-transparent px-5 py-2.5 xs:px-6 xs:py-3 text-[10.5px] xs:text-[11.5px] font-sans font-medium tracking-[0.2em] text-[#1c1815] uppercase transition-all duration-300 hover:bg-[#1c1815] hover:text-[#f4efe8]"
                >
                  <span>EXPLORE THE ECHO</span>
                  <span className="text-xs transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            </div>

            {/* Card 1: SOLACE */}
            <div className="absolute top-[42.5%] left-[8%] right-[8%] h-[15.3%] z-20">
              <EchoCard
                variant="horizontal"
                title={echoCollections[0].title}
                descLines={echoCollections[0].descLines as [string, string]}
                imageSrc={echoCollections[0].imageSrc}
                imageAlt={echoCollections[0].imageAlt}
                objectPosition={echoCollections[0].objectPosition}
              />
            </div>

            {/* Card 2: LONGING */}
            <div className="absolute top-[60.1%] left-[8%] right-[8%] h-[15.3%] z-20">
              <EchoCard
                variant="horizontal"
                title={echoCollections[1].title}
                descLines={echoCollections[1].descLines as [string, string]}
                imageSrc={echoCollections[1].imageSrc}
                imageAlt={echoCollections[1].imageAlt}
                objectPosition={echoCollections[1].objectPosition}
              />
            </div>

            {/* Card 3: REVERIE */}
            <div className="absolute top-[77.8%] left-[8%] right-[8%] h-[15.3%] z-20">
              <EchoCard
                variant="horizontal"
                title={echoCollections[2].title}
                descLines={echoCollections[2].descLines as [string, string]}
                imageSrc={echoCollections[2].imageSrc}
                imageAlt={echoCollections[2].imageAlt}
                objectPosition={echoCollections[2].objectPosition}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
