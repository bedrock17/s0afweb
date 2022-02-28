import React, { useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import {
  gameAnimationEffectState, gameScoreState, gameUsernameState
} from '~/atoms/game';
import GameCanvas from '~/components/GameCanvas';
import Switch from '~/components/Switch';
import type { Game } from '~/game';

import { Wrapper } from './styles';

const IndexPage = () => {
  const username = useRecoilValue(gameUsernameState);
  const gameRef = useRef<Game>();
  const [score, setScore] = useRecoilState(gameScoreState);
  const [animationEffect, setAnimationEffect] = useRecoilState(gameAnimationEffectState);

  useEffect(() => {
    const game = gameRef.current;
    if (!game) {
      return;
    }

    game.onScoreChange = setScore;
  }, [gameRef, setScore]);

  return (
    <Wrapper>
      { username }
      <span>Score : { score }</span>
      <Switch checked={animationEffect} onChange={setAnimationEffect}>
        애니메이션 효과
      </Switch>
      <GameCanvas gameRef={gameRef} animationEffect={animationEffect} />
    </Wrapper>
  );
};

export default IndexPage;
