import { createStitches } from '@stitches/react';

export const { styled, keyframes, createTheme, globalCss, theme } = createStitches({
  prefix: '',
  theme: {
    colors: {
      white: '#fff',
      gray100: '#bdc1c8',
      gray300: '#6b7381',
      gray700: '#454d55',
      gray800: '#343a40',
      gray900: '#232429',
      black: '#000',

      blue: '#0095ff',
      cyan: '#03a89e',
      green: '#329f59',
      orange: '#ff8c00',
      purple: '#a0a',
    },
  },
});

export const darkTheme = createTheme('dark-theme', {
  colors: {
    white: '#252526',
    gray100: '#333333',
    gray300: '#4d4d4d',
    gray700: '#a0a0a0',
    gray800: '#cccccc',
    gray900: '#d4d4d4',
    black: '#fff',
  },
});
