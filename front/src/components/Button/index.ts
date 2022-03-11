import { em, rem } from 'polished';
import { memo } from 'react';

import { styled } from '~/stitches.config';

const Container = styled('button', {
  '&': {
    minWidth: rem(140),
    margin: `${rem(6)} ${rem(4)}`,
    padding: `${rem(6)} ${rem(12)}`,
    border: `${em(1)} solid currentColor`,
    borderRadius: rem(4),

    fontSize: rem(20),

    textAlign: 'center',

    backgroundColor: 'transparent',

    appearance: 'none',

    '&[disabled]': {
      borderColor: '$gray300',

      color: '$gray300',

      cursor: 'not-allowed',

      opacity: 0.5
    },
  },

  '&:not([disabled]):hover': {
    color: '$white',
  },

  variants: {
    color: {
      orange: {
        color: '$orange',

        '&:not([disabled]):hover': {
          backgroundColor: '$orange',
        }
      },
      blue: {
        color: '$blue',

        '&:not([disabled]):hover': {
          backgroundColor: '$blue',
        }
      },
      cyan: {
        color: '$cyan',

        '&:not([disabled]):hover': {
          backgroundColor: '$cyan',
        }
      }
    }
  },
});

export default memo(Container);
