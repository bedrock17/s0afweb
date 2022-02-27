import { Route, Routes } from 'solid-app-router';
import type { Component } from 'solid-js';
import { lazy } from 'solid-js';
import { ThemeProvider } from 'solid-styled-components';

import { lightTheme } from '../theme';
import Layout from '~/layout';


const IndexPage = lazy(() => import('./pages/index'));

const App: Component = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <Layout>
        <Routes>
          <Route path={'/'} element={<IndexPage />} />
          <Route path={'/play'} element={null} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
};

export default App;
