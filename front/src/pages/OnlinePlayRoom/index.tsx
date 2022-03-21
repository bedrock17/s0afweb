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
import { proto } from '~/proto/message';
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
  const [gameResult, setGameResult] = useState<proto.UserScore[]>([]);
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

    const message = newProtoRequest(
      proto.MessageType.join_room,
      proto.JoinRoomRequest.fromObject({
        room_id: roomId,
      })
    ).serializeBinary();
    const websocket = getWebsocketInstance();

    websocket.ws.onopen = (() => {
      websocket.ws.send(message);
    });

    websocket.messageHandle[proto.MessageType.join_room] = (response) => {
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

      const data = parseData<proto.JoinRoomResponse>(response);
      if (data.user_id === user?.user_id) {
        return;
      }
      setOpponentRefs((prev) => {
        return [...prev, {
          ref: { current: undefined },
          userId: data.user_id,
        }];
      });
      setOpponentScores((prev) => {
        return [...prev, 0];
      });
    };

    websocket.messageHandle[proto.MessageType.room_users] = (response) => {
      const data = parseData<proto.GetRoomUsersResponse>(response);
      const users = data.user_ids;
      const refs = users.filter((userId) => userId !== user?.user_id)
        .map((userId) => ({
          ref: { current: undefined },
          userId,
        }));
      setOpponentRefs(refs);
      setOpponentScores(users.map(() => 0));
    };

    websocket.messageHandle[proto.MessageType.room_config] = (response) => {
      const data = parseData<proto.GetRoomConfigResponse>(response);
      setRoom(data.room);
    };

    websocket.messageHandle[proto.MessageType.exit_room] = (response) => {
      const data = parseData<proto.ExitRoomResponse>(response);
      const userId = data.user_id;
      if (userId === user?.user_id) {
        return;
      }
      const index = opponentRefs.findIndex((ref) => ref.userId === userId);
      setOpponentRefs((prev) => prev.filter((ref) => ref.userId !== userId));
      setOpponentScores([...opponentScores.slice(0, index), ...opponentScores.slice(index + 1)]);
    };

    websocket.messageHandle[proto.MessageType.start_game] = (response) => {
      if ((response.error ?? 0) !== 0) {
        return;
      }
      const data = parseData<proto.StartGameResponse>(response);
      timerInterval.current = setInterval(() => {
        setTime((prev) => Math.max(0, prev - 1));
      }, 1000);

      setTime(room!.play_time);
      setScore(0);
      setGameStarted(true);
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
            proto.MessageType.touch,
            proto.TouchRequest.fromObject({
              x: p.x,
              y: p.y,
            })
          ).serializeBinary();

          websocket.ws.send(msg);
        };
      }
    };

    websocket.messageHandle[proto.MessageType.touch] = (response) => {
      const data = parseData<proto.TouchResponse>(response);
      opponentRefs.forEach((opponent) => {
        if (opponent.userId === data.user_id) {
          opponent.ref.current?.touch({ x: data.x ?? 0, y: data.y ?? 0 });
        }
      });
    };

    websocket.messageHandle[proto.MessageType.finish_game] = (response) => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
      const data = parseData<proto.FinishGameResponse>(response);
      const sortedResult = data.user_scores
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
      setGameResult(sortedResult);
      setShowModal(true);
      setGameStarted(false);
    };
  }, [user, opponentRefs]);

  useEffect(() => {
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
      const websocket = getWebsocketInstance();
      const msg = newProtoRequest(
        proto.MessageType.exit_room,
        proto.ExitRoomRequest.fromObject({
          room_id: roomId,
        })
      ).serializeBinary();
      websocket.ws.send(msg);
    };
  }, []);

  const sendGameStart = () => {
    const websocket = getWebsocketInstance();
    const message = newProtoRequest(
      proto.MessageType.start_game,
      proto.StartGameRequest.fromObject({
        room_id: roomId,
      })
    ).serializeBinary();
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
                  <Username opponent master={room?.master_id === opponent.userId}>{ opponent.userId }</Username>
                  <GameCanvas animationEffect={false} gameRef={opponent.ref} mini readonly />
                  <GameInfo opponent>{ opponentScores[index] }</GameInfo>
                </OpponentContainer>
              );
            })
          }
        </OpponentWrapper>
        <Username master={user && room?.master_id === user.user_id}>{ user?.user_id }</Username>
        <GameInfoWrapper>
          <GameInfo>Time : { time }</GameInfo>
          <GameInfo>Score : { score }</GameInfo>
        </GameInfoWrapper>
        <GameCanvas animationEffect={false} gameRef={tempRef} readonly={!gameStarted} />
        <Button color={'blue'} onClick={sendGameStart} disabled={!user || room?.master_id !== user.user_id}>
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
                  gameResult.map(({ user_id, score: user_score }) => (
                    <tr key={user_id}>
                      <td>{ user_id }</td>
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
