import React, { useEffect, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { Auth } from '~/api';
import { userState } from '~/atoms/auth';
import { gameAnimationEffectState, gameUsernameState } from '~/atoms/game';
import Button from '~/components/Button';
import Input from '~/components/Input';
import Switch from '~/components/Switch';
import { useLocalStorage } from '~/hooks/useLocalStorage';

import { Title, Wrapper } from './styles';

const IndexPage = () => {
  const [name, setName] = useRecoilState(gameUsernameState);
  const [user, setUser] = useRecoilState(userState);
  const [animationEffect, setAnimationEffect] = useRecoilState(gameAnimationEffectState);
  const [storedName, setStoredName] = useLocalStorage('username', '');
  const [storedAnimationEffect, setStoredAnimationEffect] = useLocalStorage('animationEffect', true);

  const onAnimationEffectChange = (value: boolean) => {
    setStoredAnimationEffect(value);
    setAnimationEffect(value);
  };

  const onNameChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setStoredName(e.target.value);
    setName(e.target.value);
  };

  useEffect(() => {
    setName(storedName);
    setAnimationEffect(storedAnimationEffect);
  }, [setName, storedName]);

  useLayoutEffect(() => {
    Auth.profile.get().then(setUser).catch(() => setUser(undefined));
  }, [setUser]);

  return (
    <Wrapper>
      <Title>POPTILE</Title>
      <Switch checked={animationEffect} onChange={onAnimationEffectChange}>
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
      {
        user ?  (
          <Button color={'blue'} disabled>Online Play</Button>
        ) : (
          <a href={'/api/v1/auth/google'}>
            <Button color={'blue'}>Login</Button>
          </a>
        )
      }
    </Wrapper>
  );
};

export default IndexPage;
