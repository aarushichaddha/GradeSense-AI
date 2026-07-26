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
          bg: "#070a11",
          card: "#0e1424",
          panel: "#161c2e",
          border: "#1e2945",
          accent: "#0284c7",
          text: "#f8fafc",
          muted: "#94a3b8",
          // Status Colors (WCAG Compliant)
          normal: "#059669",    // Emerald-600
          warning: "#d97706",   // Amber-600
          critical: "#dc2626",  // Red-600
          standby: "#64748b",   // Slate-500
          cyan: "#0284c7",      // Sky-600 Process Accent
          violet: "#7c3aed",    // Violet-600 AI Accent
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "Consolas", "Monaco", "monospace"],
        sans: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        'glow-sky': '0 0 12px -2px rgba(2, 132, 199, 0.2)',
        'glow-blue': '0 0 12px -2px rgba(37, 99, 235, 0.2)',
        'glow-amber': '0 0 12px -2px rgba(217, 119, 6, 0.2)',
        'glow-emerald': '0 0 12px -2px rgba(5, 150, 105, 0.2)',
      },
    },
  },
  plugins: [],
};
export default config;
