import React from 'react';
import {
  Route, Routes, Navigate, Link
} from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { gameScoreState, gameUsernameState } from '~/atoms/game';
import Button from '~/components/Button';
import SinglePlayLayout from '~/layout/SinglePlayLayout';

import { Wrapper } from './styles';

const SinglePlayResultPage = () => {
  const username = useRecoilValue(gameUsernameState);
  const score = useRecoilValue(gameScoreState);

  if (username.length === 0) {
    return <Routes>
      <Route path='/' element={<Navigate replace to='/'/>} />
    </Routes>;
  }

  return (
    <SinglePlayLayout>
      <Wrapper>
        <h1> { score }</h1>
        <Link to={'/single'}>
          <Button color={'blue'}>Retry</Button>
        </Link>
        <Link to={'/single/leaderboard'}>
          <Button color={'cyan'}>Leaderboard</Button>
        </Link>
      </Wrapper>
    </SinglePlayLayout>
  );
};

export default SinglePlayResultPage;
