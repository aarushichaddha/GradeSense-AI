import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-industrial-card border border-industrial-border shadow-md rounded-none relative overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Top Industrial Accent Bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 opacity-60" />
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-4 py-3 border-b border-industrial-border/60 flex items-center justify-between bg-gray-900/40", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-xs font-mono font-bold uppercase tracking-wider text-gray-200 flex items-center gap-2", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4", className)} {...props}>
      {children}
    </div>
  );
}
