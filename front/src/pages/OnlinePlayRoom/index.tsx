import React, {
  useEffect, useRef, useState
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { userState } from '~/atoms/auth';
import Button from '~/components/Button';
import GameCanvas from '~/components/GameCanvas';
import type { Game, Point } from '~/game';
import OnlinePlayLayout from '~/layout/OnlinePlayLayout';
import {
  GameStartResponse, RoomId, WebsocketMessage 
} from '~/types/websocket';
import { getWebsocketInstance, messageType } from '~/ws/websocket';

import {
  OpponentContainer, OpponentName, OpponentWrapper, Wrapper
} from './styles';

type UserMappedCanvasRef = {
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
  const [opponentCanvasRefs, setOpponentCanvasRefs] = useState<UserMappedCanvasRef[]>([]);
  const tempRef = useRef<Game>();
  const navigate = useNavigate();

  const exitRoom = (roomId: RoomId) => {
    const websocket = getWebsocketInstance();
    const payload: WebsocketMessage<RoomId> = {
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

    const msg: WebsocketMessage<RoomId> = {
      type: messageType.joinRoom,
      data: roomId,
    };
    const websocket = getWebsocketInstance();

    websocket.ws.onopen = (() => {
      websocket.ws.send(JSON.stringify(msg));
    });

    websocket.messageHandle[messageType.joinRoom] = (data) => {
      const response = data as WebsocketMessage<UserID>;
      const userId = response.data;
      if (userId === user?.user_id) {
        return;
      }
      setOpponentCanvasRefs((prev) => [...prev, {
        ref: { current: undefined },
        userId,
      }]);
    };

    websocket.messageHandle[messageType.exitRoom] = (data) => {
      const response = data as WebsocketMessage<UserID>;
      const userId = response.data;
      if (userId === user?.user_id) {
        return;
      }
      setOpponentCanvasRefs((prev) => prev.filter((ref) => ref.userId !== userId));
    };

    websocket.messageHandle[messageType.startGame] = (touchMessage) => {
      const gameStartMessage = touchMessage.data as GameStartResponse;

      opponentCanvasRefs.forEach((opponent) => {
        opponent.ref.current?.startGame(gameStartMessage.seed);
      });

      tempRef.current?.startGame(gameStartMessage.seed);
      if (tempRef.current) {
        tempRef.current.touchCallback = (p: Point) => {
          const touchRequest: WebsocketMessage<Point> = {
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
      opponentCanvasRefs.forEach((opponent) => {
        opponent.ref.current?.touch(touch);
      });
    };

  }, [user, opponentCanvasRefs]);

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

      const payload: WebsocketMessage<RoomId> = {
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
      const startMessage: WebsocketMessage<RoomId> = {
        type: messageType.startGame,
        data: roomId
      };
      websocket.ws.send(JSON.stringify(startMessage));
    }
  };

  return (
    <OnlinePlayLayout>
      <Wrapper>
        <OpponentWrapper>
          {
            opponentCanvasRefs.map((opponent) => (
              <OpponentContainer key={opponent.userId}>
                <OpponentName>{ opponent.userId }</OpponentName>
                <GameCanvas animationEffect={false} gameRef={opponent.ref} mini />
              </OpponentContainer>
            ))
          }
        </OpponentWrapper>
        { user?.user_id }
        <span>Score : { '1234579' }</span>
        <GameCanvas animationEffect={false} gameRef={tempRef} />
        <Button color={'blue'} onClick={sendGameStart}>
        GameStart
        </Button>
      </Wrapper>
    </OnlinePlayLayout>
  );
};

export default OnlinePlayRoom;
