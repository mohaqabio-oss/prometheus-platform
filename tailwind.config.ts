import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Prometheus Visual Identity System
        brand: {
          orange: {
            50: "#FFF7ED",
            100: "#FFEDD5",
            200: "#FED7AA",
            300: "#FDBA74",
            400: "#FB923C",
            500: "#FF5500", // Core Brand Accent
            600: "#EA4B00",
            700: "#C23B00",
            800: "#9A3000",
            900: "#7C2700",
            DEFAULT: "#FF5500",
          },
          dark: {
            950: "#09090B", // Primary App Background
            900: "#121215", // Elevated Surface Background
            850: "#18181B", // Card / Module Background
            800: "#27272A", // Border / Divider Accent
            700: "#3F3F46", // Subdued Icon / Secondary Border
          },
          gray: {
            100: "#F4F4F5",
            200: "#E4E4E7",
            300: "#D4D4D8",
            400: "#A1A1AA", // Muted Body Text
            500: "#71717A",
            600: "#52525B",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-tt-norms)", "TT Norms Pro", "Inter", "sans-serif"],
        display: ["var(--font-garet)", "Garet", "Outfit", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "Consolas", "monospace"],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
        "128": "32rem",
        "144": "36rem",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
