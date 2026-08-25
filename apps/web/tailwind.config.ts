import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["Fira Code", "DM Mono", "JetBrains Mono", "monospace"],
        code: ["Fira Code", "DM Mono", "monospace"],
      },
      colors: {
        sidebar: {
          DEFAULT: "rgb(8 12 22)",
          hover: "rgb(17 24 39)",
          border: "rgb(30 41 59)",
        },
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.2, 0, 0, 1)",
        "ease-out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
