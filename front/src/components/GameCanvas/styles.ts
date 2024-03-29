import { styled } from '~/stitches.config';

export const Canvas = styled('canvas', {
  '&': {
    border: '1px solid $black',
  },
  variants: {
    gameOver : {
      true: {
        filter: 'grayscale(100%)',
      }
    }
  }
});
