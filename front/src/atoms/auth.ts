import { atom } from 'recoil';

type UserState = undefined | unknown;

export const userState = atom<UserState>({
  key: 'userState',
  default: undefined,
});
