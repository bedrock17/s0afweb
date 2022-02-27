import { atom } from 'recoil';

export const gameUsernameState = atom({
  key: 'gameUsername',
  default: '',
});

export const gameAnimationEffectState = atom({
  key: 'gameAnimationEffect',
  default: true,
});
