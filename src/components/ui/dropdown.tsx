"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/use-click-outside";

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: (DropdownItem | { divider: true })[];
  align?: "left" | "right";
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = "right",
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className="inline-flex cursor-pointer"
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={cn(
            "animate-in fade-in zoom-in-95 absolute z-50 mt-2 w-52 origin-top-right rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg ring-1 ring-black/5 focus:outline-none",
            align === "right" ? "right-0" : "left-0",
            className
          )}
        >
          {items.map((item, index) => {
            if ("divider" in item) {
              return <div key={index} className="my-1 border-t border-zinc-100" />;
            }

            return (
              <button
                key={item.id}
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick();
                    setIsOpen(false);
                  }
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors sm:text-sm",
                  item.danger
                    ? "text-red-600 hover:bg-red-50"
                    : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
                  item.disabled && "cursor-not-allowed opacity-50"
                )}
              >
                {item.icon && <span className="h-4 w-4 text-current">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
