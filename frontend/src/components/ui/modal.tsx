import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "./button";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0e1424] border border-slate-200 dark:border-[#1e2945] w-full max-w-xl shadow-xl overflow-hidden rounded-2xl transition-all">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-[#0a0f1c] border-b border-slate-100 dark:border-[#1e2945] flex items-center justify-between">
          <h3 className="text-xs uppercase font-mono font-bold text-slate-800 dark:text-slate-200 tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 bg-sky-600 rounded-full inline-block animate-pulse" />
            {title}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-6 font-sans text-slate-800 dark:text-slate-200">{children}</div>
      </div>
    </div>
  );
}
