import { atom } from 'recoil';

type GameRoom = {
  id?: number;
  headcount?: number;
  capacity?: number;
  playTime?: number;
  masterId?: string;
  status?: number;
  gameStartedAt?: number | string;
};

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

export const gameRoomState = atom<GameRoom | undefined>({
  key: 'gameRoom',
  default: undefined,
});
