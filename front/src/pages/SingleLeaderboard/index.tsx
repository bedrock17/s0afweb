import React from 'react';

import {
  Table, TableRow,
  Td,
  Th, Title, Wrapper,
} from './styles';

const SingleLeaderboardPage = () => {
  // TODO(blurfx): fetch leaderboard data from server

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
          <Td>1234557</Td>
          <Td>2134</Td>
          <Td>{ (1234557 / 2134).toFixed(1)}</Td>
        </TableRow>
      </Table>
    </Wrapper>
  );
};

export default SingleLeaderboardPage;
