import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-[#0e1424] border border-slate-200 dark:border-[#1e2945] shadow-xs hover:shadow-md rounded-xl relative overflow-hidden transition-all duration-200 text-slate-900 dark:text-slate-100",
        className
      )}
      {...props}
    >
      {/* Top Accent Light Bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 opacity-60" />
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-5 py-3.5 border-b border-slate-100 dark:border-[#1e2945] flex items-center justify-between bg-slate-50/60 dark:bg-[#0b101d]/60", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5", className)} {...props}>
      {children}
    </div>
  );
}
