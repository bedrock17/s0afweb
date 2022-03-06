import type Stitches from '@stitches/react';
import React, {
  useCallback,
  useEffect, useMemo, useRef, useState,
} from 'react';

import { Leaderboard, LeaderboardItem } from '~/api';
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll';

import {
  Table, TableRow,
  Td,
  Th, Title, Wrapper,
} from './styles';

type NameColor = Stitches.VariantProps<typeof Td>['color'];

const grade: Array<[number, NameColor]> = [
  [200000, 'nutella'],
  [150000, 'red'],
  [100000, 'orange'],
  [80000, 'violet'],
  [60000, 'blue'],
  [40000, 'cyan'],
  [30000, 'green'],
  [-1, 'gray'],
];

const getColor = (score: number) => {
  for (const [threshold, color] of grade) {
    if (score > threshold) {
      return color;
    }
  }
};

const SingleLeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [page, setPage] = useState(1);
  const infiniteScrollRef = useRef(null);
  const itemPerPage = 50;
  const totalPages = useMemo(() => Math.ceil(leaderboard.length / itemPerPage), [leaderboard]);

  useInfiniteScroll(infiniteScrollRef, useCallback(() => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }, [page, setPage, totalPages]));

  console.log(page);

  useEffect(() => {
    Leaderboard.get()
      .then((res: LeaderboardItem[]) => {
        setLeaderboard(res);
      });
  }, []);

  const formatNumber = Intl.NumberFormat('ko-KR').format;

  return (
    <Wrapper>
      <Title>Single Play Leaderboard</Title>
      <Table>
        <tbody>
          <TableRow>
            <Th>Name</Th>
            <Th>Score</Th>
            <Th>Touches</Th>
            <Th>Score per touch</Th>
          </TableRow>
          <>
            {
              leaderboard.slice(0, itemPerPage * page).map((item, index) => (
                <TableRow key={item.username}>
                  <Td color={(index === 0 ? 'hyper' : getColor(item.score))} name>{item.username}</Td>
                  <Td>{formatNumber(item.score)}</Td>
                  <Td>{formatNumber(item.touches)}</Td>
                  <Td>{formatNumber(parseFloat((item.score / item.touches).toFixed(1)))}</Td>
                </TableRow>
              ))
            }
          </>
        </tbody>
      </Table>
      <div className={'infinite-scroll'} ref={infiniteScrollRef}/>
    </Wrapper>
  );
};

export default SingleLeaderboardPage;
