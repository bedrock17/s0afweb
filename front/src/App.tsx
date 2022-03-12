import React from 'react';
import { Routes, Route } from 'react-router-dom';

import OnlinePlay from '~/pages/OnlinePlay';
import OnlinePlayRoom from '~/pages/OnlinePlayRoom';

import Layout from './layout';
import IndexPage from './pages/Index';
import SingleLeaderboardPage from './pages/SingleLeaderboard';
import SinglePlayPage from './pages/SinglePlay';
import SinglePlayResultPage from './pages/SinglePlayResult';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path={'/'} element={<IndexPage />} />
        <Route path={'/single/leaderboard'} element={<SingleLeaderboardPage />} />
        <Route path={'/single/result'} element={<SinglePlayResultPage />} />
        <Route path={'/single/*'} element={<SinglePlayPage />} />
        <Route path={'/online/*'} element={<OnlinePlay />} />
        <Route path={'/online/room'} element={<OnlinePlayRoom />} />
      </Routes>
    </Layout>
  );
}

export default App;
