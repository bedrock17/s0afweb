import React, { useEffect, useRef } from 'react';
import {
  Navigate, Route, Routes, useNavigate
} from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';

import { Leaderboard, Seed } from '~/api';
import {
  gameAnimationEffectState, gameScoreState, gameUsernameState
} from '~/atoms/game';
import AppSettingsDrawer from '~/components/AppSettingsDrawer';
import GameCanvas from '~/components/GameCanvas';
import type { Game } from '~/game';
import SinglePlayLayout from '~/layout/SinglePlayLayout';

import {
  Hint, Hud, Label, PlayerBlock, PlayerName, Score, Wrapper
} from './styles';

const SinglePlayPage = () => {
  const username = useRecoilValue(gameUsernameState);
  const gameRef = useRef<Game>();
  const [score, setScore] = useRecoilState(gameScoreState);
  const animationEffect = useRecoilValue(gameAnimationEffectState);
  const navigate = useNavigate();

  useEffect(() => {
    const game = gameRef.current;
    setScore(0);

    if (!game) {
      return;
    }

    Seed.get().then((seed) => {
      game.startGame(seed);
    });

    game.onScoreChange = setScore;
    game.onStateChange = (isGameOver) => {
      if (isGameOver) {
        Leaderboard.post({
          username: username,
          score: game.score,
          touches: game.touchCount,
          touch_history: JSON.stringify(game.touchHistory),
          seed: game.seed,
        }).then(() => {
          navigate('/single/result');
        });
      }
    };
  }, [gameRef, navigate, setScore, username]);

  if (username.length === 0) {
    return <Routes>
      <Route path='/' element={<Navigate replace to='/'/>} />
    </Routes>;
  }

  return (
    <SinglePlayLayout>
      <AppSettingsDrawer />
      <Wrapper>
        <Hud>
          <PlayerBlock>
            <Label>PLAYER</Label>
            <PlayerName>{ username }</PlayerName>
          </PlayerBlock>
          <Score>{ score }</Score>
        </Hud>
        <Hint>연결된 타일을 찾아 터치하세요. 큰 묶음일수록 점수가 더 크게 올라갑니다.</Hint>
        <GameCanvas gameRef={gameRef} animationEffect={animationEffect} single/>
      </Wrapper>
    </SinglePlayLayout>
  );
};

export default SinglePlayPage;
