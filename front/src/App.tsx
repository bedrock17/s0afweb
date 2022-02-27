import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './layout';
import IndexPage from './pages/Index';
import SinglePlayPage from './pages/SinglePlay';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path={'/'} element={<IndexPage />} />
        <Route path={'/single'} element={<SinglePlayPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
