import { rem } from 'polished';
import { memo } from 'react';

import { styled } from '~/stitches.config';

const Container = styled('input', {
  '&': {
    width: '100%',
    minHeight: rem(48),
    padding: `${rem(12)} ${rem(14)}`,
    border: '1px solid $border',
    borderRadius: rem(8),

    backgroundColor: '$surface',
    color: '$gray900',
    boxShadow: '0 10px 24px rgba(35, 36, 41, 0.06)',

    fontSize: rem(16),
    fontWeight: 600,

    appearance: 'none',

    '&::placeholder': {
      color: '$textMuted',
      fontWeight: 500,
    },

    '&:focus': {
      borderColor: '$blue',
      outline: 'none',
      boxShadow: '0 0 0 3px rgba(47, 111, 237, 0.16), 0 12px 24px rgba(35, 36, 41, 0.08)',
    },
  },
});

export default memo(Container);
