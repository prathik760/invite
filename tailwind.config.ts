import type { Config } from "tailwindcss";

/**
 * The ShareInvite palette, the single source of every brand colour (the homepage's green, cream
 * and gold, adopted site-wide on 4 Nov 2026). Contrast on ivory / linen:
 *   forest on ivory 11.4:1 · ink 14.5:1 · goldText 5.8 / 5.3:1 · mutedText 5.4 / 4.9:1.
 *   goldInk (4.7:1 on ivory) is for large or decorative gold; small gold text uses goldText.
 */
export const SI = {
  forest: "#123D2E",
  forestSoft: "#1B4A39",
  deep: "#0C2B22",
  ivory: "#FAF8F2",
  linen: "#F1EDE3",
  white: "#FFFFFF",
  gold: "#C7A45B",
  goldInk: "#8C6B2C",
  goldText: "#7A5C24",
  ink: "#25251F",
  muted: "#6F6E67",
  mutedText: "#68675F",
  line: "#E8E2D7",
} as const;

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // One ShareInvite palette: the homepage's green, cream and gold (4 Nov 2026). Every colour
      // name below points at it, so pages built with the older names (emerald, champagne,
      // burnished...) and the homepage's hv-* names render the same colours. Small text uses the
      // *Text shades, which keep WCAG AA (4.5:1) on both creams; see SI below.
      colors: {
        background: SI.ivory,
        surface: SI.white,
        "surface-warm": SI.ivory,
        ink: SI.ink,
        foreground: SI.ink,
        accent: SI.goldInk,
        "accent-strong": SI.forest,
        "accent-hover": SI.deep,
        rose: "#A65763",
        jade: "#2E6F64",
        muted: SI.mutedText,
        border: SI.line,

        champagne: SI.ivory,
        paper: SI.white,
        peach: SI.linen,
        charcoal: SI.ink,
        emerald: {
          DEFAULT: SI.forest,
          soft: SI.forestSoft,
          deep: SI.deep,
        },
        burnished: {
          DEFAULT: SI.goldInk,
          deep: SI.goldText,
        },
        "gold-soft": SI.gold,
        olive: "#526344",
        line: SI.line,
        hv: {
          ivory: SI.ivory,
          linen: SI.linen,
          forest: SI.forest,
          deep: SI.deep,
          gold: SI.gold,
          "gold-ink": SI.goldInk,
          ink: SI.ink,
          muted: SI.muted,
          line: SI.line,
        },
      },
      fontFamily: {
        sans: ["var(--font-body)"],
        display: ["var(--font-display)"],
        heading: ["var(--font-display)"],
        body: ["var(--font-body)"],
        script: ["var(--font-script)"],
        // Marketing headings only. Templates keep `font-display`/`font-heading`.
        editorial: ["var(--font-editorial)", "Georgia", "serif"],
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
        soft: "0 10px 40px -20px rgba(5,46,32,0.35)",
        lift: "0 1px 2px rgba(0,0,0,0.05), 0 18px 40px -18px rgba(5,46,32,0.32)",
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
