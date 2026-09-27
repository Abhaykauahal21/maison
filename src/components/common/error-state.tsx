import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "An error occurred while loading this section. Please try again.",
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-red-200/60 bg-red-50/30 p-8 text-center sm:p-12",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 shadow-2xs">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-zinc-900">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-zinc-600">{message}</p>
      {onRetry && (
        <div className="mt-6">
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
};
