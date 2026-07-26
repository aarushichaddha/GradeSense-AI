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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 font-mono">
      <div className="bg-industrial-card border border-industrial-border w-full max-w-xl shadow-2xl overflow-hidden rounded-none animate-in fade-in zoom-in-95">
        {/* Modal DCS Header */}
        <div className="px-4 py-3 bg-gray-900 border-b border-industrial-border flex items-center justify-between">
          <h3 className="text-xs uppercase font-bold text-gray-200 tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-none inline-block" />
            {title}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0 text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
