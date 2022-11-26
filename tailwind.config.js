module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      
      'sm': '480px',
      'md': '834px',
      'lg': '1124px',
      'xl': '1640px',
      '2xl': '1890px'

    },
    container: {
      center: true,
    },
    extend: {
      colors: {
      'spot-yellow': '#fff600',
    }
  },
  },
  plugins: [],
}
