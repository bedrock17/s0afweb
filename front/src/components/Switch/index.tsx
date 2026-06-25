import React, { memo, PropsWithChildren } from 'react';

import {
  Container, Label, Thumb, Wrapper
} from './styles';


type Props = PropsWithChildren<{
  checked: boolean,
  onChange: (value: boolean) => void,
}>;

const Switch = ({ checked, onChange, children }: Props) => {
  const onClick = () => onChange(!checked);
  const label = typeof children === 'string' ? children.trim() : undefined;

  return (
    <Wrapper>
      <Container
        type={'button'}
        data-toggle={'button'}
        aria-pressed={checked}
        aria-label={label}
        onClick={onClick}
        activated={checked}
      >
        <Thumb activated={checked}  />
      </Container>
      <Label>{ children }</Label>
    </Wrapper>
  );
};

export default memo(Switch);
