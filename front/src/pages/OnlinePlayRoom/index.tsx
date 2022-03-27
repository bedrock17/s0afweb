import React, {
  useCallback,
  useEffect, useRef, useState
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';

import { userState } from '~/atoms/auth';
import { gameRoomState } from '~/atoms/game';
import Button from '~/components/Button';
import GameCanvas from '~/components/GameCanvas';
import type { Game } from '~/game';
import OnlinePlayLayout from '~/layout/OnlinePlayLayout';
import type {
  UserScore, JoinRoomResponse, GetRoomUsersResponse, GetRoomConfigResponse, ExitRoomResponse, StartGameResponse,
  TouchResponse, FinishGameResponse, AttackResponse
} from '~/proto/messages/proto';
import * as ExitRoomRequest from '~/proto/messages/proto/ExitRoomRequest';
import * as JoinRoomRequest from '~/proto/messages/proto/JoinRoomRequest';
import * as StartGameRequest from '~/proto/messages/proto/StartGameRequest';
import * as TouchRequest from '~/proto/messages/proto/TouchRequest';
import { newProtoRequest, parseData } from '~/utils/proto';
import { WSError } from '~/ws/errors';
import { getWebsocketInstance } from '~/ws/websocket';

import {
  OpponentContainer, Username, OpponentWrapper, Wrapper, GameInfo, ScoreboardModal, ScoreTable, Dim, GameInfoWrapper
} from './styles';

type UserMappedGameRef = {
  ref: React.MutableRefObject<Game | undefined>,
  userId: UserID,
};

const OnlinePlayRoom = () => {
  const params = useParams();
  const roomId = Number(params.id);
  const user = useRecoilValue(userState);
  const [opponentRefs, setOpponentRefs] = useState<UserMappedGameRef[]>([]);
  const [opponentScores, setOpponentScores] = useState<number[]>([]);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  const [room, setRoom] = useRecoilState(gameRoomState);
  const tempRef = useRef<Game>();
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameResult, setGameResult] = useState<UserScore[]>([]);
  const [showModal, setShowModal] = useState(false);
  const timerInterval = useRef<NodeJS.Timeout>();

  const onCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const setOpponentScore = (index: number) => (value: number) => {
    opponentScores[index] = value;
    setOpponentScores([...opponentScores]);
  };

  useEffect(() => {
    if (!roomId) {
      navigate('/');
      return;
    }

    const websocket = getWebsocketInstance();

    websocket.messageHandle['join_room'] = (response) => {
      if (response.error !== undefined && response.error !== WSError.NoError) {
        switch (response.error) {
        case WSError.InvalidRoomIdError:
          alert('존재하지 않는 방입니다.');
          navigate('/online');
          return;
        default:
          alert(`알 수 없는 오류가 발생했습니다. (${response.error})`);
          navigate('/online');
          return;
        }
      }

      const data = parseData<JoinRoomResponse>(response);
      if (data.userId === user?.user_id) {
        return;
      }
      setOpponentRefs((prev) => {
        return [...prev, {
          ref: { current: undefined },
          userId: data.userId,
        }];
      });
      setOpponentScores((prev) => {
        return [...prev, 0];
      });
    };

    websocket.messageHandle['room_users'] = (response) => {
      const data = parseData<GetRoomUsersResponse>(response);
      const users = data.userIds as string[];
      const refs = users.filter((userId) => userId !== user?.user_id)
        .map((userId) => ({
          ref: { current: undefined },
          userId,
        }));
      setOpponentRefs(refs);
      setOpponentScores(users.map(() => 0));
    };

    websocket.messageHandle['room_config'] = (response) => {
      const data = parseData<GetRoomConfigResponse>(response);
      setRoom(data.room);
    };

    websocket.messageHandle['exit_room'] = (response) => {
      const data = parseData<ExitRoomResponse>(response);
      const { userId } = data;
      if (userId === user?.user_id) {
        return;
      }
      const index = opponentRefs.findIndex((ref) => ref.userId === userId);
      setOpponentRefs((prev) => prev.filter((ref) => ref.userId !== userId));
      setOpponentScores([...opponentScores.slice(0, index), ...opponentScores.slice(index + 1)]);
    };

    websocket.messageHandle['start_game'] = (response) => {
      if ((response.error ?? 0) !== 0) {
        return;
      }
      const data = parseData<StartGameResponse>(response);
      timerInterval.current = setInterval(() => {
        setTime((prev) => Math.max(0, prev - 1));
      }, 1000);

      setTime(room!.playTime);
      setScore(0);
      setGameStarted(true);
      setShowModal(false);
      const seed = data.seed ?? 0;
      opponentRefs.forEach((opponent, index) => {
        if (!opponent.ref.current) {
          return;
        }
        setOpponentScore(index)(0);
        opponent.ref.current.startGame(seed);
        opponent.ref.current.onScoreChange = setOpponentScore(index);
      });

      tempRef.current?.startGame(seed);
      if (tempRef.current) {
        tempRef.current.onScoreChange = setScore;
        tempRef.current.touchCallback = (p: Point) => {
          const msg = newProtoRequest(
            'touch',
            TouchRequest.encodeBinary({
              x: p.x,
              y: p.y,
            })
          );

          websocket.ws.send(msg);
        };
      }
    };

    websocket.messageHandle['touch'] = (response) => {
      const data = parseData<TouchResponse>(response);
      opponentRefs.forEach((opponent) => {
        if (opponent.userId === data.userId) {
          opponent.ref.current?.touch({ x: data.x ?? 0, y: data.y ?? 0 });
        }
      });

      if (user) {
        if (user.user_id === data.user_id) {
          tempRef.current?.touch({x: data.x ?? 0, y: data.y ?? 0});
        }
      }

    };

    websocket.messageHandle['finish_game'] = (response) => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
      const data = parseData<FinishGameResponse>(response);
      const sortedResult = data.userScores
        .sort((a: UserScore, b: UserScore) => (b.score ?? 0) - (a.score ?? 0));
      setGameResult(sortedResult);
      setShowModal(true);
      setGameStarted(false);
    };

    websocket.messageHandle['attack'] = (response) => {
      const data = parseData<AttackResponse>(response);
      opponentRefs.forEach((opponent) => {
        if (opponent.userId === data.userId) {
          for (let i = 0; i < data.lines; i++) {
            opponent.ref.current?.newBlocks();
          }
        }
      });

      if (user?.user_id === data.userId) {
        for (let i = 0; i < data.lines; i++) {
          tempRef.current?.newBlocks();
        }
      }

    };

  }, [user, opponentRefs]);

  useEffect(() => {
    const websocket = getWebsocketInstance();
    const message = newProtoRequest(
      'join_room',
      JoinRoomRequest.encodeBinary({
        roomId,
      })
    );
    if (!room || !user || (room.masterId !== user.user_id)) {
      websocket.send(message);
    }

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }

      const msg = newProtoRequest(
        'exit_room',
        ExitRoomRequest.encodeBinary({
          roomId: roomId,
        })
      );

      websocket.ws.send(msg);
    };
  }, []);

  const sendGameStart = () => {
    const websocket = getWebsocketInstance();
    const message = newProtoRequest(
      'start_game',
      StartGameRequest.encodeBinary({
        roomId: roomId,
      })
    );
    websocket.ws.send(message);
  };

  if (!Number.isInteger(roomId)) {
    navigate('/');
    return null;
  }

  return (
    <OnlinePlayLayout>
      <Wrapper>
        <OpponentWrapper>
          {
            opponentRefs.map((opponent, index) => {
              return (
                <OpponentContainer key={opponent.userId}>
                  <Username opponent master={room?.masterId === opponent.userId}>{ opponent.userId }</Username>
                  <GameCanvas animationEffect={false} gameRef={opponent.ref} mini readonly />
                  <GameInfo opponent>{ opponentScores[index] }</GameInfo>
                </OpponentContainer>
              );
            })
          }
        </OpponentWrapper>
        <Username master={user && room?.masterId === user.user_id}>{ user?.user_id }</Username>
        <GameInfoWrapper>
          <GameInfo>Time : { time }</GameInfo>
          <GameInfo>Score : { score }</GameInfo>
        </GameInfoWrapper>
        <GameCanvas animationEffect={false} gameRef={tempRef} readonly={!gameStarted} />
        <Button color={'blue'} onClick={sendGameStart} disabled={!user || room?.masterId !== user.user_id}>
          Game Start
        </Button>
      </Wrapper>
      { showModal && (
        <>
          <Dim />
          <ScoreboardModal>
            <ScoreTable>
              <thead>
                <tr>
                  <th>이름</th>
                  <th>점수</th>
                </tr>
              </thead>
              <tbody>
                {
                  gameResult.map(({ userId, score: user_score }) => (
                    <tr key={userId}>
                      <td>{ userId }</td>
                      <td>{ user_score ?? 0 }</td>
                    </tr>
                  ))
                }
              </tbody>
            </ScoreTable>
            <Button color={'blue'} onClick={onCloseModal}>닫기</Button>
          </ScoreboardModal>
        </>
      )}
    </OnlinePlayLayout>
  );
};

export default OnlinePlayRoom;
