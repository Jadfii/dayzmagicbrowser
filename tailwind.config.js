module.exports = {
  mode: 'jit',
  darkMode: 'class', // or 'media' or 'class'
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/views/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
    },
    container: {
      center: true,
    },
  },
  plugins: [],
};
