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
          DEFAULT: '#037de9',
          darkTitle: '#2a2827',
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
      fontFamily: {
        ubuntu: ['Ubuntu', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
