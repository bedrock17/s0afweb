import { createStitches } from '@stitches/react';

export const { styled, css, theme, globalCss } = createStitches({
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
      green: '#329f59',
    },
  },
});
