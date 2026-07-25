import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "danger" | "warning" | "ghost" | "cyan" | "violet";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const baseStyle = "inline-flex items-center justify-center font-mono font-semibold tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/30 border active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-lg cursor-pointer";

    const variants = {
      default: "bg-sky-600 hover:bg-sky-700 text-white border-sky-600 shadow-xs hover:shadow-sm",
      outline: "bg-white dark:bg-[#0e1424] hover:bg-slate-50 dark:hover:bg-[#141c30] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-[#1e2945] hover:border-slate-400 dark:hover:border-sky-800 shadow-2xs",
      danger: "bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-xs hover:shadow-sm",
      warning: "bg-amber-600 hover:bg-amber-700 text-white border-amber-600 font-bold shadow-xs hover:shadow-sm",
      cyan: "bg-sky-600 hover:bg-sky-700 text-white border-sky-600 font-bold shadow-xs hover:shadow-sm",
      violet: "bg-violet-600 hover:bg-violet-700 text-white border-violet-600 font-bold shadow-xs hover:shadow-sm",
      ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-[#141c30] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border-transparent",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs uppercase",
      md: "h-9 px-4 text-xs uppercase",
      lg: "h-11 px-6 text-sm uppercase",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyle, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
