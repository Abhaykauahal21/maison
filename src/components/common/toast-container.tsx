"use client";

import React from "react";
import { useUiStore } from "@/store/ui-store";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUiStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-full max-w-sm flex-col gap-2"
    >
      {toasts.map((toast) => {
        const iconMap = {
          success: <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />,
          error: <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />,
          warning: <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />,
          info: <Info className="h-5 w-5 shrink-0 text-blue-600" />,
        };

        const borderMap = {
          success: "border-emerald-200 bg-white",
          error: "border-red-200 bg-white",
          warning: "border-amber-200 bg-white",
          info: "border-blue-200 bg-white",
        };

        return (
          <div
            key={toast.id}
            role="status"
            className={cn(
              "animate-in slide-in-from-bottom-5 pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg transition-all duration-200",
              borderMap[toast.type]
            )}
          >
            {iconMap[toast.type]}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-zinc-900">{toast.message}</p>
              {toast.description && (
                <p className="mt-0.5 text-xs leading-normal text-zinc-500">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="rounded p-1 text-zinc-400 transition-colors hover:text-zinc-600"
              aria-label="Dismiss toast"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
