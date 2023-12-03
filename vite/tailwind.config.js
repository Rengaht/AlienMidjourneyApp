/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'gray':'#B4B4B4',
        'lightgray':'#D9D9D9',
        'back':'rgba(0,0,0,0.6)',
      }
    },
  },
  plugins: [],
}

