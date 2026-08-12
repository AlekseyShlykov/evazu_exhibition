import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        gallery: {
          paper: "#f2f0e9",
          wall: "#e9e7df",
          ink: "#24241f",
          muted: "#737168",
          line: "#c9c6bb"
        }
      },
      fontFamily: {
        serif: ["Iowan Old Style", "Baskerville", "Times New Roman", "serif"],
        sans: ["Inter", "Helvetica Neue", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
