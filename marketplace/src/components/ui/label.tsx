import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = ({ className, children, required, ...props }: LabelProps) => (
  <label
    className={cn(
      "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-white/60",
      className,
    )}
    {...props}
  >
    {children}
    {required ? <span className="text-brand-warning">*</span> : null}
  </label>
);

