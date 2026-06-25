import type Stitches from '@stitches/react';
import React, {
  useCallback,
  useEffect, useMemo, useRef, useState,
} from 'react';
import { Link } from 'react-router-dom';

import { Leaderboard, LeaderboardItem } from '~/api';
import AppSettingsDrawer from '~/components/AppSettingsDrawer';
import Button from '~/components/Button';
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll';
import SinglePlayLayout from '~/layout/SinglePlayLayout';

import {
  ActionRow,
  Header,
  RankBadge,
  StateBox,
  Summary,
  Table,
  TableRow,
  TableWrap,
  Td,
  Th,
  Title,
  Wrapper,
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

const getEfficiency = (score: number, touches: number) => {
  if (touches <= 0) {
    return 0;
  }

  return parseFloat((score / touches).toFixed(1));
};

const SingleLeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const infiniteScrollRef = useRef(null);
  const itemPerPage = 50;
  const totalPages = useMemo(() => Math.ceil(leaderboard.length / itemPerPage), [leaderboard]);

  useInfiniteScroll(infiniteScrollRef, useCallback(() => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }, [page, setPage, totalPages]));

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);

    Leaderboard.get()
      .then((res: LeaderboardItem[]) => {
        setLeaderboard(res);
      })
      .catch(() => {
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const formatNumber = Intl.NumberFormat('ko-KR').format;

  return (
    <SinglePlayLayout>
      <AppSettingsDrawer />
      <Wrapper>
        <Header>
          <ActionRow>
            <Link to={'/single'}>
              <Button color={'blue'} >다시 하기</Button>
            </Link>
            <Link to={'/'}>
              <Button color={'cyan'}>홈</Button>
            </Link>
          </ActionRow>
          <Title>싱글 플레이 순위표</Title>
          <Summary>높은 점수와 적은 터치가 좋은 기록을 만듭니다.</Summary>
        </Header>

        {isLoading && <StateBox>순위표를 불러오는 중입니다.</StateBox>}
        {hasError && <StateBox>순위표를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</StateBox>}
        {!isLoading && !hasError && leaderboard.length === 0 && (
          <StateBox>아직 기록이 없습니다. 첫 기록을 남겨보세요.</StateBox>
        )}
        {!isLoading && !hasError && leaderboard.length > 0 && (
          <TableWrap>
            <Table>
              <tbody>
                <TableRow>
                  <Th>순위</Th>
                  <Th>이름</Th>
                  <Th>점수</Th>
                  <Th>터치</Th>
                  <Th>효율</Th>
                </TableRow>
                {leaderboard.slice(0, itemPerPage * page).map((item, index) => (
                  <TableRow key={`${item.username}-${index}`}>
                    <Td>
                      <RankBadge highlight={index < 3}>{index + 1}</RankBadge>
                    </Td>
                    <Td color={(index === 0 ? 'hyper' : getColor(item.score))} name>{item.username}</Td>
                    <Td>{formatNumber(item.score)}</Td>
                    <Td>{formatNumber(item.touches)}</Td>
                    <Td>{formatNumber(getEfficiency(item.score, item.touches))}</Td>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableWrap>
        )}
        <div className={'infinite-scroll'} ref={infiniteScrollRef}/>
      </Wrapper>
    </SinglePlayLayout>
  );
};

export default SingleLeaderboardPage;
