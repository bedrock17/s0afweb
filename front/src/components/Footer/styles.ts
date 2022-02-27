import { rem } from 'polished';

import { styled } from '~/stitches.config';

export const Container = styled('footer', {
  '&': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: rem(36),
  }
});

export const Title = styled('h2', {
  '&': {
    color: '$gray900',

    textAlign: 'center',
    textTransform: 'uppercase',
  }
});
