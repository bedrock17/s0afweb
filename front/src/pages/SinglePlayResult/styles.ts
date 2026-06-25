import { rem } from 'polished';

import { styled } from '~/stitches.config';

export const Wrapper = styled('div', {
  display: 'grid',
  gap: rem(14),
  alignContent: 'center',
  justifyItems: 'center',
  width: '100%',
  maxWidth: rem(420),
  minHeight: `calc(100dvh - ${rem(36)})`,
  padding: `${rem(58)} 0 0`,
});

export const ResultCard = styled('section', {
  display: 'grid',
  gap: rem(12),
  justifyItems: 'center',
  width: '100%',
  padding: `${rem(26)} ${rem(18)}`,
  border: '1px solid $border',
  borderRadius: rem(8),
  backgroundColor: '$surface',
  boxShadow: '0 18px 40px rgba(35, 36, 41, 0.1)',
});

export const Badge = styled('span', {
  padding: `${rem(6)} ${rem(10)}`,
  borderRadius: rem(8),
  color: '$blue',
  fontSize: rem(13),
  fontWeight: 900,
  backgroundColor: 'rgba(47, 111, 237, 0.12)',
});

export const ScoreText = styled('h1', {
  margin: 0,
  color: '$gray900',
  fontSize: rem(60),
  fontWeight: 900,
  lineHeight: 1,
});

export const Message = styled('p', {
  maxWidth: rem(300),
  color: '$textMuted',
  fontSize: rem(15),
  fontWeight: 700,
  lineHeight: 1.5,
  textAlign: 'center',
});

export const ActionStack = styled('div', {
  display: 'grid',
  gap: rem(8),
  width: '100%',

  '& a': {
    textDecoration: 'none',
  },

  '& button': {
    width: '100%',
    margin: 0,
  },
});
