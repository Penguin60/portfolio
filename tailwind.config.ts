import type { Config } from "tailwindcss";

const warm = {
  50: "hsl(var(--th-50) / <alpha-value>)",
  100: "hsl(var(--th-100) / <alpha-value>)",
  200: "hsl(var(--th-200) / <alpha-value>)",
  300: "hsl(var(--th-300) / <alpha-value>)",
  400: "hsl(var(--th-400) / <alpha-value>)",
  500: "hsl(var(--th-500) / <alpha-value>)",
  600: "hsl(var(--th-600) / <alpha-value>)",
  700: "hsl(var(--th-700) / <alpha-value>)",
  800: "hsl(var(--th-800) / <alpha-value>)",
  900: "hsl(var(--th-900) / <alpha-value>)",
  950: "hsl(var(--th-950) / <alpha-value>)",
};

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
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
        zinc: warm,
        gray: warm,
        neutral: warm,
        white: "hsl(var(--th-white) / <alpha-value>)",
        black: "hsl(var(--th-black) / <alpha-value>)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
        "3xs": ["0.5rem", { lineHeight: "0.75rem" }],
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;
