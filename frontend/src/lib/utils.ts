import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { StatusLevel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStatusColor(status: StatusLevel): string {
  switch (status) {
    case "NORMAL":
      return "text-industrial-normal bg-industrial-normal/10 border-industrial-normal/30";
    case "WARNING":
      return "text-industrial-warning bg-industrial-warning/10 border-industrial-warning/30";
    case "CRITICAL":
      return "text-industrial-critical bg-industrial-critical/10 border-industrial-critical/30 animate-alarm";
    case "STANDBY":
    default:
      return "text-industrial-standby bg-industrial-standby/10 border-industrial-standby/30";
  }
}

export function getStatusBadgeColor(status: StatusLevel): string {
  switch (status) {
    case "NORMAL":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
    case "WARNING":
      return "bg-amber-500/20 text-amber-400 border-amber-500/40";
    case "CRITICAL":
      return "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse";
    case "STANDBY":
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/40";
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
