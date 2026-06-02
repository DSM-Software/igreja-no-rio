import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ECF8F6",
          100: "#D6F1ED",
          200: "#A9E3DC",
          300: "#7DD4CA",
          400: "#5CC8BD",
          500: "#45C0B4",
          600: "#2EA89C",
          700: "#237F76",
        },
        navy: {
          600: "#38445B",
          700: "#283143",
          800: "#1D2532",
          900: "#161D29",
        },
        ink: {
          DEFAULT: "#1F2630",
          2: "#424B57",
        },
        muted: {
          DEFAULT: "#6B7480",
          2: "#9AA2AD",
        },
        bg: {
          DEFAULT: "#F5F8F8",
          2: "#EEF4F3",
        },
        border: {
          DEFAULT: "#E4EAE9",
          2: "#D5DEDC",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      maxWidth: {
        content: "1180px",
      },
      borderRadius: {
        soft: "12px",
        card: "26px",
      },
      boxShadow: {
        soft: "0 6px 18px rgba(22,29,41,.08), 0 2px 6px rgba(22,29,41,.05)",
        glow: "0 14px 34px rgba(45,168,156,.32)",
      },
    },
  },
  plugins: [],
};

export default config;