"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ label, icon, className }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
      role="button"
      aria-label={typeof label === "string" ? label : undefined}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-semibold text-white/90">
        {icon ?? "?"}
      </span>
      <span
        className={cn(
          "pointer-events-none absolute left-1/2 top-full z-20 mt-3 w-[200px] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-2xl border border-white/10 bg-black/90 px-4 py-3 text-xs text-white opacity-0 shadow-soft transition-opacity sm:w-64",
          open && "opacity-100",
        )}
      >
        {label}
        <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border border-white/10 border-b-0 border-r-0 bg-black/90" />
      </span>
    </span>
  );
};

