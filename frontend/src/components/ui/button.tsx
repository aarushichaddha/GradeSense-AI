import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "danger" | "warning" | "ghost" | "cyan";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const baseStyle = "inline-flex items-center justify-center font-mono font-medium tracking-wide transition-all focus:outline-none focus:ring-1 border active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-none";

    const variants = {
      default: "bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-sm",
      outline: "bg-industrial-panel hover:bg-industrial-border text-industrial-text border-industrial-border",
      danger: "bg-red-700 hover:bg-red-600 text-white border-red-500 shadow-sm",
      warning: "bg-amber-600 hover:bg-amber-500 text-black border-amber-400 font-semibold",
      cyan: "bg-cyan-600 hover:bg-cyan-500 text-black border-cyan-400 font-semibold",
      ghost: "bg-transparent hover:bg-industrial-panel text-industrial-muted hover:text-white border-transparent",
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
