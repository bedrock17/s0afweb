import axios from 'axios';
import React, { useState } from 'react';

import {
  Table, TableRow,
  Td,
  Th, Title, Wrapper,
} from './styles';

type Item = {
  UserName: string,
  Score: number,
  TouchCount: number,
};

type Leaderboard = {
  RankList: Item[],
};

const SingleLeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<Item[]>([]);
  axios.get<Leaderboard>('/api/poptilerank')
    .then((res) => {
      setLeaderboard(res.data.RankList);
    });

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
        <TableRow>
          {
            leaderboard.map((item) => (
              <TableRow key={item.UserName}>
                <Td>{item.UserName}</Td>
                <Td>{formatNumber(item.Score)}</Td>
                <Td>{formatNumber(item.TouchCount)}</Td>
                <Td>{formatNumber(parseFloat((item.Score / item.TouchCount).toFixed(1)))}</Td>
              </TableRow>
            ))
          }
        </TableRow>
      </Table>
    </Wrapper>
  );
};

export default SingleLeaderboardPage;
