// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/no-nodejs-modules
import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const backendPort = process.env.BACKEND_PORT || '8080';
const backendHttpTarget = `http://localhost:${backendPort}`;
const backendWsTarget = `ws://localhost:${backendPort}/v1/ws`;

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'es2018',
    polyfillModulePreload: true,
  },
  server: {
    proxy: {
      '/api': {
        target: backendHttpTarget,
        changeOrigin: true,
        rewrite: p => p.replace(/^\/api/, ''),
      },
      '/ws': {
        target: backendWsTarget,
        ws: true,
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src')
    }
  },
});
