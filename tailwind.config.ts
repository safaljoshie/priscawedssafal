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
        "mehendi-bg": "#e6ece7",
        ivory: "#f5f0e8",
        wedding: "#a63d40",
        "wedding-bg": "#f9e8e9",
        ganesh: "#d97706",
        "ganesh-bg": "#fdf0e2",
        reception: "#6b4423",
        "reception-bg": "#f4ebe3",
      },
      maxWidth: {
        phone: "430px",
        content: "72rem",
      },
    },
  },
};

export default config;
