/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'yalla-blue': '#012D90',
        'yalla-gold': '#F0E68F',
        'yalla-cyan': '#00FFFF',
        'yalla-navy-dark': '#000A28',
        'yalla-navy-light': '#0A1432',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'cairo': ['Cairo', 'sans-serif'],
        'tajawal': ['Tajawal', 'sans-serif'],
      },
    },
  },
}
