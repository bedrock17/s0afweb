import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { gameAnimationEffectState, gameUsernameState } from '~/atoms/game';
import GameCanvas from '~/components/GameCanvas';
import Switch from '~/components/Switch';

import { Wrapper } from './styles';

const IndexPage = () => {
  const username = useRecoilValue(gameUsernameState);
  const [animationEffect, setAnimationEffect] = useRecoilState(gameAnimationEffectState);

  return (
    <Wrapper>
      { username }
      <Switch checked={animationEffect} onChange={setAnimationEffect}>
        애니메이션 효과
      </Switch>
      <GameCanvas animationEffect={animationEffect} />
    </Wrapper>
  );
};

export default IndexPage;
