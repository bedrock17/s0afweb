import { rem } from 'polished';
import { memo } from 'react';

import { keyframes, styled } from '~/stitches.config';

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
  width: '100%',
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

const HyperKeyframe = keyframes({
  '0%': {
    color: 'black',
    textShadow: '0 0 8px rgba(0,0,0,0.1)',
  },
  '33%': {
    color: 'red',
    textShadow: '0 0 8px rgba(255,0,0,0.1)',
  },
  '66%': {
    color: '#0af',
    textShadow: '0 0 8px rgba(0,170,255,0.1)',
  },
  '100%': {
    color: 'black',
    textShadow: '0 0 8px rgba(0,0,0,0.1)',
  },
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
    },
    color: {
      hyper: {
        animation: `${HyperKeyframe} 1.5s ease-in-out infinite`,
      },
      nutella: {
        color: 'red',

        '&::first-letter': {
          color: '$black',
        }
      },
      red: {
        color: 'red',
      },
      orange: {
        color: '#ff8c00',
      },
      violet: {
        color: '#a0a',
      },
      blue: {
        color: 'blue',
      },
      cyan: {
        color: '03a89e',
      },
      green: {
        color: 'green',
      },
      gray: {
        color: 'gray',
      }
    }
  }
});
