import { rem } from 'polished';

import { styled } from '~/stitches.config';

export const Container = styled('div', {
  '&': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: '100%',
    margin: '0 auto',
    padding: `${rem(24)} ${rem(16)}`,
  }
});
