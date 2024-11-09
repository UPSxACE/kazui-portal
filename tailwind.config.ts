import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        "2md": "900px",
        "2lg": "1100px",
      },
      height: {
        header: "var(--header-height)",
        categories: "var(--categories-height)",
        landing: "var(--landing-height)",
      },
      minHeight: {
        header: "var(--header-height)",
        categories: "var(--categories-height)",
        landing: "var(--landing-height)",
      },
      maxHeight: {
        header: "var(--header-height)",
        categories: "var(--categories-height)",
        landing: "var(--landing-height)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        "background-lighter": "var(--background-lighter)",
        font: {
          1: "var(--font-1)",
        },
      },
    },
  },
  plugins: [require("daisyui"), require("tailwindcss-animate")],
};
export default config;
