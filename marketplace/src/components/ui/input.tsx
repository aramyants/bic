import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-12 w-full rounded-[30px] border border-white/10 bg-black/40 px-5 text-sm text-white outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 placeholder:text-white/40",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[140px] w-full rounded-[30px] border border-white/10 bg-black/40 px-5 py-4 text-sm text-white outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 placeholder:text-white/40",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

