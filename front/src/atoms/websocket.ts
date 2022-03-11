import { atom } from 'recoil';

export const websocketState = atom<WebSocket|null>({
  key: 'websocket',
  default: null,
});
