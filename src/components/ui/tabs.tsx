"use client";

import React, { createContext, useContext, useId } from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs compound components must be rendered within a Tabs provider.");
  }
  return context;
}

export interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value,
  onValueChange,
  className,
  children,
}) => {
  const [internalTab, setInternalTab] = React.useState(defaultValue);
  const baseId = useId();

  const activeTab = value !== undefined ? value : internalTab;
  const setActiveTab = (newTab: string) => {
    if (value === undefined) setInternalTab(newTab);
    onValueChange?.(newTab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, baseId }}>
      <div className={cn("w-full space-y-4", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

export type TabsListProps = React.HTMLAttributes<HTMLDivElement>;

export const TabsList: React.FC<TabsListProps> = ({ className, children, ...props }) => {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex h-11 items-center justify-start rounded-xl border border-zinc-200/60 bg-zinc-100 p-1 text-zinc-600",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  className,
  children,
  ...props
}) => {
  const { activeTab, setActiveTab, baseId } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      type="button"
      id={`${baseId}-tab-${value}`}
      aria-controls={`${baseId}-panel-${value}`}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      onClick={() => setActiveTab(value)}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-lg px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 sm:text-sm",
        isActive
          ? "bg-white font-semibold text-zinc-900 shadow-xs"
          : "text-zinc-600 hover:bg-zinc-200/50 hover:text-zinc-900",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  className,
  children,
  ...props
}) => {
  const { activeTab, baseId } = useTabsContext();
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      tabIndex={0}
      className={cn(
        "animate-in fade-in-50 duration-200 focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:outline-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
