/** @type {import('tailwindcss').Config} */
import { COLORS } from './src/utils/constants';
import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';
import * as fcp from 'tailwindcss/lib/util/flattenColorPalette';
const { default: flattenColorPalette } = fcp;

export default {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundColor: {
        primary: COLORS.primary,
      },
      backgroundImage: {
        'radial-gradient':
          'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(36,36,36,0.1) 100%)',
        'radial-black-to-white':
          'radial-gradient(circle, rgba(255,255,255,1) 30%, rgba(36,36,36,1) 100%)',
      },
      borderColor: {
        primary: COLORS.primary,
        secondary: COLORS.secondary,
      },
      colors: {
        primary: COLORS.primary,
        secondary: COLORS.secondary,
      },
      boxShadow: {
        input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
        normal: 'rgba(0, 0, 0, 0.12) 0px 2px 8px',
      },
    },
  },
  plugins: [typography, addVariablesForColors],
} as Config;

function addVariablesForColors({ addBase, theme }: any) {
  const allColors = flattenColorPalette(theme('colors'));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ':root': newVars,
  });
}
