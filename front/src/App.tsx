import React, { useEffect } from 'react';
import {
  Routes, Route, Navigate
} from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { darkModeState } from '~/atoms/ui';
import { useLocalStorage } from '~/hooks/useLocalStorage';
import OnlinePlay from '~/pages/OnlinePlay';
import OnlinePlayRoom from '~/pages/OnlinePlayRoom';
import { globalCss, darkTheme } from '~/stitches.config';

import IndexPage from './pages/Index';
import SingleLeaderboardPage from './pages/SingleLeaderboard';
import SinglePlayPage from './pages/SinglePlay';
import SinglePlayResultPage from './pages/SinglePlayResult';

const globalStyles = globalCss({
  'html, body': {
    backgroundColor: '$white',
    color: '$gray900',
    transition: 'background-color 0.2s ease, color 0.2s ease',
  },
});

function App() {
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);
  const [storedDarkMode, setStoredDarkMode] = useLocalStorage('darkMode', false);

  useEffect(() => {
    globalStyles();
  }, []);

  useEffect(() => {
    setDarkMode(storedDarkMode);
  }, [storedDarkMode, setDarkMode]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add(darkTheme.className);
    } else {
      document.documentElement.classList.remove(darkTheme.className);
    }
  }, [darkMode]);

  return (
    <Routes>
      <Route index element={<IndexPage />} />
      <Route path={'/single'} element={<SinglePlayPage />} />
      <Route path={'/single/leaderboard'} element={<SingleLeaderboardPage />} />
      <Route path={'/single/result'} element={<SinglePlayResultPage />} />
      <Route path={'/online'} element={<OnlinePlay />} />
      <Route path={'/online/room/:id'} element={<OnlinePlayRoom />} />
      <Route path={'*'} element={<Navigate to='/' replace />} />
    </Routes>
  );
}

export default App;
