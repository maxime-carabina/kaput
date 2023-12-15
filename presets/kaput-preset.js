// This is the tailwind preset for Kaput.

// We disable eslint to be able to define plugins.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createThemes } = require('tw-colors');

import {
  colorWhite,
  colorBlack,
  colorOrange,
  colorCream,
  colorBlue,
  colorLightBlue,
} from './colors.js';

/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      Roboto: ['Roboto', 'sans-serif'],
      Poppins: ['Poppins', 'sans-serif'],
    },
  },
  plugins: [
    createThemes({
      light: {
        primary: colorCream,
        secondary: colorBlack,
        neutral: colorBlack,
        orange: colorOrange,
        blue: colorBlue,
        'light-blue': colorLightBlue,
        // states:
        's-success': colorBlack,
        's-error': colorOrange,
        // fonts:
        'f-primary': colorBlack,
        'f-secondary': colorWhite,
      },
      dark: {
        primary: colorBlack,
        secondary: colorWhite,
        neutral: colorWhite,
        orange: colorOrange,
        blue: colorBlue,
        'light-blue': colorLightBlue,
        // states:
        's-success': colorBlue,
        's-error': colorOrange,
        // fonts:
        'f-primary': colorWhite,
        'f-secondary': colorBlack,
      },
    }),
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.kp-big-banner': {
          fontSize: '64px',
          fontWeight: '700',
          fontFamily: theme('fontFamily.Poppins'),
          fontStyle: 'normal',
        },
        '.kp-banner': {
          fontSize: '33px',
          fontWeight: '700',
          fontFamily: theme('fontFamily.Poppins'),
          fontStyle: 'normal',
        },
        '.kp-title': {
          fontSize: '28px',
          fontWeight: '500',
          fontFamily: theme('fontFamily.Poppins'),
        },
        '.kp-h2': {
          fontSize: '20px',
          fontWeight: '300',
          fontFamily: theme('fontFamily.Roboto'),
        },
        '.kp-h3': {
          fontSize: '16px',
          fontWeight: '100',
          fontFamily: theme('fontFamily.Roboto'),
        },
        '.kp-buttons': {
          fontSize: '16px',
          fontWeight: '600',
          fontFamily: theme('fontFamily.Roboto'),
        },
        '.kp-body': {
          fontSize: '16px',
          fontWeight: '500',
          fontFamily: theme('fontFamily.Roboto'),
          lineHeight: '24px',
          fontStyle: 'normal',
        },
        '.kp-body2': {
          fontSize: '16px',
          fontWeight: '100',
          fontFamily: theme('fontFamily.Roboto'),
          lineHeight: '24px',
          fontStyle: 'normal',
        },
      });
    }),
  ],
};
