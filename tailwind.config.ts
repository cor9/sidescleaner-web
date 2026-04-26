import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Marquee palette — warm cinematic, anchored by Marquee Red on cream
        cream: {
          DEFAULT: "#F5EFE6",
          light: "#FAF6EF",
          dark: "#EBE2D3",
        },
        marquee: {
          red: "#C8553D",
          "red-deep": "#A8412C",
        },
        ink: {
          DEFAULT: "#1F1B16",
          soft: "#3D3833",
          mute: "#6B6258",
        },
        gold: "#C8A04D",
        sage: "#7A8A6E",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Editorial scale
        "display-xl": ["clamp(2.5rem, 5vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        "display": ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(31,27,22,0.04), 0 4px 12px rgba(31,27,22,0.06)",
        lift: "0 4px 12px rgba(31,27,22,0.08), 0 12px 32px rgba(31,27,22,0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
