import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#050D1A",
          900: "#081426",
          800: "#0A1930",
          700: "#0F2447",
          600: "#16305C",
          500: "#1E3F75",
        },
        gold: {
          DEFAULT: "#C9A227",
          light: "#E3C566",
          pale: "#F3E5B8",
          dark: "#A5841C",
        },
        ivory: "#F8F6F1",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.25em",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #E3C566 0%, #C9A227 45%, #A5841C 100%)",
        "navy-radial": "radial-gradient(ellipse at 50% 0%, #10264A 0%, #0A1930 55%, #050D1A 100%)",
      },
      boxShadow: {
        gold: "0 0 40px rgba(201,162,39,0.18)",
        card: "0 10px 40px rgba(5,13,26,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
