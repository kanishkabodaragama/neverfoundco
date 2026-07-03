import type { Config } from "tailwindcss";

// ---------------------------------------------------------------------------
// BRAND TOKENS
// Change these to re-skin the whole menu. Every color used in the
// SlideMenu component is pulled from this palette, so this is the
// single place to edit if you want a different color scheme.
// ---------------------------------------------------------------------------
const brand = {
  black: "#0d0c0c",       // base background (layer 1)
  charcoal: "#1e1c1b",    // secondary dark tone seen in the texture shadows
  red: "#7a1a17",         // torn-logo background shapes (layer 2)
  redDeep: "#4a0f0d",     // darker red used at shape edges
  lime: "#c6ff72",        // accent color for HOME / ABOUT US
  white: "#ffffff",       // CONTACT US / LOGIN + menu chrome
};

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand,
      },
      fontFamily: {
        // Swap this for the real NEVERFOUND brand font once you have the
        // font file (it's a bold, hand-torn poster style). Anton is the
        // closest free stand-in for the condensed weight + proportions.
        display: ["var(--font-display)", "Impact", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
