import { atom } from 'recoil';

export const userState = atom<UserProfile | undefined>({
  key: 'userState',
  default: undefined,
});
