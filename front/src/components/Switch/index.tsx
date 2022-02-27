import type { Accessor, Component } from 'solid-js';

import { Container, Thumb } from './styles';


type Props = {
  checked: Accessor<boolean>,
  onChange: (checked: boolean) => void,
};

const Switch: Component<Props> = ({ checked, onChange }) => {
  const onClick = () => onChange(!checked());

  return (
    <Container
      type={'button'}
      data-toggle={'button'}
      aria-pressed={checked()}
      onClick={onClick}
      activated={checked()}
    >
      <Thumb activated={checked()}  />
    </Container>
  );
};

export default Switch;
