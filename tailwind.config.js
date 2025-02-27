module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      
      'sm': '380px',
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
    },
    transitionProperty: {
      'height': 'height',
      'opacity': 'opacity'
    },
      backgroundImage: {
        'spotbg': "url('./assets/spotbot/2611.png')",
        'botbg' : "url('./assets/812.png')",
        'botbg2' : "url('./assets/spotbot/4.png')",
        'botbg3' : "url('./assets/spotbot/8.png')",
        'goatdmacho' : "url('./assets/goatdmacho.png')",
        'analog' : "url('./assets/analog/41-1.png')",
        'nftombstonebg' : "url('./assets/nftombstone.png')",
        'spotmobilebg' : "url('./assets/spotmobile.png')",
        'unnamedbg' : "url('./assets/unnamedImages/11.png')",
        'plots' : "url('./assets/plots3.png')",
      }
  },
  },
  variants: {
    extend: {
      display: ['group-hover'],
      opacity: ['group-hover'],
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
}
