import { Route, Routes } from 'solid-app-router';
import type { Component } from 'solid-js';
import { lazy } from 'solid-js';

const IndexPage = lazy(() => import('./pages/index'));

const App: Component = () => {
  return (
    <Routes>
      <Route path={'/'} element={<IndexPage />} />
      <Route path={'/play'} element={null} />
    </Routes>
  );
};

export default App;
