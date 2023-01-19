/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/features/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    backgroundImage: {
      'paper-top': "url('../assets/paper-top.png')",
      'paper-bottom': "url('../assets/paper-bottom.png')",
      'paper-bottom-transparent': "url('../assets/paper-bottom-transparent.png')",
    },
    extend: {},
  },
  plugins: [],
}
