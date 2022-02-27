import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './layout';
import IndexPage from './pages/Index';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path={'/'} element={<IndexPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
