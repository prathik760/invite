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
        // `surface`, `muted`, `foreground` and `ink` are read inside the
        // invitation templates themselves (ElegantWedding, the /e not-found
        // page). Keep them stable — changing one repaints live invitations.
        surface: "#FFFFFF",
        "surface-warm": "#FFF9F2",
        ink: "#1F1A17",
        foreground: "#2A2420",
        // Brand accents. Only marketing and product chrome uses these, so they
        // carry the redesign's emerald + burnished-gold identity site-wide.
        accent: "#A47945",
        "accent-strong": "#0B4A34",
        "accent-hover": "#052E20",
        rose: "#A65763",
        jade: "#2E6F64",
        muted: "#706861",
        border: "#E1D8CC",

        // ─── Editorial palette (redesign) ───────────────────────────────────
        champagne: "#FFFAF4",
        paper: "#FFFDF9",
        peach: "#FBEFE3",
        charcoal: "#1E2726",
        emerald: {
          DEFAULT: "#052E20",
          soft: "#0B4A34",
          deep: "#03190F",
        },
        // `burnished` is decorative (icons, rules, large type). Small text uses
        // `burnished-deep`, which clears WCAG AA on champagne (≈6:1).
        burnished: {
          DEFAULT: "#A47945",
          deep: "#7E5A2E",
        },
        "gold-soft": "#E8C866",
        olive: "#526344",
        line: "#EADFD2",
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
