"use client";

import React from "react";
import Image from "next/image";
import { StepContent } from "@/components/step/StepContent";
import { StepPhoto } from "@/components/step/StepPhoto";
import { StepDetails } from "@/components/step/StepDetails";

export const StepSection: React.FC = () => {
  return (
    <section
      id="step-1"
      className="relative z-20 -mt-1 w-full bg-transparent text-[#1c1815] select-none sm:-mt-2 md:-mt-3 lg:-mt-4 xl:-mt-5 drop-shadow-[0_-10px_20px_rgba(0,0,0,0.4)]"
    >
      {/* ========================================================
          1. DESKTOP & TABLET EDITORIAL LAYOUT (md: 768px+)
          Uses natural image in document flow:
          - Full width edge-to-edge (straight on left and right)
          - Left editorial text & CTA aligned at 6.5%
          - Central photo frame containing crimson gown model
          - Right-bottom editorial details (THE BEGINNING, VIEW DETAILS →)
          ======================================================== */}
      <div className="relative hidden w-full overflow-visible md:block">
        {/* Full width edge-to-edge background asset (step-bg.webp) */}
        <Image
          src="/images/step-bg.webp"
          alt="Maison D'Vine Step 1 Vintage Scrapbook Paper"
          width={1952}
          height={848}
          priority
          unoptimized
          className="pointer-events-none block h-auto w-full select-none"
        />

        {/* Content layer positioned proportionally over the paper matching reference */}
        <div className="pointer-events-auto absolute inset-0 z-20">
          {/* Left Column: STEP 1, Subtitle, Description, CTA */}
          <div className="absolute top-[18.5%] bottom-[13%] left-[6.5%] z-20 flex w-[26%] flex-col justify-between">
            <StepContent />
          </div>

          {/* Center Column: Photo Frame containing model in crimson gown */}
          <div className="absolute top-[17.5%] left-[44.7%] z-20 h-[67%] w-[24.4%]">
            <StepPhoto
              imageSrc="/images/step-model.webp"
              imageAlt="Maison D'Vine Crimson Gown Model"
              className="h-full w-full rounded-[1px] border border-[#cfc4b5]/70"
            />
          </div>

          {/* Right Bottom Corner: THE BEGINNING, A step towards becoming her., VIEW DETAILS → */}
          <div className="absolute right-[7.5%] bottom-[10.5%] z-20 w-[18%] max-w-[260px]">
            <StepDetails />
          </div>
        </div>
      </div>

      {/* ========================================================
          2. MOBILE EDITORIAL LAYOUT (< 768px)
          Exact match to Reference Screenshot media_1790505231799.png
          100% Full Width Edge-to-Edge using step-bg-mobile.jpg provided by user
          ======================================================== */}
      <div className="relative block w-full px-0 py-0 overflow-hidden md:hidden">
        <div className="relative w-full overflow-hidden">
          {/* Exact Mobile Paper Asset (541 x 1024) spanning 100% full width */}
          <Image
            src="/images/step-bg-mobile.jpg"
            alt="Maison D'Vine Step 1 Scrapbook Paper"
            width={541}
            height={1024}
            priority
            unoptimized
            className="pointer-events-none block h-auto w-full select-none"
          />

          {/* Content overlay positioned exactly over the paper */}
          <div className="pointer-events-auto absolute inset-0 z-10">
            {/* Top Editorial Text Block */}
            <div className="absolute top-[6.8%] left-[8.5%] right-[8.5%] z-20 flex flex-col text-left">
              {/* STEP 1 */}
              <h2 className="font-bodoni text-[38px] xs:text-[44px] sm:text-[48px] font-normal leading-[0.92] tracking-[0.015em] text-[#120e0a] uppercase whitespace-nowrap">
                STEP 1
              </h2>

              {/* Subtitle */}
              <p className="mt-2.5 xs:mt-3 font-serif italic text-[14px] xs:text-[15.5px] sm:text-[17px] leading-[1.2] text-[#2a221a] tracking-wide">
                A single step can change
                <br />
                the direction of her entire story.
              </p>

              {/* Description */}
              <p className="mt-3 xs:mt-3.5 max-w-[290px] xs:max-w-[320px] font-sans text-[11px] xs:text-[12px] sm:text-[13px] leading-[1.5] font-light text-[#4a3e33] tracking-[0.01em]">
                Step 1 is for the woman who has started — who knows that every big story begins with a brave, beautiful first step.
              </p>

              {/* EXPLORE STEP 1 Button */}
              <div className="mt-3.5 xs:mt-4">
                <button
                  type="button"
                  className="group inline-flex cursor-pointer items-center space-x-3.5 border border-[#221c17] bg-transparent px-5 py-2.5 xs:px-6 xs:py-3 text-[10.5px] xs:text-[11.5px] font-sans font-medium tracking-[0.16em] text-[#1c1815] uppercase transition-all duration-300 hover:bg-[#1c1815] hover:text-[#f7f4ee] active:scale-[0.98]"
                >
                  <span>EXPLORE STEP 1</span>
                  <span className="text-xs transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            </div>

            {/* Central Model Photo inside the Frame */}
            <div className="absolute top-[39.5%] left-[20.7%] z-20 h-[30%] w-[51.4%] -rotate-[3.2deg] overflow-hidden shadow-xs">
              <Image
                src="/images/step-model.webp"
                alt="Maison D'Vine Model in Crimson Gown Touching Stone Wall"
                fill
                priority
                unoptimized
                sizes="(max-width: 640px) 280px, 340px"
                className="pointer-events-none object-cover object-[52%_22%]"
              />
              <div
                className="pointer-events-none absolute inset-0 shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]"
                aria-hidden="true"
              />
            </div>

            {/* Handwritten Quote below the Photo (moved down to clear photo frame & paper decorations) */}
            <div className="absolute top-[74.8%] left-[8.5%] z-20">
              <div
                className="font-script -rotate-[3deg] text-left text-[21px] xs:text-[24px] sm:text-[26px] leading-[1.05] text-[#1c1815] select-none"
                aria-label="It always starts with a single step."
              >
                <div>It always starts</div>
                <div className="pl-1">with a single step.</div>
              </div>
            </div>

            {/* Bottom Editorial Details: THE BEGINNING, A step towards becoming her. →, VIEW DETAILS → */}
            <div className="absolute top-[83.6%] left-[8.5%] right-[8.5%] z-20 flex flex-col text-left">
              <h3 className="font-bodoni text-[13.5px] xs:text-[15px] sm:text-[16px] font-normal tracking-[0.2em] text-[#1c1815] uppercase">
                THE BEGINNING
              </h3>

              <div className="mt-1.5 flex items-center space-x-2 font-serif text-[12px] xs:text-[13px] leading-tight text-[#4a3e33] italic tracking-wide">
                <span>A step towards becoming her.</span>
                <span className="text-xs">→</span>
              </div>

              <div className="group mt-2.5 inline-flex cursor-pointer items-center space-x-2.5 text-[9.5px] xs:text-[10.5px] font-sans font-medium tracking-[0.2em] text-[#221c17] uppercase transition-colors hover:text-black">
                <span>VIEW DETAILS</span>
                <span className="text-xs transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
