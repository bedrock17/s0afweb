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
    maxWidth: rem(800),
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

export const Table = styled('table', {
  borderCollapse: 'collapse',
});

export const TableRow = styled('tr', {

});

export const Th = styled('th', {
  '&': {
    padding: rem(12),
    border: '1px solid $gray700',
    borderRightWidth: 0,
    borderLeftWidth: 0,

    color: '$white',
    fontWeight: 'bold',

    fontSize: rem(18),
    textAlign: 'center',

    backgroundColor: '$gray800',
  }
});

export const Td = styled('td', {
  '&': {
    padding: rem(12),
    border: '1px solid $gray700',
    borderRightWidth: 0,
    borderLeftWidth: 0,

    color: '$gray700',
    fontSize: rem(16),
    textAlign: 'center',
  },

  variants: {
    name: {
      true: {
        maxWidth: rem(140),

        fontWeight: 700,
      }
    }
  }
});
