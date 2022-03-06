import React from 'react';
import { Routes, Route } from 'react-router-dom';


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
        <Route path={'/single'} element={<SinglePlayPage />} />
        <Route path={'/single/leaderboard'} element={<SingleLeaderboardPage />} />
        <Route path={'/single/result'} element={<SinglePlayResultPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
