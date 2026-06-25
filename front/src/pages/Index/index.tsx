import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { Auth } from '~/api';
import { userState } from '~/atoms/auth';
import { gameAnimationEffectState, gameUsernameState } from '~/atoms/game';
import { darkModeState } from '~/atoms/ui';
import Button from '~/components/Button';
import Input from '~/components/Input';
import Switch from '~/components/Switch';
import { useLocalStorage } from '~/hooks/useLocalStorage';
import SinglePlayLayout from '~/layout/SinglePlayLayout';

import { Title, Wrapper } from './styles';

const IndexPage = () => {
  const [name, setName] = useRecoilState(gameUsernameState);
  const [user, setUser] = useRecoilState(userState);
  const [animationEffect, setAnimationEffect] = useRecoilState(gameAnimationEffectState);
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);
  const [googleLoginEnabled, setGoogleLoginEnabled] = useState<boolean>(false);
  const [storedName, setStoredName] = useLocalStorage('username', '');
  const [storedAnimationEffect, setStoredAnimationEffect] = useLocalStorage('animationEffect', true);
  const [storedDarkMode, setStoredDarkMode] = useLocalStorage('darkMode', false);

  const onAnimationEffectChange = (value: boolean) => {
    setStoredAnimationEffect(value);
    setAnimationEffect(value);
  };

  const onDarkModeChange = (value: boolean) => {
    setStoredDarkMode(value);
    setDarkMode(value);
  };

  const onNameChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setStoredName(e.target.value);
    setName(e.target.value);
  };

  useEffect(() => {
    setName(storedName);
    setAnimationEffect(storedAnimationEffect);
    setDarkMode(storedDarkMode);
  }, [setAnimationEffect, setName, setDarkMode, storedAnimationEffect, storedName, storedDarkMode]);

  useLayoutEffect(() => {
    Auth.profile.get().then(setUser).catch(() => setUser(undefined));
  }, [setUser]);

  useEffect(() => {
    Auth.config.get()
      .then(config => setGoogleLoginEnabled(config.google_login_enabled))
      .catch(() => setGoogleLoginEnabled(false));
  }, []);

  return (
    <SinglePlayLayout>
      <Wrapper>
        <Title>POPTILE</Title>
        <Switch checked={animationEffect} onChange={onAnimationEffectChange}>
        애니메이션 효과
        </Switch>
        <Switch checked={darkMode} onChange={onDarkModeChange}>
        다크 모드
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
          googleLoginEnabled && (
            user ?  (
              <Link to={'/online/'}>
                <Button color={'orange'}>Online Play</Button>
              </Link>
            ) : (
              <a href={'/api/v1/auth/google'}>
                <Button color={'blue'}>Login</Button>
              </a>
            )
          )
        }
      </Wrapper>
    </SinglePlayLayout>
  );
};

export default IndexPage;
