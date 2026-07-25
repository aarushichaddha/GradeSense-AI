import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { StatusLevel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStatusColor(status: StatusLevel): string {
  switch (status) {
    case "NORMAL":
      return "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800";
    case "WARNING":
      return "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800";
    case "CRITICAL":
      return "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800 animate-alarm";
    case "STANDBY":
    default:
      return "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700";
  }
}

export function getStatusBadgeColor(status: StatusLevel): string {
  switch (status) {
    case "NORMAL":
      return "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 font-bold";
    case "WARNING":
      return "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 font-bold";
    case "CRITICAL":
      return "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 font-bold animate-pulse";
    case "STANDBY":
    default:
      return "bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700 font-semibold";
  }
}

export function formatTimestamp(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
