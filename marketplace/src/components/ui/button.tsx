import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "subtle"
  | "danger";

type ButtonSize = "lg" | "md" | "sm" | "xs";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-primary text-white shadow-strong hover:bg-brand-primary-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
  secondary:
    "bg-brand-surface text-white shadow-soft hover:bg-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
  ghost:
    "bg-transparent text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
  outline:
    "border border-white/10 text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
  subtle:
    "bg-white/8 text-white hover:bg-white/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
  danger:
    "bg-red-600 text-white hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400",
};

const sizeClasses: Record<ButtonSize, string> = {
  lg: "h-14 px-8 text-base font-semibold rounded-[42px]",
  md: "h-12 px-6 text-sm font-semibold rounded-[38px]",
  sm: "h-10 px-5 text-sm rounded-[32px]",
  xs: "h-9 px-4 text-xs rounded-[28px]",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-60",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="relative flex h-4 w-4 items-center justify-center">
            <span className="absolute h-4 w-4 animate-ping rounded-full bg-white/70" />
            <span className="relative h-2 w-2 rounded-full bg-white" />
          </span>
        ) : (
          icon
        )}
        <span className="font-semibold tracking-wide uppercase">{children}</span>
      </button>
    );
  },
);

Button.displayName = "Button";

