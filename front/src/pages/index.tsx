import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';

import Button from '~/components/Button';
import Input from '~/components/Input';
import Switch from '~/components/Switch';

const IndexPage: Component = () => {
  const [checked, setChecked] = createSignal(false);
  return (
    <div>
      <Button color={'blue'}>PLAY!</Button>
      <Button color={'green'}>PLAY!</Button>
      <Switch checked={checked} onChange={setChecked} />
      <Input type={'text'} placeholder={'test name'} />
    </div>
  );
};

export default IndexPage;
