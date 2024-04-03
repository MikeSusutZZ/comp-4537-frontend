module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'lighter-green': '#40CF91',
        'darker-green': '#1E985E',
        'button-green': '#37996B',
        'background-dark': '#1C1C1C',
        'background-green': '#35453E'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
