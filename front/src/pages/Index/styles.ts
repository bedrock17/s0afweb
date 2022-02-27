import { rem } from 'polished';
import { memo } from 'react';

import { styled } from '~/stitches.config';

export const Wrapper = styled('div', {
  '&': {
    display: 'flex',
    flexDirection: 'column',
    gap: rem(6),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: rem(400),
  }
});

export const Title = memo(styled('h1', {
  '&': {
    marginBottom: rem(24),

    color: '$blue',
    fontSize: rem(40),
    textAlign: 'center',
    textTransform: 'uppercase',
  }
}));
