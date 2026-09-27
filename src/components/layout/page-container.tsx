import React from "react";
import { cn } from "@/lib/utils";

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "main" | "section";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "7xl" | "full";
}

const maxWidthMap = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  "7xl": "max-w-7xl",
  full: "max-w-full",
};

export const PageContainer: React.FC<PageContainerProps> = ({
  as: Component = "div",
  maxWidth = "7xl",
  className,
  children,
  ...props
}) => {
  return (
    <Component
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", maxWidthMap[maxWidth], className)}
      {...props}
    >
      {children}
    </Component>
  );
};
