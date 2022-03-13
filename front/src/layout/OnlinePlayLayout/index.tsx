import React, { useLayoutEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import { Auth } from '~/api';
import { userState } from '~/atoms/auth';

import { Container } from './styles';


const OnlinePlayLayout: React.FC = ({ children }) => {
  const setUser = useSetRecoilState(userState);

  useLayoutEffect(() => {
    Auth.profile.get().then(setUser).catch(() => setUser(undefined));
  }, [setUser]);

  return (
    <Container>
      { children }
    </Container>
  );
};

export default OnlinePlayLayout;
