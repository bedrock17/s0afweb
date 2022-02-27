import { rem } from 'polished';
import { styled } from 'solid-styled-components';

type Props = {
  activated: boolean,
};

export const Container = styled.button<Props>(props => ({
  position: 'relative',

  width: rem(48),
  height: rem(24),
  margin: `0 ${rem(16)}`,
  padding: 0,
  border: 'none',
  borderRadius: rem(24),

  color: props.theme?.colors.blue,

  backgroundColor: (
    props.activated
      ? props.theme?.colors.blue
      : props?.theme?.colors.gray100
  ),

  transition: 'background-color 0.2s ease-in-out',

  '&:focus, &:focus.active': {
    outline: 'none',
  },
}));

export const Thumb = styled.div<Props>(props => ({
  '&': {
    position: 'absolute',
    top: rem(3),
    left: rem(3),

    width: rem(18),
    height: rem(18),
    borderRadius: rem(18),

    background: props.theme?.colors.white,

    transform: `translateX(${props.activated ? rem(24) : 0})`,

    transition: 'transform 0.25s',
  },
}));
