import { Route, Routes } from 'solid-app-router';
import type { Component } from 'solid-js';

const App: Component = () => {
  return (
    <Routes>
      <Route path={"/"} element={null} />
      <Route path={"/play"} element={null} />
    </Routes>
  );
};

export default App;
