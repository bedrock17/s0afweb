import { rem } from 'polished';

import { styled } from '~/stitches.config';

export const Container = styled('div', {
  '&': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    maxWidth: rem(480),
    minHeight: '100dvh',
    margin: '0 auto',
    padding:
      `calc(env(safe-area-inset-top, 0px) + ${rem(18)}) ${rem(14)} calc(env(safe-area-inset-bottom, 0px) + ${rem(18)})`,

    background:
      'linear-gradient(180deg, $surfaceSoft 0%, $white 44%, $surfaceSoft 100%)',
  }
});
