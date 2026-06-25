import React from 'react';
import {
  Route, Routes, Navigate, Link
} from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { gameScoreState, gameUsernameState } from '~/atoms/game';
import AppSettingsDrawer from '~/components/AppSettingsDrawer';
import Button from '~/components/Button';
import SinglePlayLayout from '~/layout/SinglePlayLayout';

import {
  ActionStack, Badge, Message, ResultCard, ScoreText, Wrapper
} from './styles';

const getResultCopy = (score: number) => {
  if (score >= 100000) {
    return {
      badge: 'MASTER RUN',
      message: '대단해요. 큰 묶음을 빠르게 찾아낸 플레이였습니다.',
    };
  }

  if (score >= 40000) {
    return {
      badge: 'GREAT RUN',
      message: '좋은 흐름이에요. 한 번 더 하면 최고 기록을 노려볼 만합니다.',
    };
  }

  return {
    badge: 'NICE TRY',
    message: '타일 묶음을 크게 만들수록 점수가 더 크게 올라갑니다.',
  };
};

const SinglePlayResultPage = () => {
  const username = useRecoilValue(gameUsernameState);
  const score = useRecoilValue(gameScoreState);
  const result = getResultCopy(score);

  if (username.length === 0) {
    return <Routes>
      <Route path='/' element={<Navigate replace to='/'/>} />
    </Routes>;
  }

  return (
    <SinglePlayLayout>
      <AppSettingsDrawer />
      <Wrapper>
        <ResultCard>
          <Badge>{result.badge}</Badge>
          <ScoreText>{score.toLocaleString('ko-KR')}</ScoreText>
          <Message>{result.message}</Message>
        </ResultCard>
        <ActionStack>
          <Link to={'/single'}>
            <Button color={'blue'}>다시 하기</Button>
          </Link>
          <Link to={'/single/leaderboard'}>
            <Button color={'cyan'}>순위표 보기</Button>
          </Link>
          <Link to={'/'}>
            <Button color={'orange'}>홈으로</Button>
          </Link>
        </ActionStack>
      </Wrapper>
    </SinglePlayLayout>
  );
};

export default SinglePlayResultPage;
