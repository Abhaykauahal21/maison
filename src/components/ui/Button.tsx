import React from "react";
import { Spinner } from "@/components/ui/spinner";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "group inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none";

    // Size variants
    let sizeStyles = "text-xs tracking-[0.18em] px-7 py-3.5";
    if (size === "sm") {
      sizeStyles = "text-[11px] tracking-[0.15em] px-4 py-2";
    } else if (size === "lg") {
      sizeStyles = "text-sm tracking-[0.2em] px-9 py-4";
    }

    // Color/Visual variants
    let variantStyles = "";
    switch (variant) {
      case "primary":
        variantStyles =
          "bg-[#f6f4ee] hover:bg-white text-zinc-900 shadow-sm hover:shadow-md active:bg-[#edebe4] uppercase";
        break;
      case "secondary":
        variantStyles = "bg-white/10 hover:bg-white/20 text-white border border-white/20 uppercase";
        break;
      case "outline":
        variantStyles =
          "border border-white/60 hover:border-white text-white bg-transparent hover:bg-white/10 uppercase";
        break;
      case "ghost":
        variantStyles = "text-white hover:text-white/80 hover:bg-white/5";
        break;
      case "danger":
        variantStyles = "bg-red-600 hover:bg-red-700 text-white uppercase";
        break;
    }

    const widthStyles = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${widthStyles} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Spinner size="sm" className="mr-2" />
        ) : leftIcon ? (
          <span className="mr-2.5">{leftIcon}</span>
        ) : null}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
