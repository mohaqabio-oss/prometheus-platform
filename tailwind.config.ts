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
        
        // Exact Prometheus Brand Color Palette
        primary: "#0D0D0D",
        base: "#FFFFFF",
        neutral: {
          DEFAULT: "#6B7280",
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        secondary: {
          DEFAULT: "#1A2B4A",
          hover: "#14223C",
          light: "#243B66",
          dark: "#0F1A2E",
        },
        accent: {
          DEFAULT: "#E84A0C",
          hover: "#D03E06",
          light: "#FF5D1F",
          muted: "rgba(232, 74, 12, 0.12)",
        },
        highlight: {
          DEFAULT: "#F5A623",
          hover: "#E09516",
          light: "#F7B84E",
          muted: "rgba(245, 166, 35, 0.12)",
        },

        // Prometheus Visual Identity System Backward Compatibility
        brand: {
          orange: {
            50: "#FFF7ED",
            100: "#FFEDD5",
            200: "#FED7AA",
            300: "#FDBA74",
            400: "#FB923C",
            500: "#E84A0C", // Core Brand Accent
            600: "#D03E06",
            700: "#C23B00",
            800: "#9A3000",
            900: "#7C2700",
            DEFAULT: "#E84A0C",
          },
          dark: {
            950: "#0D0D0D", // Primary App Background
            900: "#121722", // Elevated Surface Background
            850: "#1A2B4A", // Card / Module Accent Background
            800: "#27344D", // Border / Divider Accent
            700: "#3B4B6B", // Subdued Icon / Secondary Border
          },
          gray: {
            100: "#F4F4F5",
            200: "#E4E4E7",
            300: "#D4D4D8",
            400: "#6B7280", // Muted Body Text
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
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        accent: "0 4px 14px 0 rgba(232, 74, 12, 0.25)",
        secondary: "0 4px 14px 0 rgba(26, 43, 74, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
