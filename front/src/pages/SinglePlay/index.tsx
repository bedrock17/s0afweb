import React, { useEffect, useRef } from 'react';
import {
  Navigate, Route, Routes, useNavigate
} from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';

import { Leaderboard } from '~/api';
import {
  gameAnimationEffectState, gameScoreState, gameUsernameState
} from '~/atoms/game';
import GameCanvas from '~/components/GameCanvas';
import Switch from '~/components/Switch';
import type { Game } from '~/game';

import { Wrapper } from './styles';

const SinglePlayPage = () => {
  const username = useRecoilValue(gameUsernameState);
  const gameRef = useRef<Game>();
  const [score, setScore] = useRecoilState(gameScoreState);
  const [animationEffect, setAnimationEffect] = useRecoilState(gameAnimationEffectState);
  const navigate = useNavigate();

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
        navigate('/single/result');
      });
    };
  }, [gameRef, setScore, username]);

  if (username.length === 0) {
    return <Routes>
      <Route path='/' element={<Navigate replace to='/'/>} />
    </Routes>;
  }

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

export default SinglePlayPage;
