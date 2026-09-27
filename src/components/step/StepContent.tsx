"use client";

import React from "react";

export interface StepContentProps {
  className?: string;
}

export const StepContent: React.FC<StepContentProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`relative flex h-full w-full flex-col justify-between text-left ${className}`}
    >
      {/* LEFT CONTENT */}
      <div className="absolute left-0 top-0 flex flex-col">

        {/* Main Heading */}
        <h2
          className="
            font-bodoni
            text-6xl
            sm:text-7xl
            md:text-7xl
            lg:text-[4.8vw]
            xl:text-[5.1vw]
            font-normal
            leading-[0.9]
            tracking-[0.015em]
            text-[#120e0a]
            uppercase
            whitespace-nowrap
          "
        >
          STEP 1
        </h2>

        {/* Subtitle */}
        <p
          className="
            mt-3
            font-serif
            text-lg
            sm:text-xl
            md:text-xl
            lg:text-[1.4vw]
            xl:text-[1.45vw]
            font-normal
            leading-[1.2]
            text-[#2a221a]
            tracking-wide
          "
        >
          A single step can change
          <br />
          the direction of her entire story.
        </p>

        {/* Description */}
        <p
          className="
            mt-5
            max-w-[400px]
            sm:max-w-[420px]
            lg:max-w-[24vw]
            font-sans
            text-[15px]
            sm:text-base
            md:text-base
            lg:text-[0.95vw]
            xl:text-[0.98vw]
            leading-[1.65]
            text-[#4a3e33]
            tracking-[0.01em]
          "
        >
          Step 1 is for the woman who has started —
          who knows that every big story begins
          with a brave, beautiful first step.
        </p>

        {/* CTA */}
        <div className="mt-7">
          <button
            type="button"
            className="
              group
              inline-flex
              cursor-pointer
              items-center
              space-x-4
              border
              border-[#221c17]
              bg-transparent
              px-7
              py-3.5
              sm:px-8
              sm:py-4
              lg:px-7
              lg:py-3
              text-xs
              sm:text-sm
              lg:text-[0.8vw]
              font-sans
              font-medium
              tracking-[0.2em]
              text-[#1c1815]
              uppercase
              transition-all
              duration-300
              hover:bg-[#1c1815]
              hover:text-[#f7f4ee]
              active:scale-[0.98]
            "
          >
            <span>EXPLORE STEP 1</span>

            <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};