import { rem } from 'polished';
import { memo } from 'react';

import { styled } from '~/stitches.config';

export const Wrapper = styled('div', {
  display: 'grid',
  gap: rem(18),
  alignContent: 'space-between',
  width: '100%',
  maxWidth: rem(440),
  minHeight: `calc(100dvh - ${rem(36)})`,
  padding: `${rem(58)} ${rem(2)} 0`,
});

export const Hero = styled('section', {
  display: 'grid',
  gap: rem(14),
  justifyItems: 'center',
  width: '100%',
});

export const PreviewBoard = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(6, 1fr)',
  gap: rem(6),
  width: rem(216),
  padding: rem(12),
  border: '1px solid $border',
  borderRadius: rem(8),
  backgroundColor: '$surface',
  boxShadow: '0 18px 36px rgba(35, 36, 41, 0.1)',

  '@media (max-height: 700px)': {
    width: rem(180),
    padding: rem(10),
  },
});

export const PreviewTile = styled('span', {
  width: rem(26),
  height: rem(26),
  borderRadius: rem(6),
  boxShadow: 'inset 0 -3px 0 rgba(35, 36, 41, 0.12)',

  variants: {
    color: {
      blue: {
        backgroundColor: '$blue',
      },
      cyan: {
        backgroundColor: '$cyan',
      },
      orange: {
        backgroundColor: '$orange',
      },
      green: {
        backgroundColor: '$green',
      },
      purple: {
        backgroundColor: '$purple',
      },
      pink: {
        backgroundColor: '$pink',
      },
    },
    selected: {
      true: {
        outline: '3px solid rgba(47, 111, 237, 0.24)',
        transform: `scale(1.08)`,
      },
    },
  },

  '@media (max-height: 700px)': {
    width: rem(21),
    height: rem(21),
  },
});

export const TitleGroup = styled('div', {
  display: 'grid',
  gap: rem(8),
  justifyItems: 'center',
});

export const Title = memo(styled('h1', {
  margin: 0,
  color: '$blue',
  fontSize: rem(46),
  fontWeight: 900,
  lineHeight: 1,
  textAlign: 'center',
  textTransform: 'uppercase',
}));

export const Tagline = styled('p', {
  maxWidth: rem(300),
  color: '$textMuted',
  fontSize: rem(15),
  fontWeight: 700,
  lineHeight: 1.5,
  textAlign: 'center',
});

export const StartPanel = styled('section', {
  display: 'grid',
  gap: rem(10),
  width: '100%',
  padding: `${rem(14)} 0 0`,
});

export const InputGroup = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gap: rem(8),
  width: '100%',

  '@media (max-width: 420px)': {
    gridTemplateColumns: '1fr',
  },
});

export const SecondaryButton = styled('button', {
  minHeight: rem(48),
  padding: `0 ${rem(14)}`,
  border: '1px solid $border',
  borderRadius: rem(8),
  color: '$gray800',
  fontSize: rem(14),
  fontWeight: 800,
  backgroundColor: '$surface',
  cursor: 'pointer',

  '&:hover': {
    borderColor: '$blue',
    color: '$blue',
  },
});

export const ActionRow = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: rem(8),
  width: '100%',

  '& a': {
    display: 'block',
    textDecoration: 'none',
  },

  '& button': {
    width: '100%',
    margin: 0,
  },

  '@media (max-width: 420px)': {
    gridTemplateColumns: '1fr',
  },
});

export const RuleNote = styled('p', {
  padding: `${rem(10)} ${rem(12)}`,
  border: '1px solid $border',
  borderRadius: rem(8),
  color: '$textMuted',
  fontSize: rem(13),
  fontWeight: 700,
  lineHeight: 1.45,
  backgroundColor: '$surface',
});
