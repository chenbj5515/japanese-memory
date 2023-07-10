/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      bgDark: "#212121",
      eleDark: "#151515",
      black: "rgb(26 26 26)",
      wrong: "rgb(215,2,17)",
      correct: "limegreen",
      gray: "#999",
      blue: "#1e07f0",
      white: "white",
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'dark-border': 'linear-gradient(163deg, #00ff75 0%, #3700ff 100%)'
      },
      boxShadow: {
        'crescent': 'inset 8px -4px 0px 0px #fff000',
        'full-moon': 'inset 15px -4px 0px 15px #fff000',
        'dark-shadow': '0px 0px 10px 1px #000000ee'
      },
    },
  },
  plugins: [],
}
