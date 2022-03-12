import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { roomIDState, websocketState } from '~/atoms/websocket';
import Button from '~/components/Button';
import {createPopTileWebsocket, messageType} from '~/ws/websocket';

import { Wrapper } from './styles';

const OnlinePlay = () => {
  const [websocket, setWebsocket] = useRecoilState(websocketState);
  const [roomID, setRoomID] = useRecoilState(roomIDState);
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
    <Wrapper>
      <Button color={'blue'} disabled>
        GameStart
      </Button>
    </Wrapper>
  );
};

export default OnlinePlay;
