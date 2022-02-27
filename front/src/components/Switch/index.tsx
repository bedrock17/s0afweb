import React, { memo } from 'react';

import {
  Container, Label, Thumb, Wrapper
} from './styles';


type Props = {
  checked: boolean,
  onChange: (checked: boolean) => void,
};

const Switch: React.FC<Props> = ({ checked, onChange, children }) => {
  const onClick = () => onChange(!checked);

  return (
    <Wrapper>
      <Container
        type={'button'}
        data-toggle={'button'}
        aria-pressed={checked}
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
