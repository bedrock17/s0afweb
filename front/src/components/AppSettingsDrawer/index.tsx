import React, { memo, useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { gameAnimationEffectState } from '~/atoms/game';
import { darkModeState } from '~/atoms/ui';
import { useLocalStorage } from '~/hooks/useLocalStorage';

import SettingsDrawer from '../SettingsDrawer';
import Switch from '../Switch';

const AppSettingsDrawer = () => {
  const [animationEffect, setAnimationEffect] = useRecoilState(gameAnimationEffectState);
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);
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

  useEffect(() => {
    setAnimationEffect(storedAnimationEffect);
    setDarkMode(storedDarkMode);
  }, [setAnimationEffect, setDarkMode, storedAnimationEffect, storedDarkMode]);

  return (
    <SettingsDrawer>
      <Switch checked={animationEffect} onChange={onAnimationEffectChange}>
        애니메이션 효과
      </Switch>
      <Switch checked={darkMode} onChange={onDarkModeChange}>
        다크 모드
      </Switch>
    </SettingsDrawer>
  );
};

export default memo(AppSettingsDrawer);
