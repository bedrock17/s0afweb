import React, { useState } from 'react';

import Button from '~/components/Button';
import Input from '~/components/Input';
import Switch from '~/components/Switch';

import { Title, Wrapper } from './styles';

const IndexPage = () => {
  const [checked, setChecked] = useState(false);
  return (
    <Wrapper>
      <Title>Poptile</Title>
      <Switch checked={checked} onChange={setChecked}>
        애니메이션 효과
      </Switch>
      <Input type={'text'} placeholder={'사용자 이름'} />
      <Button color={'blue'}>Solo Play</Button>
      <Button color={'green'} disabled>Online Play</Button>
    </Wrapper>
  );
};

export default IndexPage;
