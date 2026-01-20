/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'uidai': {
          'saffron': '#F26F22',
          'green': '#138808',
          'navy': '#000080',
          'navy-light': '#1a1a9f',
          'saffron-light': '#ff8c42',
          'green-light': '#1ca30e',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
