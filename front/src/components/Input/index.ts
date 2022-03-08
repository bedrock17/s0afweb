import { rem } from 'polished';
import { memo } from 'react';

import { styled } from '~/stitches.config';

const Container = styled('input', {
  '&': {
    width: '100%',
    padding: `${rem(6)} ${rem(8)}`,
    border: '1px solid $gray100',
    borderRadius: rem(4),

    fontSize: rem(16),

    appearance: 'none',
  },
});

export default memo(Container);
