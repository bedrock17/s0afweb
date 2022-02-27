import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { gameAnimationEffectState, gameUsernameState } from '~/atoms/game';
import Button from '~/components/Button';
import Input from '~/components/Input';
import Switch from '~/components/Switch';

import { Title, Wrapper } from './styles';

const IndexPage = () => {
  const [name, setName] = useRecoilState(gameUsernameState);
  const [animationEffect, setAnimationEffect] = useRecoilState(gameAnimationEffectState);

  const onNameChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setName(e.target.value);
  };

  return (
    <Wrapper>
      <Title>Poptile</Title>
      <Switch checked={animationEffect} onChange={setAnimationEffect}>
        애니메이션 효과
      </Switch>
      <Input type={'text'} placeholder={'사용자 이름'} value={name} onChange={onNameChange} />
      <Link to={'/single'}>
        <Button color={'blue'}>Solo Play</Button>
      </Link>
      <Button color={'blue'} disabled>Online Play</Button>
    </Wrapper>
  );
};

export default IndexPage;
