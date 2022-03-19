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
import { WSError } from '~/ws/errors';
import { getWebsocketInstance, messageType } from '~/ws/websocket';

import {
  OpponentContainer, Username, OpponentWrapper, Wrapper, Score, ScoreboardModal, ScoreTable, Dim
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
  const [score, setScore] = useState(0);
  const [room, setRoom] = useRecoilState(gameRoomState);
  const tempRef = useRef<Game>();
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameResult, setGameResult] = useState<[string, number][]>([]);
  const [showModal, setShowModal] = useState(false);

  const onCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const setOpponentScore = (index: number) => (value: number) => {
    opponentScores[index] = value;
    setOpponentScores([...opponentScores]);
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    if (!roomId) {
      navigate('/');
      return;
    }

    const msg: WebsocketSendMessage<RoomId> = {
      type: messageType.joinRoom,
      data: roomId,
    };
    const websocket = getWebsocketInstance();

    websocket.ws.onopen = (() => {
      websocket.ws.send(JSON.stringify(msg));
    });

    websocket.messageHandle[messageType.joinRoom] = (data) => {
      const response = data as WebsocketReceiveMessage<UserID>;
      if (response.error !== WSError.NoError) {
        switch (response.error) {
        case WSError.InvalidRoomIdError:
          alert('존재하지 않는 방입니다.');
          navigate('/online');
          return;
        }
      }
      const userId = response.data;
      if (userId === user?.user_id) {
        return;
      }
      setOpponentRefs((prev) => {
        return [...prev, {
          ref: { current: undefined },
          userId,
        }];
      });
      setOpponentScores((prev) => {
        return [...prev, 0];
      });
    };

    websocket.messageHandle[messageType.roomUsers] = (data) => {
      const response = data as WebsocketReceiveMessage<RoomUsersResponse>;
      const users = response.data.user_ids;
      const refs = users.filter((userId) => userId !== user.user_id)
        .map((userId) => ({
          ref: { current: undefined },
          userId,
        }));
      setOpponentRefs(refs);
      setOpponentScores(users.map(() => 0));
    };

    websocket.messageHandle[messageType.roomConfig] = (data) => {
      const response = data as WebsocketReceiveMessage<Room>;
      setRoom(response.data);
    };

    websocket.messageHandle[messageType.exitRoom] = (data) => {
      const response = data as WebsocketReceiveMessage<UserID>;
      const userId = response.data;
      if (userId === user?.user_id) {
        return;
      }
      const index = opponentRefs.findIndex((ref) => ref.userId === userId);
      setOpponentRefs((prev) => prev.filter((ref) => ref.userId !== userId));
      setOpponentScores([...opponentScores.slice(0, index), ...opponentScores.slice(index + 1)]);
    };

    websocket.messageHandle[messageType.startGame] = (startMessage) => {
      if (startMessage.error !== 0) {
        return;
      }

      const gameStartMessage = startMessage.data as GameStartResponse;

      setScore(0);
      setGameStarted(true);
      opponentRefs.forEach((opponent, index) => {
        if (!opponent.ref.current) {
          return;
        }
        setOpponentScore(index)(0);
        opponent.ref.current.startGame(gameStartMessage.seed);
        opponent.ref.current.onScoreChange = setOpponentScore(index);
      });

      tempRef.current?.startGame(gameStartMessage.seed);
      if (tempRef.current) {
        tempRef.current.onScoreChange = setScore;
        tempRef.current.touchCallback = (p: Point) => {
          const touchRequest: WebsocketSendMessage<Point> = {
            type: messageType.touch,
            data: {
              x: p.x,
              y: p.y,
            }
          };
          websocket.ws.send(JSON.stringify(touchRequest));
        };
      }
    };

    websocket.messageHandle[messageType.touch] = (touchMessage) => {
      const response = touchMessage.data as TileTouchEvent;
      opponentRefs.forEach((opponent) => {
        if (opponent.userId === response.user_id) {
          opponent.ref.current?.touch({ x: response.x, y: response.y });
        }
      });
    };

    websocket.messageHandle[messageType.finishGame] = (data) => {
      const response = data as WebsocketReceiveMessage<FinishGameResponse>;
      const sortedResult = Object.entries(response.data).sort(([,x],[,y]) => y - x);
      setGameResult(sortedResult);
      setShowModal(true);
      setGameStarted(false);
    };
  }, [user, opponentRefs]);

  useEffect(() => {
    return () => {
      const websocket = getWebsocketInstance();
      const payload: WebsocketSendMessage<RoomId> = {
        type: messageType.exitRoom,
        data: roomId,
      };
      websocket.ws.send(JSON.stringify(payload));
    };
  }, []);

  const sendGameStart = () => {
    const websocket = getWebsocketInstance();
    const startMessage: WebsocketSendMessage<RoomId> = {
      type: messageType.startGame,
      data: roomId,
    };
    websocket.ws.send(JSON.stringify(startMessage));
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
                  <Username opponent master={room?.master === opponent.userId}>{ opponent.userId }</Username>
                  <GameCanvas animationEffect={false} gameRef={opponent.ref} mini readonly />
                  <Score opponent>{ opponentScores[index] }</Score>
                </OpponentContainer>
              );
            })
          }
        </OpponentWrapper>
        <Username master={user && room?.master === user.user_id}>{ user?.user_id }</Username>
        <span>Score : { score }</span>
        <GameCanvas animationEffect={false} gameRef={tempRef} readonly={!gameStarted} />
        <Button color={'blue'} onClick={sendGameStart} disabled={!user || room?.master !== user.user_id}>
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
                  gameResult.map(([username, value]) => (
                    <tr key={username}>
                      <td>{ username }</td>
                      <td>{ value }</td>
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
