import { rem } from 'polished';

import { styled } from '~/stitches.config';

export const FloatingButton = styled('button', {
  position: 'fixed',
  zIndex: 60,
  top: `calc(env(safe-area-inset-top, 0px) + ${rem(14)})`,
  right: `calc(env(safe-area-inset-right, 0px) + ${rem(14)})`,

  display: 'inline-flex',
  flexDirection: 'column',
  gap: rem(4),
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(46),
  height: rem(46),
  border: '1px solid $border',
  borderRadius: rem(8),

  backgroundColor: '$surface',
  boxShadow: '0 12px 28px rgba(35, 36, 41, 0.14)',
  cursor: 'pointer',
  transition: 'border-color 0.16s ease, box-shadow 0.16s ease, transform 0.16s ease',

  '&:focus': {
    outline: '3px solid rgba(47, 111, 237, 0.18)',
    outlineOffset: rem(2),
  },

  '&[data-open="true"]': {
    borderColor: '$blue',
    boxShadow: '0 14px 30px rgba(47, 111, 237, 0.18)',
  },
});

export const Bar = styled('span', {
  width: rem(18),
  height: rem(2),
  borderRadius: rem(2),
  backgroundColor: '$gray900',
});

export const Scrim = styled('div', {
  position: 'fixed',
  zIndex: 40,
  inset: 0,
  backgroundColor: 'rgba(20, 24, 32, 0.18)',
  opacity: 0,
  pointerEvents: 'none',
  transition: 'opacity 0.16s ease',

  variants: {
    open: {
      true: {
        opacity: 1,
        pointerEvents: 'auto',
      },
    },
  },
});

export const Sheet = styled('aside', {
  position: 'fixed',
  zIndex: 70,
  top: `calc(env(safe-area-inset-top, 0px) + ${rem(68)})`,
  right: `calc(env(safe-area-inset-right, 0px) + ${rem(14)})`,

  display: 'grid',
  gap: rem(12),
  width: `min(calc(100vw - ${rem(28)}), ${rem(340)})`,
  padding: rem(14),
  border: '1px solid $border',
  borderRadius: rem(8),

  backgroundColor: '$surface',
  boxShadow: '0 18px 42px rgba(35, 36, 41, 0.22)',
  opacity: 0,
  pointerEvents: 'none',
  transform: `translate(${rem(8)}, ${rem(-8)}) scale(0.96)`,
  transformOrigin: 'top right',
  transition: 'opacity 0.16s ease, transform 0.16s ease',

  '&::before': {
    content: '',
    position: 'absolute',
    top: rem(-6),
    right: rem(16),
    width: rem(12),
    height: rem(12),
    borderTop: '1px solid $border',
    borderLeft: '1px solid $border',
    backgroundColor: '$surface',
    transform: 'rotate(45deg)',
  },

  variants: {
    open: {
      true: {
        opacity: 1,
        pointerEvents: 'auto',
        transform: 'translate(0, 0) scale(1)',
      },
    },
  },
});

export const Handle = styled('span', {
  display: 'none',
});

export const Header = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(12),
});

export const Title = styled('strong', {
  color: '$gray900',
  fontSize: rem(17),
  fontWeight: 900,
});

export const CloseButton = styled('button', {
  minWidth: rem(52),
  minHeight: rem(38),
  border: '1px solid $border',
  borderRadius: rem(8),
  color: '$gray800',
  fontSize: rem(14),
  fontWeight: 900,
  backgroundColor: '$surfaceSoft',
  cursor: 'pointer',
});

export const Content = styled('div', {
  display: 'grid',
  gap: rem(10),
});
