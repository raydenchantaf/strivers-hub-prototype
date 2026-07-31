import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          light:   "var(--color-primary-light)",
          dark:    "var(--color-primary-dark)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          hover:   "var(--color-accent-hover)",
        },
        ink: "var(--color-text-dark)",
        brand: {
          pink:          "var(--color-brand-pink)",
          rose:          "var(--color-brand-rose)",
          "rose-light":  "var(--color-brand-rose-light)",
          orange:        "var(--color-brand-orange)",
          "orange-light":"var(--color-brand-orange-light)",
          dark:          "var(--color-brand-dark)",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
};

export default config;
