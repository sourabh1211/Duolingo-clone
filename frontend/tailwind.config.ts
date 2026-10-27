import type { Config } from "tailwindcss";

// Brand colors mirror the original app's palette; surface colors come from CSS variables
// so the whole UI flips for dark mode by toggling a class on <html>.
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        green: { DEFAULT: "#58cc02", dark: "#58a700", light: "#d7ffb8", lime: "#89e219" },
        blue: { DEFAULT: "#1cb0f6", dark: "#1899d6", light: "#ddf4ff" },
        red: { DEFAULT: "#ff4b4b", dark: "#ea2b2b", light: "#ffdfe0" },
        orange: { DEFAULT: "#ff9600", dark: "#cd7900" },
        yellow: { DEFAULT: "#ffc800", dark: "#e5a400" },
        purple: { DEFAULT: "#ce82ff", dark: "#a568cc" },
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        locked: "rgb(var(--locked) / <alpha-value>)",
        panel: "rgb(var(--panel) / <alpha-value>)",
        soft: "rgb(var(--soft) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "ui-rounded", "system-ui", "sans-serif"],
      },
      borderRadius: { "2xl": "16px", "3xl": "20px" },
      keyframes: {
        bob: { "0%,100%": { transform: "translate(-50%, 0)" }, "50%": { transform: "translate(-50%, -6px)" } },
        "slide-up": { from: { transform: "translateY(100%)" }, to: { transform: "translateY(0)" } },
        pop: { "0%": { transform: "scale(.6)", opacity: "0" }, "70%": { transform: "scale(1.08)" }, "100%": { transform: "scale(1)", opacity: "1" } },
        shake: { "0%,100%": { transform: "translateX(0)" }, "25%": { transform: "translateX(-6px)" }, "75%": { transform: "translateX(6px)" } },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        confetti: { "0%": { transform: "translateY(-10vh) rotate(0)" }, "100%": { transform: "translateY(110vh) rotate(720deg)" } },
      },
      animation: {
        bob: "bob 1.6s ease-in-out infinite",
        "slide-up": "slide-up .22s ease-out",
        pop: "pop .35s ease-out both",
        shake: "shake .25s ease-in-out 2",
        "fade-in": "fade-in .2s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
