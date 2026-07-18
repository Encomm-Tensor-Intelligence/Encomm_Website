import localFont from "next/font/local";

/**
 * Variable fonts served locally via next/font/local.
 * No runtime font downloads; subset files are bundled.
 */
export const spaceGrotesk = localFont({
  src: [
    {
      path: "../public/fonts/SpaceGrotesk-Variable.woff2",
      weight: "300 700",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["Inter", "system-ui", "sans-serif"],
});

export const inter = localFont({
  src: [
    {
      path: "../public/fonts/Inter-Variable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-body",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});
