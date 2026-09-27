import { ReactNode } from "react";

export type ComponentSize = "sm" | "md" | "lg";

export type ComponentVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";

export type AsyncStatus = "idle" | "loading" | "success" | "error";

export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface BaseProps {
  className?: string;
  children?: ReactNode;
}
