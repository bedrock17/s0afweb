import { atom } from 'recoil';

import type { Room } from '~/proto/messages/proto';


export const gameUsernameState = atom({
  key: 'gameUsername',
  default: '',
});

export const gameScoreState = atom({
  key: 'gameScore',
  default: 0,
});

export const gameAnimationEffectState = atom({
  key: 'gameAnimationEffect',
  default: true,
});

export const gameRoomState = atom<Room | undefined>({
  key: 'gameRoom',
  default: undefined,
});
