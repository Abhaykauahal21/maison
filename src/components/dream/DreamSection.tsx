"use client";

import React from "react";
import { DreamFilm } from "@/components/dream/DreamFilm";
import { DreamDesktop } from "@/components/dream/DreamDesktop";

export const DreamSection: React.FC = () => {
  return (
    <section
      id="dream"
      className="relative z-10 -mt-1.5 w-full bg-[#0a0908] text-white select-none sm:-mt-2 md:-mt-3.5 lg:-mt-5 xl:-mt-6"
    >
      {/* Desktop (lg+): landscape plate, camera dolly + three scrubbed beats */}
      <div className="hidden lg:block">
        <DreamDesktop />
      </div>

      {/* Phone / tablet: portrait scroll-scrubbed film */}
      <div className="block lg:hidden">
        <DreamFilm />
      </div>
    </section>
  );
};
