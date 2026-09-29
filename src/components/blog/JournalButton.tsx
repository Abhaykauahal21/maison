"use client";

import React from "react";
import Link from "next/link";

interface JournalButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
}

export const JournalButton: React.FC<JournalButtonProps> = ({
  href = "#journal",
  onClick,
  className = "",
}) => {
  const content = (
    <>
      <span className="tracking-[0.22em]">READ OUR JOURNAL</span>
      <span className="text-xs transition-transform duration-300 ease-out group-hover:translate-x-1.5" aria-hidden="true">
        &rarr;
      </span>
    </>
  );

  const baseClasses = `group inline-flex items-center justify-between gap-6 border border-[#2b2118]/85 bg-[#fbf7ee] px-7 sm:px-8 py-3 text-[11px] sm:text-xs font-serif font-medium uppercase text-[#1c1510] shadow-[0_4px_16px_rgba(0,0,0,0.22)] transition-all duration-300 hover:bg-[#ede3d1] hover:scale-[1.02] active:scale-[0.99] cursor-pointer ${className}`;

  if (href.startsWith("#")) {
    return (
      <a href={href} onClick={onClick} className={baseClasses}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={baseClasses}>
      {content}
    </Link>
  );
};
