import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { gameAnimationEffectState, gameUsernameState } from '~/atoms/game';
import Button from '~/components/Button';
import Input from '~/components/Input';
import Switch from '~/components/Switch';
import { useLocalStorage } from '~/hooks/useLocalStorage';

import { Title, Wrapper } from './styles';

const IndexPage = () => {
  const [name, setName] = useRecoilState(gameUsernameState);
  const [animationEffect, setAnimationEffect] = useRecoilState(gameAnimationEffectState);
  const [storedName, setStoredName] = useLocalStorage('username', '');

  const onNameChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setStoredName(e.target.value);
    setName(e.target.value);
  };

  useEffect(() => {
    setName(storedName);
  }, [setName, storedName]);

  return (
    <Wrapper>
      <Title>POPTILE</Title>
      <Switch checked={animationEffect} onChange={setAnimationEffect}>
        애니메이션 효과
      </Switch>
      <Input type={'text'} placeholder={'사용자 이름을 입력해주세요.'} value={name} onChange={onNameChange} />
      <div>
        <Link to={'/single'}>
          <Button color={'blue'} disabled={name.length === 0}>Solo Play</Button>
        </Link>
        <Link to={'/single/leaderboard'}>
          <Button color={'cyan'}>Leaderboard</Button>
        </Link>
      </div>
      <Button color={'blue'} disabled>Online Play</Button>
    </Wrapper>
  );
};

export default IndexPage;
