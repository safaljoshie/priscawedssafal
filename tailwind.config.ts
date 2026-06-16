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
        "mehendi-bg": "#d5e0d7",
        ivory: "#f5f0e8",
        wedding: "#a63d40",
        "wedding-dark": "#712528",
        "wedding-bg": "#f2d4d6",
        ganesh: "#d97706",
        "ganesh-bg": "#f5e0c4",
        reception: "#6b4423",
        "reception-bg": "#e8d9cc",
      },
      maxWidth: {
        phone: "430px",
        content: "72rem",
      },
    },
  },
};

export default config;
