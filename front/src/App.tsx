import React from 'react';
import {
  Routes, Route, Navigate
} from 'react-router-dom';

import OnlinePlay from '~/pages/OnlinePlay';
import OnlinePlayRoom from '~/pages/OnlinePlayRoom';

import IndexPage from './pages/Index';
import SingleLeaderboardPage from './pages/SingleLeaderboard';
import SinglePlayPage from './pages/SinglePlay';
import SinglePlayResultPage from './pages/SinglePlayResult';

function App() {
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
