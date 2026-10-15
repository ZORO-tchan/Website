import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#060606",
        foreground: "#EDE8E0",
        aether: {
          bg: "#060606",
          dark: "#0b0b0b",
          surface: "#121212",
          titanium: "#18181a",
          rosegold: "#C9A05C",
          "rosegold-light": "#DFC085",
          "rosegold-dark": "#9C793B",
          border: "rgba(201, 160, 92, 0.15)",
          "border-subtle": "rgba(255, 255, 255, 0.07)",
          text: "#EDE8E0",
          "text-muted": "rgba(237, 232, 224, 0.60)",
          "text-faint": "rgba(237, 232, 224, 0.35)",
        },
      },
      fontFamily: {
        serif: ["var(--font-cinzel)", "Cinzel", "Playfair Display", "Georgia", "serif"],
        display: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      letterSpacing: {
        "ultra-wide": "0.3em",
        "super-wide": "0.45em",
        "maison": "0.22em",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        luxury: "1000ms",
      },
    },
  },
  plugins: [],
};
export default config;
