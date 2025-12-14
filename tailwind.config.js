// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#fef2f2',
          100: '#ffe1e1',
          200: '#ffc7c7',
          300: '#ffa0a0',
          400: '#ff6b6b',
          500: '#f03e3e',
          600: '#d62222',
          700: '#b91c1c', // Merah gelap
          800: '#991b1b', // Maroon standar
          900: '#7f1d1d', // Maroon pekat (Primary kita)
          950: '#450a0a',
        }
      }
    },
  },
  plugins: [],
}