import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FB8B24",
        "bg-primary": "#FEFAF0",
      },
    },
  },
  plugins: [],
};
export default config;
