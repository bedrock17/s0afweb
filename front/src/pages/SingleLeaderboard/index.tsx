import React from 'react';

import {
  Table, TableRow,
  Td,
  Th, Title, Wrapper,
} from './styles';

const SingleLeaderboardPage = () => {
  // TODO(blurfx): fetch leaderboard data from server

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
          <Td name>Dummy</Td>
          <Td>{ formatNumber(123433557) }</Td>
          <Td>{ formatNumber(2134) }</Td>
          <Td>{ formatNumber(parseFloat((123433557 / 2134).toFixed(1))) }</Td>
        </TableRow>
      </Table>
    </Wrapper>
  );
};

export default SingleLeaderboardPage;
