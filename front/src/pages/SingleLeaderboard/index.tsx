
import React, { useEffect, useState } from 'react';

import { Leaderboard, LeaderboardItem } from '~/api';

import {
  Table, TableRow,
  Td,
  Th, Title, Wrapper,
} from './styles';

type Leaderboard = {
  RankList: LeaderboardItem[],
};

const SingleLeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);

  useEffect(() => {
    Leaderboard.get()
      .then((res: LeaderboardItem[]) => {
        setLeaderboard(res);
      });
  }, [])


  const formatNumber = Intl.NumberFormat('ko-KR').format;

  return (
    <Wrapper>
      <Title>Single Play Leaderboard</Title>
      <Table>
        <TableRow>
          <Th>Name</Th>
          <Th>Score</Th>
          <Th>Touches</Th>
          <Th>Score per touch</Th>
        </TableRow>
        <>
          {
            leaderboard.map((item) => (
              <TableRow key={item.username}>
                <Td>{item.username}</Td>
                <Td>{formatNumber(item.score)}</Td>
                <Td>{formatNumber(item.touches)}</Td>
                <Td>{formatNumber(parseFloat((item.score / item.touches).toFixed(1)))}</Td>
              </TableRow>
            ))
          }
        </>
      </Table>
    </Wrapper>
  );
};

export default SingleLeaderboardPage;
