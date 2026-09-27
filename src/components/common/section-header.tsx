import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  actions?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  description,
  align = "center",
  actions,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        actions && "sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className={cn("space-y-2", align === "center" && "mx-auto max-w-2xl")}>
        {badge && (
          <Badge variant="secondary" size="md">
            {badge}
          </Badge>
        )}
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">{title}</h2>
        {description && (
          <p className="text-sm leading-relaxed text-zinc-600 sm:text-base">{description}</p>
        )}
      </div>

      {actions && <div className="flex items-center gap-2 pt-2 sm:pt-0">{actions}</div>}
    </div>
  );
};
