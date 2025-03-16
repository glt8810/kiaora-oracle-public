import { Playfair_Display, Raleway, Crimson_Pro } from "next/font/google";

// Using Google Fonts as temporary replacements for our custom fonts
export const seasonsFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-seasons",
  display: "swap",
});

export const circeFont = Raleway({
  subsets: ["latin"],
  variable: "--font-circe",
  display: "swap",
});

export const quincyFont = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-quincy",
  display: "swap",
});

// NOTE: Replace these with your actual custom fonts when you have the font files:
/*
export const seasonsFont = localFont({
  src: [
    {
      path: "../../public/fonts/TheSeasons-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/TheSeasons-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-seasons",
  display: "swap",
});

export const circeFont = localFont({
  src: [
    {
      path: "../../public/fonts/CirceContrast-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/CirceContrast-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-circe",
  display: "swap",
});

export const quincyFont = localFont({
  src: [
    {
      path: "../../public/fonts/Quincy-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Quincy-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-quincy",
  display: "swap",
});
*/
