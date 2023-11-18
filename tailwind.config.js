/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'gray':'#383A40',
        'lightgray':'#4E5057',
      }
    },
  },
  plugins: [],
}

