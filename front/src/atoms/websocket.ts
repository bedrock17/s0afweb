import { atom } from 'recoil';

import { PopTileWebsocket } from '~/ws/websocket';

export const websocketState = atom<PopTileWebsocket|null>({
  key: 'websocket',
  default: null,
});

export const roomIDState = atom({
  key: 'websocket',
  default: 0,
});
