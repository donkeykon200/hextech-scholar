import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        glow: {
          cyan: "hsl(var(--glow-cyan))",
          purple: "hsl(var(--glow-purple))",
          blue: "hsl(var(--glow-blue))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "glitch": {
          "0%, 100%": { transform: "translate(0)", filter: "hue-rotate(0deg)" },
          "10%": { transform: "translate(-2px, 1px)", filter: "hue-rotate(10deg)" },
          "20%": { transform: "translate(2px, -1px)", filter: "hue-rotate(-10deg)" },
          "30%": { transform: "translate(-1px, 2px)" },
          "40%": { transform: "translate(1px, -2px)" },
          "50%": { transform: "translate(-2px, -1px)", filter: "hue-rotate(5deg)" },
          "60%": { transform: "translate(2px, 1px)" },
          "70%": { transform: "translate(0)" },
        },
        "phase": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "25%": { opacity: "0.9", transform: "scale(1.01)" },
          "50%": { opacity: "0.95", transform: "scale(0.99)" },
          "75%": { opacity: "0.85", transform: "scale(1.02)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "border-glow": "border-glow 2s ease-in-out infinite",
        "progress-pulse": "progress-pulse 1.5s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "glitch": "glitch 0.3s ease-in-out",
        "phase": "phase 4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
