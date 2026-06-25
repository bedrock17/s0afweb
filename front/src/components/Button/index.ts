import { em, rem } from 'polished';
import { memo } from 'react';

import { styled } from '~/stitches.config';

const Container = styled('button', {
  '&': {
    minWidth: rem(140),
    minHeight: rem(44),
    margin: `${rem(4)} ${rem(4)}`,
    padding: `${rem(10)} ${rem(18)}`,
    border: `${em(1)} solid transparent`,
    borderRadius: rem(8),

    fontSize: rem(16),
    fontWeight: 700,

    textAlign: 'center',

    backgroundColor: '$surface',
    boxShadow: '0 10px 22px rgba(35, 36, 41, 0.08)',
    cursor: 'pointer',

    appearance: 'none',
    transition: 'transform 0.16s ease, box-shadow 0.16s ease, background-color 0.16s ease, color 0.16s ease',

    '&[disabled]': {
      borderColor: '$border',

      color: '$textMuted',

      cursor: 'not-allowed',

      opacity: 0.5
    },
  },

  '&:not([disabled]):hover': {
    color: '$white',
    transform: `translateY(${rem(-1)})`,
    boxShadow: '0 14px 28px rgba(35, 36, 41, 0.12)',
  },

  '&:not([disabled]):active': {
    transform: 'translateY(0)',
    boxShadow: '0 8px 16px rgba(35, 36, 41, 0.1)',
  },

  variants: {
    color: {
      orange: {
        color: '$orange',
        borderColor: '$orange',

        '&:not([disabled]):hover': {
          backgroundColor: '$orange',
        }
      },
      blue: {
        color: '$blue',
        borderColor: '$blue',

        '&:not([disabled]):hover': {
          backgroundColor: '$blue',
        }
      },
      cyan: {
        color: '$cyan',
        borderColor: '$cyan',

        '&:not([disabled]):hover': {
          backgroundColor: '$cyan',
        }
      }
    }
  },
});

export default memo(Container);
