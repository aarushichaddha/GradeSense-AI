import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          bg: "#0b0f19",
          card: "#111827",
          panel: "#1f2937",
          border: "#374151",
          accent: "#3b82f6",
          text: "#f3f4f6",
          muted: "#9ca3af",
          // Honeywell / DCS Status Colors
          normal: "#10b981",    // Safety Green
          warning: "#f59e0b",   // Alarm Amber
          critical: "#ef4444",  // Emergency Red
          standby: "#6b7280",   // Slate Standby
          cyan: "#06b6d4",      // Process Cyan
        },
      },
      fontFamily: {
        mono: ["Consolas", "Monaco", "Courier New", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
