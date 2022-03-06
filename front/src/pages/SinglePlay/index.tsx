import React, { useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { Leaderboard } from '~/api';
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
    game.gameOverCallback = () => {
      Leaderboard.post({
        username: username,
        score: game.score,
        touches: game.touchCount,
        touch_history: JSON.stringify(game.touchHistory),
        seed: game.seed,
      }).then(() => {
        // TODO: 업로드후 현재 본인의 등수와 앞선 사람 정보 보여줄 것
      });
    };
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
