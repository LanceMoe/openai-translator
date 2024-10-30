module.exports = {
  content: [
    './src/**/*.{html,js,jsx,md,mdx,ts,tsx}',
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js',
  ],
  // prefix: 'tw-',
  darkMode: 'class',
  important: true,
  theme: {
    extend: {
      boxShadow: {
        tabs: '0 0 12px hsla(174, 65%, 15%, 0.15)',
      },
      borderRadius: {
        tabs: '1rem 1rem 0 0',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
    },
  },
  daisyui: {
    styled: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: '',
    darkTheme: 'dark',
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          primary: '#1967d2',
        },
      },
      {
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          primary: '#7096F8',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
};
