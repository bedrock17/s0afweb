import React, { useEffect, useRef } from 'react';
import {
  Navigate, Route, Routes, useNavigate
} from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';

import { Leaderboard, Seed } from '~/api';
import {
  gameAnimationEffectState, gameScoreState, gameUsernameState
} from '~/atoms/game';
import { darkModeState } from '~/atoms/ui';
import GameCanvas from '~/components/GameCanvas';
import Switch from '~/components/Switch';
import type { Game } from '~/game';
import { useLocalStorage } from '~/hooks/useLocalStorage';
import SinglePlayLayout from '~/layout/SinglePlayLayout';

import { Wrapper } from './styles';

const SinglePlayPage = () => {
  const username = useRecoilValue(gameUsernameState);
  const gameRef = useRef<Game>();
  const [score, setScore] = useRecoilState(gameScoreState);
  const [animationEffect, setAnimationEffect] = useRecoilState(gameAnimationEffectState);
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);
  const [storedDarkMode, setStoredDarkMode] = useLocalStorage('darkMode', false);
  const [storedAnimationEffect, setStoredAnimationEffect] = useLocalStorage('animationEffect', true);
  const navigate = useNavigate();

  const onDarkModeChange = (value: boolean) => {
    setStoredDarkMode(value);
    setDarkMode(value);
  };

  const onAnimationEffectChange = (value: boolean) => {
    setStoredAnimationEffect(value);
    setAnimationEffect(value);
  };

  useEffect(() => {
    setAnimationEffect(storedAnimationEffect);
  }, [storedAnimationEffect, setAnimationEffect]);

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
      <Wrapper>
        { username }
        <span>Score : { score }</span>
        <Switch checked={animationEffect} onChange={onAnimationEffectChange}>
        애니메이션 효과
        </Switch>
        <Switch checked={darkMode} onChange={onDarkModeChange}>
        다크 모드
        </Switch>
        <GameCanvas gameRef={gameRef} animationEffect={animationEffect} single/>
      </Wrapper>
    </SinglePlayLayout>
  );
};

export default SinglePlayPage;
