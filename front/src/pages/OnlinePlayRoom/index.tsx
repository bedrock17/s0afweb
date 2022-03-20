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
  const [gameResult, setGameResult] = useState<proto.UserScore[]>([]);
  const [showModal, setShowModal] = useState(false);

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
      proto.RequestType.join_room,
      proto.JoinRoomRequest.fromObject({
        room_id: roomId,
      })
    ).serializeBinary();
    const websocket = getWebsocketInstance();

    websocket.ws.onopen = (() => {
      websocket.ws.send(message);
    });

    websocket.messageHandle[proto.RequestType.join_room] = (response) => {
      const data = parseData<proto.JoinRoomResponse>(response);
      if (response.error !== WSError.NoError) {
        switch (response.error) {
        case WSError.InvalidRoomIdError:
          alert('존재하지 않는 방입니다.');
          navigate('/online');
          return;
        }
      }
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

    websocket.messageHandle[proto.RequestType.room_users] = (response) => {
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

    websocket.messageHandle[proto.RequestType.room_config] = (response) => {
      const data = parseData<proto.GetRoomConfigResponse>(response);
      setRoom(data.room);
    };

    websocket.messageHandle[proto.RequestType.exit_room] = (response) => {
      const data = parseData<proto.ExitRoomResponse>(response);
      const userId = data.user_id;
      if (userId === user?.user_id) {
        return;
      }
      const index = opponentRefs.findIndex((ref) => ref.userId === userId);
      setOpponentRefs((prev) => prev.filter((ref) => ref.userId !== userId));
      setOpponentScores([...opponentScores.slice(0, index), ...opponentScores.slice(index + 1)]);
    };

    websocket.messageHandle[proto.RequestType.start_game] = (response) => {
      if ((response.error ?? 0) !== 0) {
        return;
      }
      const data = parseData<proto.StartGameResponse>(response);

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
            proto.RequestType.touch,
            proto.TouchRequest.fromObject({
              x: p.x,
              y: p.y,
            })
          ).serializeBinary();

          websocket.ws.send(msg);
        };
      }
    };

    websocket.messageHandle[proto.RequestType.touch] = (response) => {
      const data = parseData<proto.TouchResponse>(response);
      opponentRefs.forEach((opponent) => {
        if (opponent.userId === data.user_id) {
          opponent.ref.current?.touch({ x: data.x ?? 0, y: data.y ?? 0 });
        }
      });
    };

    websocket.messageHandle[proto.RequestType.finish_game] = (response) => {
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
      const websocket = getWebsocketInstance();
      const msg = newProtoRequest(
        proto.RequestType.exit_room,
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
      proto.RequestType.start_game,
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
                  <Score opponent>{ opponentScores[index] }</Score>
                </OpponentContainer>
              );
            })
          }
        </OpponentWrapper>
        <Username master={user && room?.master_id === user.user_id}>{ user?.user_id }</Username>
        <span>Score : { score }</span>
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
