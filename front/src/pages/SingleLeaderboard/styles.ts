import { rem } from 'polished';
import { memo } from 'react';

import { keyframes, styled } from '~/stitches.config';

export const Wrapper = styled('div', {
  display: 'grid',
  gap: rem(14),
  alignContent: 'start',
  justifyItems: 'center',
  width: '100%',
  maxWidth: rem(820),
  minHeight: `calc(100dvh - ${rem(36)})`,
  padding: `${rem(58)} 0 0`,
});

export const Header = styled('header', {
  display: 'grid',
  gap: rem(10),
  justifyItems: 'center',
  width: '100%',
});

export const ActionRow = styled('div', {
  display: 'flex',
  gap: rem(8),
  justifyContent: 'center',
  width: '100%',

  '& a': {
    textDecoration: 'none',
  },
});

export const Title = memo(styled('h1', {
  margin: `${rem(4)} 0 ${rem(2)}`,
  color: '$blue',
  fontSize: rem(32),
  fontWeight: 900,
  lineHeight: 1.15,
  textAlign: 'center',
}));

export const Summary = styled('p', {
  color: '$textMuted',
  fontSize: rem(14),
  fontWeight: 700,
  textAlign: 'center',
});

export const TableWrap = styled('div', {
  width: '100%',
  overflowX: 'auto',
  border: '1px solid $border',
  borderRadius: rem(8),
  backgroundColor: '$surface',
  boxShadow: '0 18px 40px rgba(35, 36, 41, 0.08)',
});

export const Table = styled('table', {
  width: '100%',
  minWidth: rem(620),
  borderCollapse: 'separate',
  borderSpacing: 0,
});

export const TableRow = styled('tr', {
  '&:last-child td': {
    borderBottom: 'none',
  },
});

export const Th = styled('th', {
  padding: `${rem(12)} ${rem(10)}`,
  borderBottom: '1px solid $border',
  color: '$gray900',
  fontSize: rem(13),
  fontWeight: 900,
  textAlign: 'center',
  backgroundColor: '$surfaceSoft',
});

const HyperKeyframe = keyframes({
  '0%': {
    color: '$gray900',
  },
  '50%': {
    color: '$blue',
  },
  '100%': {
    color: '$gray900',
  },
});

export const Td = styled('td', {
  padding: `${rem(12)} ${rem(10)}`,
  borderBottom: '1px solid $border',
  color: '$gray800',
  fontSize: rem(15),
  fontWeight: 700,
  textAlign: 'center',

  variants: {
    name: {
      true: {
        maxWidth: rem(180),
        fontWeight: 900,
        overflowWrap: 'anywhere',
      }
    },
    color: {
      hyper: {
        animation: `${HyperKeyframe} 1.5s ease-in-out infinite`,
      },
      nutella: {
        color: '$pink',
      },
      red: {
        color: '$pink',
      },
      orange: {
        color: '$orange',
      },
      violet: {
        color: '$purple',
      },
      blue: {
        color: '$blue',
      },
      cyan: {
        color: '$cyan',
      },
      green: {
        color: '$green',
      },
      gray: {
        color: '$textMuted',
      }
    }
  }
});

export const RankBadge = styled('span', {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: rem(34),
  height: rem(28),
  borderRadius: rem(8),
  color: '$gray800',
  fontSize: rem(13),
  fontWeight: 900,
  backgroundColor: '$surfaceSoft',

  variants: {
    highlight: {
      true: {
        color: '$white',
        backgroundColor: '$blue',
      },
    },
  },
});

export const StateBox = styled('div', {
  width: '100%',
  padding: `${rem(28)} ${rem(18)}`,
  border: '1px solid $border',
  borderRadius: rem(8),
  color: '$textMuted',
  fontSize: rem(15),
  fontWeight: 800,
  lineHeight: 1.5,
  textAlign: 'center',
  backgroundColor: '$surface',
});
