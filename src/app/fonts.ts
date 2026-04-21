import localFont from "next/font/local";

export const appSans = localFont({
  src: "./fonts/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export const appMono = localFont({
  src: "./fonts/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const appMontserrat = localFont({
  src: [
    { path: "./fonts/Montserrat-400.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Montserrat-700.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Montserrat-800.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-app-montserrat",
  display: "swap",
  preload: false,
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export const appPlusJakarta = localFont({
  src: [
    { path: "./fonts/PlusJakartaSans-400.ttf", weight: "400", style: "normal" },
    { path: "./fonts/PlusJakartaSans-700.ttf", weight: "700", style: "normal" },
    { path: "./fonts/PlusJakartaSans-800.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-app-plus-jakarta",
  display: "swap",
  preload: false,
  fallback: ["Arial", "Helvetica", "sans-serif"],
});
