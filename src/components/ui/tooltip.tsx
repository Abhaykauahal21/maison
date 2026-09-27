"use client";

import React, { useState, useId } from "react";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  content: string;
  children: React.ReactElement;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

const positionClasses = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useId();

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      aria-describedby={isVisible ? tooltipId : undefined}
    >
      {children}
      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={cn(
            "animate-in fade-in zoom-in-95 pointer-events-none absolute z-50 rounded-md bg-zinc-900 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-white shadow-md",
            positionClasses[position],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};
