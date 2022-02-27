import { rem } from 'polished';
import { styled } from 'solid-styled-components';

const Container = styled.input(props => ({
  '&': {
    width: '100%',
    padding: `${rem(6)} ${rem(8)}`,
    border: `1px solid ${props.theme?.colors.gray100}`,
    borderRadius: rem(4),

    fontSize: rem(16),

    appearance: 'none',
  },
}));

export default Container;
