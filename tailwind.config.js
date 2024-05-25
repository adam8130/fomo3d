module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      screens: {
        'max-2xs': { max: '370px' },
        'max-xs': { max: '420px' },
        'max-sm': { max: '640px' },
        'max-md': { max: '768px' },
        'max-lg': { max: '1024px' },
        'max-xl': { max: '1280px' },
        'max-2xl': { max: '1440px' },
      },
    },
  },
  plugins: [],
}