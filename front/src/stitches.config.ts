import { createStitches } from '@stitches/react';

export const { styled, keyframes, createTheme, globalCss, theme } = createStitches({
  prefix: '',
  theme: {
    colors: {
      white: '#fff',
      surface: '#ffffff',
      surfaceSoft: '#f6f8fb',
      border: '#dce3ec',
      gray100: '#bdc1c8',
      gray300: '#6b7381',
      gray700: '#454d55',
      gray800: '#343a40',
      gray900: '#232429',
      textMuted: '#667085',
      black: '#000',

      blue: '#2f6fed',
      cyan: '#00a7b5',
      green: '#39a66a',
      orange: '#ff9f1c',
      purple: '#8f5cf7',
      pink: '#f75c8c',
    },
  },
});

export const darkTheme = createTheme('dark-theme', {
  colors: {
    white: '#252526',
    surface: '#242733',
    surfaceSoft: '#171a23',
    border: '#3a4050',
    gray100: '#333746',
    gray300: '#8d95a5',
    gray700: '#a0a0a0',
    gray800: '#cccccc',
    gray900: '#d4d4d4',
    textMuted: '#a2aabc',
    black: '#fff',
  },
});
