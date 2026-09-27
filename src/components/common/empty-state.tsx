import React from "react";
import { FolderSearch } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No data found",
  description = "There are no records matching your current criteria.",
  icon,
  actionText,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 p-8 text-center sm:p-12",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 shadow-2xs">
        {icon || <FolderSearch className="h-6 w-6" />}
      </div>
      <h3 className="mt-4 text-base font-semibold text-zinc-900">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-zinc-500">{description}</p>
      {actionText && onAction && (
        <div className="mt-6">
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};
