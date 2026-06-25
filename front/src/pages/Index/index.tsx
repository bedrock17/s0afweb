import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';

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
  const [animationEffect, setAnimationEffect] = useRecoilState(gameAnimationEffectState);
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);
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
      </Wrapper>
    </SinglePlayLayout>
  );
};

export default IndexPage;
