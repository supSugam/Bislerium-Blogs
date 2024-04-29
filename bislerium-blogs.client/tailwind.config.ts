/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss';
import lineClamp from '@tailwindcss/line-clamp';
import typography from '@tailwindcss/typography';
export default {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [lineClamp, typography],
} as Config;
