import { rem } from 'polished';
import { memo } from 'react';

import { styled } from '~/stitches.config';

export const Wrapper = styled('div', {
  '&': {
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
});

export const Label = memo(styled('span', {
  fontSize: rem(16),
}));

export const Container = styled('button', {
  '&': {
    position: 'relative',

    width: rem(48),
    height: rem(24),
    marginRight: rem(6),
    padding: 0,
    border: 'none',
    borderRadius: rem(24),

    color: '$blue',

    backgroundColor: '$gray100',

    transition: 'background-color 0.2s ease-in-out',

    '&:focus, &:focus.active': {
      outline: 'none',
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
    top: rem(3),
    left: rem(3),

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
        transform: `translateX(${rem(24)})`,
      },
    },
  }
});
