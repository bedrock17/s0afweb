import { rem } from 'polished';
import { DefaultTheme, styled } from 'solid-styled-components';

type Props = {
  color: keyof DefaultTheme['colors'],
};

const Container = styled.button<Props>(props => ({
  '&': {
    padding: `${rem(8)} ${rem(16)}`,
    border: '1px solid currentColor',
    borderRadius: rem(4),

    color: props.theme?.colors[props.color],
    fontSize: rem(14),

    backgroundColor: 'transparent',

    appearance: 'none',
  },
  '&:hover': {

    color: props.theme?.colors.white,

    backgroundColor:  props.theme?.colors[props.color],
  }
}));

export default Container;
