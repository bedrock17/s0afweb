import { em, rem } from 'polished';
import { styled } from 'solid-styled-components';

export const Wrapper = styled.div({
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

export const Title = styled.h1(props => ({
  '&': {
    marginBottom: rem(24),

    color: props.theme?.colors.blue,
    fontSize: rem(40),
    textAlign: 'center',
    textTransform: 'uppercase',
  }
}));
