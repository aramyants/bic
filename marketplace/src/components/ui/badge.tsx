import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "default" | "success" | "warning" | "outline";
}

export const Badge = ({ className, tone = "default", ...props }: BadgeProps) => {
  const base = "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide";

  const variants: Record<Required<BadgeProps>["tone"], string> = {
    default: "bg-brand-primary/10 text-brand-primary border border-brand-primary/30",
    success: "bg-emerald-500/10 text-emerald-400 border border-emerald-400/30",
    warning: "bg-brand-warning/10 text-brand-warning border border-brand-warning/30",
    outline: "border border-white/20 text-white/90",
  };

  return <span className={cn(base, variants[tone], className)} {...props} />;
};

