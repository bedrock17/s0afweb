import React, {
  useEffect, useRef, useState
} from 'react';
import { useNavigate } from 'react-router-dom';
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
  OpponentContainer, Username, OpponentWrapper, Wrapper
} from './styles';

type UserMappedGameRef = {
  ref: React.MutableRefObject<Game | undefined>,
  userId: UserID,
};

const getRoomId = (): number | undefined => {
  const roomNumberString = location.hash.replace('#', '');
  const roomNumber = Number(roomNumberString);

  if (!Number.isInteger(roomNumber)) {
    return undefined;
  }

  return roomNumber;
};

const OnlinePlayRoom = () => {
  const user = useRecoilValue(userState);
  const [opponentRefs, setOpponentRefs] = useState<UserMappedGameRef[]>([]);
  const [score, setScore] = useState(0);
  const [room, setRoom] = useRecoilState(gameRoomState);
  const tempRef = useRef<Game>();
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);

  const exitRoom = (roomId: RoomId) => {
    const websocket = getWebsocketInstance();
    const payload: WebsocketSendMessage<RoomId> = {
      type: messageType.exitRoom,
      data: roomId,
    };
    websocket.ws.send(JSON.stringify(payload));
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    const roomId = getRoomId();
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
      setOpponentRefs((prev) => [...prev, {
        ref: { current: undefined },
        userId,
      }]);
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
      setOpponentRefs((prev) => prev.filter((ref) => ref.userId !== userId));
    };

    websocket.messageHandle[messageType.startGame] = (touchMessage) => {
      const gameStartMessage = touchMessage.data as GameStartResponse;

      setGameStarted(true);
      opponentRefs.forEach((opponent) => {
        opponent.ref.current?.startGame(gameStartMessage.seed);
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
      const touch = touchMessage.data as Point;
      opponentRefs.forEach((opponent) => {
        opponent.ref.current?.touch(touch);
      });
    };

    websocket.messageHandle[messageType.finishGame] = () => {
      setGameStarted(false);
      alert('game finished');
    };
  }, [user, opponentRefs]);

  useEffect(() => {
    window?.addEventListener('hashchange', (e) => {
      const oldRoomId = Number(e.oldURL.split('#')[1]);
      const newRoomId = Number(e.newURL.split('#')[1]);

      if (Number.isInteger(oldRoomId)) {
        exitRoom(oldRoomId);
      }

      if (!Number.isInteger(newRoomId)) {
        navigate('/');
        return;
      }

      const payload: WebsocketSendMessage<RoomId> = {
        type: messageType.joinRoom,
        data: newRoomId,
      };
      const websocket = getWebsocketInstance();
      websocket.ws.send(JSON.stringify(payload));
    });

    return () => {
      const roomId = getRoomId();
      if (!roomId) {
        return;
      }
      exitRoom(roomId);
    };
  }, []);

  const sendGameStart = () => {
    const websocket = getWebsocketInstance();
    const roomId = getRoomId();

    if (roomId) {
      const startMessage: WebsocketSendMessage<RoomId> = {
        type: messageType.startGame,
        data: roomId,
      };
      websocket.ws.send(JSON.stringify(startMessage));
    }
  };

  return (
    <OnlinePlayLayout>
      <Wrapper>
        <OpponentWrapper>
          {
            opponentRefs.map((opponent) => (
              <OpponentContainer key={opponent.userId}>
                <Username opponent master={room?.master === opponent.userId}>{ opponent.userId }</Username>
                <GameCanvas animationEffect={false} gameRef={opponent.ref} mini readonly />
              </OpponentContainer>
            ))
          }
        </OpponentWrapper>
        <Username master={user && room?.master === user.user_id}>{ user?.user_id }</Username>
        <span>Score : { score }</span>
        <GameCanvas animationEffect={false} gameRef={tempRef} readonly={!gameStarted} />
        <Button color={'blue'} onClick={sendGameStart} disabled={!user || room?.master !== user.user_id}>
          Game Start
        </Button>
      </Wrapper>
    </OnlinePlayLayout>
  );
};

export default OnlinePlayRoom;
