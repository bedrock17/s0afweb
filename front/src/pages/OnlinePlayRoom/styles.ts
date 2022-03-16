import { rem } from 'polished';

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

export const OpponentWrapper = styled('div', {
  '&': {
    display: 'flex',
    gap: '1rem',
    width: '100%',
    paddingBottom: rem(16),
    overflowX: 'scroll',
  }
});

export const OpponentContainer = styled('div', {
  width: '64px',
});

export const Username = styled('span', {
  '&': {
  },
  variants: {
    opponent: {
      true: {
        display: 'block',
        width: '100%',
        overflow: 'hidden',

        fontSize: rem(12),
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      }
    },
    master: {
      true: {
        fontWeight: 700,
      }
    }
  }
});

export const Score = styled('span', {
  '&': {
  },
  variants: {
    opponent: {
      true: {
        display: 'block',
        width: '100%',
        overflow: 'hidden',

        fontSize: rem(12),
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      }
    },
  }
});

export const ScoreboardModal = styled('div', {
  '&': {
    position: 'fixed',

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',

    width: '100%',
    maxWidth: rem(320),
    minHeight: '50%',
    padding: rem(10),
    border: `${rem(1)} solid $gray700`,

    backgroundColor: '$white',
  },
});

export const ScoreTable = styled('table', {
  maxWidth: rem(180),
  width: '100%',

  'tr': {
    height: rem(24),
  },
  'th, td': {
    textAlign: 'center',
  }
});

export const Dim = styled('div', {
  position: 'fixed',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  width: '100%',
  height: '100%',
});
