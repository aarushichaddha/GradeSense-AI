import React from "react";
import { Cpu } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center font-mono dcs-grid-pattern p-4 relative">
      {/* Background DCS Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950 pointer-events-none" />

      <div className="z-10 w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="p-2 bg-blue-950 border border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <Cpu className="w-8 h-8 text-blue-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-widest uppercase">GradeSense AI</h1>
            <p className="text-[10px] text-cyan-400 font-semibold tracking-widest uppercase">Honeywell Process Solutions</p>
          </div>
        </div>

        {children}

        <div className="text-center mt-6 text-[10px] text-gray-500">
          <span>Enterprise DCS Authorization • Plant Mill #04</span>
        </div>
      </div>
    </div>
  );
}
