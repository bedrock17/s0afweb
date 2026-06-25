import { rem } from 'polished';

import { styled } from '~/stitches.config';

export const Wrapper = styled('div', {
  display: 'grid',
  gap: rem(10),
  alignContent: 'start',
  justifyItems: 'center',
  width: '100%',
  maxWidth: rem(440),
  minHeight: `calc(100dvh - ${rem(36)})`,
  padding: `${rem(58)} 0 0`,
});

export const Hud = styled('header', {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'center',
  gap: rem(12),
  width: '100%',
  padding: rem(12),
  border: '1px solid $border',
  borderRadius: rem(8),
  backgroundColor: '$surface',
  boxShadow: '0 14px 30px rgba(35, 36, 41, 0.08)',
});

export const PlayerBlock = styled('div', {
  display: 'grid',
  gap: rem(3),
});

export const Label = styled('span', {
  color: '$textMuted',
  fontSize: rem(12),
  fontWeight: 800,
});

export const PlayerName = styled('strong', {
  color: '$gray900',
  fontSize: rem(18),
  overflowWrap: 'anywhere',
});

export const Score = styled('strong', {
  minWidth: rem(112),
  padding: `${rem(8)} ${rem(12)}`,
  borderRadius: rem(8),
  color: '$white',
  fontSize: rem(20),
  fontWeight: 900,
  textAlign: 'center',
  backgroundColor: '$blue',
  boxShadow: '0 12px 24px rgba(47, 111, 237, 0.22)',
});

export const Hint = styled('p', {
  width: '100%',
  padding: `0 ${rem(8)}`,
  color: '$textMuted',
  fontSize: rem(13),
  fontWeight: 700,
  lineHeight: 1.45,
  textAlign: 'center',
});
