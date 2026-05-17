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
        background: "#FBF7F1",
        surface: "#FFFFFF",
        "surface-warm": "#FFF8F1",
        ink: "#221B17",
        foreground: "#2C201C",
        accent: "#D9A441",
        "accent-strong": "#B87924",
        "accent-hover": "#9F651C",
        rose: "#B96B70",
        jade: "#2F766D",
        muted: "#7E716B",
        border: "#E8DCCD",
      },
      fontFamily: {
        sans: ["var(--font-cormorant)", "Georgia", "serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        heading: ["var(--font-cormorant)", "Georgia", "serif"],
        body: ["var(--font-cormorant)", "Georgia", "serif"],
        script: ["var(--font-great-vibes)", "cursive"],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 1px 4px rgba(60,36,20,0.06), 0 12px 36px rgba(60,36,20,0.08)",
        "card-md": "0 8px 24px rgba(60,36,20,0.10), 0 24px 70px rgba(60,36,20,0.12)",
        glow: "0 16px 44px rgba(184,121,36,0.24)",
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
