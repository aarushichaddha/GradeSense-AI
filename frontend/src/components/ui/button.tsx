import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "danger" | "warning" | "ghost" | "cyan" | "success";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const baseStyle =
      "inline-flex items-center justify-center font-sans font-semibold tracking-tight transition-all duration-200 focus:outline-none active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none rounded-xl cursor-pointer";

    const variants = {
      // Primary — strong blue CTA
      default:
        "bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/30 shadow-sm hover:shadow-md hover:shadow-blue-500/20 hover:-translate-y-0.5",

      // Secondary — visible border, neutral fill that works in both light & dark
      outline:
        "bg-transparent text-zinc-600 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-500 hover:-translate-y-0.5 shadow-none",

      // Danger — red destructive action
      danger:
        "bg-red-600 hover:bg-red-500 text-white border border-red-500/30 shadow-sm hover:shadow-md hover:shadow-red-500/20 hover:-translate-y-0.5",

      // Warning — amber advisory action
      warning:
        "bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold border border-amber-400/40 shadow-sm hover:shadow-md hover:shadow-amber-500/20 hover:-translate-y-0.5",

      // Cyan (alias of default)
      cyan:
        "bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/30 shadow-sm hover:shadow-md hover:shadow-blue-500/20 hover:-translate-y-0.5",

      // Success — emerald confirmation action
      success:
        "bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/30 shadow-sm hover:shadow-md hover:shadow-emerald-500/20 hover:-translate-y-0.5",

      // Ghost — minimal, no border
      ghost:
        "bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 border-transparent shadow-none",
    };

    const sizes = {
      sm: "h-8 px-4 text-xs gap-1.5",
      md: "h-9 px-5 text-xs gap-2",
      lg: "h-11 px-6 text-sm gap-2.5",
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
