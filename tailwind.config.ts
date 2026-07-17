import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0D0D0D",
        surface: "#111111",
        gold: "#C9A24B",
        crimson: "#5E0D13",
        ivory: "#F8F7F2",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 18px 80px rgba(201,162,75,0.18)",
        soft: "0 16px 48px rgba(0, 0, 0, 0.35)",
      },
      backgroundImage: {
        halo:
          "radial-gradient(circle at top, rgba(201,162,75,0.16), transparent 32%), radial-gradient(circle at 20% 20%, rgba(94,13,19,0.32), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0))",
      },
      fontFamily: {
        display: ["Orbitron", "Eurostile", "Arial Black", "sans-serif"],
        body: ["Segoe UI", "Inter", "Arial", "Helvetica", "sans-serif"],
      },
      animation: {
        float: "float 10s ease-in-out infinite",
        pulseGlow: "pulseGlow 6s ease-in-out infinite",
        drift: "drift 20s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.48", transform: "scale(1)" },
          "50%": { opacity: "0.75", transform: "scale(1.06)" },
        },
        drift: {
          "0%": { transform: "translateX(0px) translateY(0px)" },
          "50%": { transform: "translateX(18px) translateY(-12px)" },
          "100%": { transform: "translateX(0px) translateY(0px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
