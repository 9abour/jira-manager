import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}',
    './ui/**/*.{js,jsx,ts,tsx}',
    './features/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#253B80',
        },
        green: {
          DEFAULT: '#009548',
        },
        gray: {
          paragraph: '#666666',
          light: '#F2F2F2',
          dark: '#808080',
          DEFAULT: '#F1F1F1',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
