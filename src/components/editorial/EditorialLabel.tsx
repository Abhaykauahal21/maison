import React from "react";

export interface EditorialLabelProps {
  children: React.ReactNode;
  className?: string;
  withLine?: boolean;
}

export const EditorialLabel: React.FC<EditorialLabelProps> = ({
  children,
  className = "",
  withLine = true,
}) => {
  return (
    <div
      className={`flex items-center gap-3 font-sans text-[11px] font-medium tracking-[0.28em] text-[#5c5043] uppercase select-none ${className}`}
    >
      {withLine && <span className="h-[1px] w-6 bg-[#8c7e6f]/60" aria-hidden="true" />}
      <span>{children}</span>
    </div>
  );
};
