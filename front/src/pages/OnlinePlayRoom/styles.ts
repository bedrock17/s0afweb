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
  width: '61px',
});

export const OpponentName = styled('span', {
  '&': {
    display: 'block',
    width: '100%',
    overflow: 'hidden',

    fontSize: rem(12),
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }
});
