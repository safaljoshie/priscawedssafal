import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        serif: ["Cormorant Garamond", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        gold: "#c9a96e",
        green: "#2c3e2d",
        ivory: "#f5f0e8",
      },
      maxWidth: {
        phone: "430px",
      },
    },
  },
};

export default config;
