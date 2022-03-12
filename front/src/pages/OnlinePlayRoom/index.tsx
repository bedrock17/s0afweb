import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { roomIDState, websocketState } from '~/atoms/websocket';
import Button from '~/components/Button';
import GameCanvas from '~/components/GameCanvas';
import type { Game } from '~/game';
import OnlinePlayLayout from '~/layout/OnlinePlayLayout';
import { createPopTileWebsocket, messageType } from '~/ws/websocket';

import {
  OpponentContainer, OpponentName, OpponentWrapper, Wrapper 
} from './styles';

const OnlinePlay = () => {
  const [websocket, setWebsocket] = useRecoilState(websocketState);
  const [roomID, setRoomID] = useRecoilState(roomIDState);
  const tempRef = useRef<Game>();
  const navigate = useNavigate();

  useEffect(() => {
    const roomNumberString = location.hash.replace('#', '');

    if (Number.isInteger(Number(roomNumberString)) === false) {
      navigate('/');
    }

    const roomNumber = Number(roomNumberString);

    setRoomID(roomNumber);

    if (roomID === 0) {
      const msg: WebsocketMessage<RoomId> = {
        type: messageType.joinRoom,
        data: roomNumber,
      };

      let curWebsocket = websocket;
      if (!curWebsocket) {
        const popTileWebsocket = createPopTileWebsocket();
        setWebsocket(popTileWebsocket);
        if (popTileWebsocket) {
          curWebsocket = popTileWebsocket;
        }
      }


      if (curWebsocket) {
        if (curWebsocket.ws) {
          curWebsocket.ws.onopen = (() => {
            curWebsocket?.ws?.send(JSON.stringify(msg));
          });
        }
      }

    }

  }, []);

  return (
    <OnlinePlayLayout>
      <Wrapper>
        <OpponentWrapper>
          <OpponentContainer>
            <OpponentName>LongUserName123456</OpponentName>
            <GameCanvas animationEffect={false} gameRef={tempRef} mini />
          </OpponentContainer>
          <GameCanvas animationEffect={false} gameRef={tempRef} mini />
          <GameCanvas animationEffect={false} gameRef={tempRef} mini />
          <GameCanvas animationEffect={false} gameRef={tempRef} mini />
          <GameCanvas animationEffect={false} gameRef={tempRef} mini />
          <GameCanvas animationEffect={false} gameRef={tempRef} mini />
          <GameCanvas animationEffect={false} gameRef={tempRef} mini />
        </OpponentWrapper>
        { 'username' }
        <span>Score : { '1234579' }</span>
        <GameCanvas animationEffect={false} gameRef={tempRef} />
        <Button color={'blue'} disabled>
        GameStart
        </Button>
      </Wrapper>
    </OnlinePlayLayout>
  );
};

export default OnlinePlay;
