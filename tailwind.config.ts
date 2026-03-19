import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: "#00f0ff",
          magenta: "#ff00ea",
          yellow: "#f0ff00",
          green: "#39ff14",
        },
        void: {
          950: "#030308",
          900: "#0a0a12",
          800: "#12121f",
          700: "#1a1a2e",
        },
      },
      fontFamily: {
        display: ["var(--font-orbitron)", "system-ui", "sans-serif"],
        mono: ["var(--font-share-tech)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        neon: "0 0 20px rgba(0, 240, 255, 0.35), 0 0 40px rgba(255, 0, 234, 0.15)",
        "neon-sm": "0 0 10px rgba(0, 240, 255, 0.4)",
      },
      animation: {
        flicker: "flicker 4s infinite",
        scan: "scan 8s linear infinite",
        pulseSlow: "pulseSlow 3s ease-in-out infinite",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "92%": { opacity: "1" },
          "93%": { opacity: "0.85" },
          "94%": { opacity: "1" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
