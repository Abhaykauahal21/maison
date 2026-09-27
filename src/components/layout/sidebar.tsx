"use client";

import React from "react";
import Link from "next/link";
import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Layers,
  Database,
  Sliders,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

export interface SidebarItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
}

const items: SidebarItem[] = [
  { title: "Overview", icon: LayoutDashboard, href: "#" },
  { title: "Design System", icon: Layers, href: "#components" },
  { title: "Service Layer", icon: Database, href: "#architecture" },
  { title: "Configuration", icon: Sliders, href: "#" },
];

export const Sidebar: React.FC = () => {
  const { isSidebarCollapsed, toggleSidebar } = useUiStore();

  return (
    <aside
      className={cn(
        "relative hidden flex-col border-r border-zinc-200 bg-white transition-all duration-300 lg:flex",
        isSidebarCollapsed ? "w-18" : "w-64"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between border-b border-zinc-100 px-4">
        {!isSidebarCollapsed && (
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              Workspace
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={toggleSidebar}
          className={cn(
            "rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600",
            isSidebarCollapsed && "mx-auto"
          )}
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const Icon = item.icon;
          const linkContent = (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950",
                isSidebarCollapsed && "justify-center px-0"
              )}
            >
              <Icon className="h-5 w-5 shrink-0 text-zinc-500" />
              {!isSidebarCollapsed && <span>{item.title}</span>}
            </Link>
          );

          if (isSidebarCollapsed) {
            return (
              <Tooltip key={item.title} content={item.title} position="right">
                {linkContent}
              </Tooltip>
            );
          }

          return linkContent;
        })}
      </nav>

      {/* Bottom Status Card */}
      <div className="border-t border-zinc-100 p-3">
        {!isSidebarCollapsed ? (
          <div className="rounded-xl border border-zinc-200/60 bg-zinc-50 p-3">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-800">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Production-Ready</span>
            </div>
            <p className="mt-1 text-[11px] leading-tight text-zinc-500">
              TypeScript strict mode enabled. Ready for API consumption.
            </p>
          </div>
        ) : (
          <div className="flex justify-center py-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>
        )}
      </div>
    </aside>
  );
};
