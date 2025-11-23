import * as React from "react";

import { cn } from "@/lib/utils";

export interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked = false, onClick, ...props }, ref) => (
    <button
      ref={ref}
      role="switch"
      aria-checked={checked}
      onClick={onClick}
      className={cn(
        "flex h-9 w-16 items-center rounded-full border border-white/10 bg-white/12 px-1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
        checked ? "bg-brand-primary" : "bg-white/5",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "inline-flex h-7 w-8 transform items-center justify-center rounded-full bg-white/95 text-[11px] font-semibold leading-none text-black transition",
          checked ? "translate-x-6" : "translate-x-0",
        )}
      >
        {checked ? "Юр" : "Физ"}
      </span>
    </button>
  ),
);

Switch.displayName = "Switch";
