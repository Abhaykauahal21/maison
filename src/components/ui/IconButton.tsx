import React from "react";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  className = "",
  ...props
}) => {
  return (
    <button
      type="button"
      aria-label={label}
      className={`inline-flex cursor-pointer items-center justify-center p-2 text-white/90 transition-all duration-200 hover:scale-105 hover:text-white focus-visible:ring-1 focus-visible:ring-white/50 focus-visible:outline-none active:scale-95 ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
};
