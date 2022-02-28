import { atom } from 'recoil';

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
