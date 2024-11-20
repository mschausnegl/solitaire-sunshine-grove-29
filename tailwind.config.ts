import type { Config } from "tailwindcss";

export default {
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
        "felt-green": "#0A5C2C",
        "card-shadow": "rgba(0, 0, 0, 0.2)",
        "gold": "#FFD700",
      },
      keyframes: {
        "card-flip": {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(180deg)" },
        },
        "card-slide": {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "card-flip": "card-flip 0.3s ease-out",
        "card-slide": "card-slide 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
