"use client";

import React from "react";

export const JournalBackground: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden select-none" aria-hidden="true">
      <svg
        className="h-full w-full object-cover"
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Subtle paper grain texture pattern */}
          <pattern id="journal-parchment-grain" width="120" height="120" patternUnits="userSpaceOnUse">
            <rect width="120" height="120" fill="transparent" />
            <circle cx="15" cy="25" r="0.75" fill="#3a2a1a" opacity="0.04" />
            <circle cx="75" cy="85" r="0.85" fill="#3a2a1a" opacity="0.04" />
            <circle cx="45" cy="55" r="0.65" fill="#3a2a1a" opacity="0.03" />
            <circle cx="105" cy="35" r="0.75" fill="#3a2a1a" opacity="0.03" />
          </pattern>

          {/* Organic Torn Paper Edge Filter */}
          <filter id="journal-torn-top" x="-5%" y="-10%" width="110%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.038" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* Soft vignette gradient */}
          <radialGradient id="journal-vignette" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0" />
            <stop offset="65%" stopColor="#000000" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.75" />
          </radialGradient>

          {/* Subtle warm wash */}
          <linearGradient id="journal-warm-wash" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a120b" stopOpacity="0.5" />
            <stop offset="40%" stopColor="#120c07" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0a0705" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* 1. Base dark vignette and atmospheric depth */}
        <rect width="1920" height="1080" fill="url(#journal-vignette)" />
        <rect width="1920" height="1080" fill="url(#journal-warm-wash)" />

        {/* 2. Top Torn Paper Underlap Edge (Creates that tactile scrapbook transition from FAQ) */}
        <path
          d="M0,0 L1920,0 L1920,38 Q1820,32 1740,42 Q1640,48 1520,36 Q1410,26 1300,44 Q1180,50 1060,34 Q940,24 810,42 Q680,48 550,32 Q420,22 290,40 Q160,46 0,35 Z"
          fill="#fbf7ee"
          fillOpacity="0.08"
          filter="url(#journal-torn-top)"
        />
        <path
          d="M0,0 L1920,0 L1920,24 Q1790,18 1680,26 Q1560,32 1430,22 Q1310,14 1190,28 Q1050,32 920,20 Q800,14 670,26 Q520,30 380,18 Q230,12 0,22 Z"
          fill="#ede2d0"
          fillOpacity="0.12"
          filter="url(#journal-torn-top)"
        />

        {/* 3. Subtle Film Strip Accents on Far Left & Right Borders */}
        <g opacity="0.22" stroke="#e8ded0" strokeWidth="0.8">
          {/* Left film perforations */}
          <rect x="24" y="160" width="12" height="18" rx="2" fill="none" />
          <rect x="24" y="210" width="12" height="18" rx="2" fill="none" />
          <rect x="24" y="260" width="12" height="18" rx="2" fill="none" />
          <rect x="24" y="310" width="12" height="18" rx="2" fill="none" />
          <rect x="24" y="360" width="12" height="18" rx="2" fill="none" />
          <line x1="44" y1="140" x2="44" y2="400" strokeDasharray="3 4" />

          {/* Right film perforations */}
          <rect x="1884" y="180" width="12" height="18" rx="2" fill="none" />
          <rect x="1884" y="230" width="12" height="18" rx="2" fill="none" />
          <rect x="1884" y="280" width="12" height="18" rx="2" fill="none" />
          <rect x="1884" y="330" width="12" height="18" rx="2" fill="none" />
          <line x1="1876" y1="160" x2="1876" y2="370" strokeDasharray="3 4" />
        </g>

        {/* 4. Delicate Botanical / Floral Line-Art Accents */}
        <g stroke="#f3e8d8" strokeWidth="0.85" fill="none" opacity="0.18">
          {/* Top-right subtle botanical branch */}
          <path d="M1720,90 Q1760,110 1820,95 Q1880,80 1910,110" />
          <path d="M1750,105 Q1765,95 1775,102" />
          <path d="M1780,100 Q1800,90 1810,105" />
          <path d="M1825,93 Q1845,82 1855,96" />
          <path d="M1865,88 Q1885,80 1895,95" />

          {/* Bottom-left subtle floral flourish */}
          <path d="M60,980 Q110,950 160,970 Q210,990 260,965" />
          <path d="M90,968 Q100,955 112,964" />
          <path d="M135,960 Q145,948 158,958" />
          <path d="M185,980 Q195,968 208,976" />
        </g>

        {/* 5. Neoclassical Architectural Line-Art Flourishes (Arch & Pediment Motifs) */}
        <g stroke="#e2d2be" strokeWidth="0.65" fill="none" opacity="0.15">
          {/* Upper center framing arch */}
          <path d="M860,65 Q960,35 1060,65" />
          <line x1="840" y1="68" x2="1080" y2="68" />
          <circle cx="960" cy="46" r="3" />
        </g>

        {/* 6. Overall paper texture overlay */}
        <rect width="1920" height="1080" fill="url(#journal-parchment-grain)" />
      </svg>
    </div>
  );
};
