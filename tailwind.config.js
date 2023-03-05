// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  darkMode: 'class', // or 'media' or 'class'
  important: true,
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/views/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
      colors: {
        blurple: '#5865F2',
      },
    },
    container: {
      center: true,
    },
    screens: {
      xs: '475px',
      ...defaultTheme.screens,
    },
  },
  plugins: [],
};
