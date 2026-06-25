import { rem } from 'polished';
import { memo } from 'react';

import { styled } from '~/stitches.config';

export const Wrapper = styled('div', {
  '&': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: `${rem(8)} ${rem(10)}`,
    border: '1px solid $border',
    borderRadius: rem(8),
    backgroundColor: '$surface',
  },
});

export const Label = memo(styled('span', {
  color: '$gray800',
  fontSize: rem(14),
  fontWeight: 700,
}));

export const Container = styled('button', {
  '&': {
    position: 'relative',

    order: 2,
    width: rem(46),
    height: rem(26),
    marginLeft: rem(12),
    padding: 0,
    border: 'none',
    borderRadius: rem(26),

    color: '$blue',

    backgroundColor: '$border',

    transition: 'background-color 0.2s ease-in-out',

    '&:focus, &:focus.active': {
      outline: '2px solid rgba(47, 111, 237, 0.24)',
      outlineOffset: rem(2),
    },
  },
  variants: {
    activated: {
      true: {
        backgroundColor: '$blue',
      },
    }
  }
});

export const Thumb = styled('div', {
  '&': {
    position: 'absolute',
    top: rem(4),
    left: rem(4),

    width: rem(18),
    height: rem(18),
    borderRadius: rem(18),

    background: '$white',

    transform: 'translateX(0)',

    transition: 'transform 0.25s',
  },
  variants: {
    activated: {
      true: {
        transform: `translateX(${rem(20)})`,
      },
    },
  }
});
