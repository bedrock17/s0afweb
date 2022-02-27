import { rem } from 'polished';
import { styled } from 'solid-styled-components';

export const Container = styled.footer({
  '&': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: rem(36),
  }
});

export const Title = styled.h2(props => ({
  '&': {
    color: props.theme?.colors.gray900,

    textAlign: 'center',
    textTransform: 'uppercase',
  }
}));
