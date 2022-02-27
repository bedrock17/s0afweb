import { em, rem } from 'polished';
import { DefaultTheme, styled } from 'solid-styled-components';

type Props = {
  color: keyof DefaultTheme['colors'],
};

const Container = styled.button<Props>(props => ({
  '&': {
    minWidth: rem(140),
    margin: `${rem(6)} ${rem(4)}`,
    padding: `${rem(6)} ${rem(12)}`,
    border: `${em(1)} solid currentColor`,
    borderRadius: rem(4),

    color: props.theme?.colors[props.color],
    fontSize: rem(20),

    backgroundColor: 'transparent',

    appearance: 'none',

    '&[disabled]': {
      borderColor: props.theme?.colors.gray300,

      color: props.theme?.colors.gray300,

      cursor: 'not-allowed',

      opacity: 0.5
    },
  },
  '&:not([disabled]):hover': {

    color: props.theme?.colors.white,

    backgroundColor:  props.theme?.colors[props.color],
  }
}));

export default Container;
