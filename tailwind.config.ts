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
        "green-dark": "#1e2b1f",
        ivory: "#f5f0e8",
        wedding: "#a63d40",
        ganesh: "#d97706",
        reception: "#6b4423",
      },
      maxWidth: {
        phone: "430px",
        content: "72rem",
      },
    },
  },
};

export default config;
