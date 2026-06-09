import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8F5F0",
        surface: "#FFFFFF",
        "surface-warm": "#FFF9F2",
        ink: "#1F1A17",
        foreground: "#2A2420",
        accent: "#B88A44",
        "accent-strong": "#7A3E4A",
        "accent-hover": "#69333F",
        rose: "#A65763",
        jade: "#2E6F64",
        muted: "#706861",
        border: "#E1D8CC",
      },
      fontFamily: {
        sans: ["var(--font-body)"],
        display: ["var(--font-display)"],
        heading: ["var(--font-display)"],
        body: ["var(--font-body)"],
        script: ["var(--font-script)"],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 1px 4px rgba(42,36,32,0.06), 0 12px 36px rgba(42,36,32,0.08)",
        "card-md": "0 8px 24px rgba(42,36,32,0.10), 0 24px 70px rgba(42,36,32,0.12)",
        glow: "0 16px 44px rgba(122,62,74,0.22)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
