/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          300: "#9EE86F",
        },
        brandBg: "#fdf5ea",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        sonder: ['Sonder', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
