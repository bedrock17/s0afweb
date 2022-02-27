import { Route, Routes } from 'solid-app-router';
import type { Component } from 'solid-js';
import { lazy } from 'solid-js';
import { styled, ThemeProvider } from 'solid-styled-components';

import { lightTheme } from '../theme';


const IndexPage = lazy(() => import('./pages/index'));

const App: Component = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <Routes>
        <Route path={'/'} element={<IndexPage />} />
        <Route path={'/play'} element={null} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
