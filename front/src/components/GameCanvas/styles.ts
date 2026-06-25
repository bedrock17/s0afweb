import { styled } from '~/stitches.config';

export const Canvas = styled('canvas', {
  '&': {
    display: 'block',
    maxWidth: '100%',
    border: '1px solid $border',
    borderRadius: 8,
    backgroundColor: '$surface',
    boxShadow: '0 18px 40px rgba(35, 36, 41, 0.14)',
  },
  variants: {
    gameOver : {
      true: {
        filter: 'grayscale(100%)',
      }
    }
  }
});
