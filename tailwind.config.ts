import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette
        "mystic-purple": "#4B0082", // Primary background, Oracle's robe
        "deep-sea-green": "#2E8B57", // Secondary background, highlights
        "twilight-blue": "#1A1F4D", // Dark elements, contrast
        "soft-gold": "#DAA520", // Accents, button highlights, glowing effects
        "moonlight-silver": "#D3D3D3", // Text highlights, soft glow
        "ethereal-mist": "#F5F5F5", // Background texture, fog-like effects
      },
      fontFamily: {
        // Using CSS variables created by Next.js font system
        seasons: ["var(--font-seasons)"],
        circe: ["var(--font-circe)"],
        quincy: ["var(--font-quincy)"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [animate],
};

export default config;
