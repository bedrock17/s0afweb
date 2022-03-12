import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { roomIDState, websocketState } from '~/atoms/websocket';
import Button from '~/components/Button';
import OnlinePlayLayout from '~/layout/OnlinePlayLayout';
import { createPopTileWebsocket, messageType } from '~/ws/websocket';

import { Wrapper } from './styles';

const OnlinePlay = () => {
  const [websocket, setWebsocket] = useRecoilState(websocketState);
  const setRoomID = useSetRecoilState(roomIDState);
  const navigate = useNavigate();

  useEffect(() => {

    const popTileWebsocket = createPopTileWebsocket();
    if (popTileWebsocket.messageHandle) {
      popTileWebsocket.messageHandle[messageType.createRoom] = (msg: WebsocketMessage<WebsocketMessageData>) => {
        const room = msg as WebsocketMessage<Room>;
        setRoomID(room.data.id);

        navigate('/online/room#' + room.data.id);
      };
    }
    setWebsocket(popTileWebsocket);

  }, []);

  const onClickCreateRoom = () => {
    const message: WebsocketMessage<CreateRoom> = {
      type: messageType.createRoom,
      data: {
        capacity: 10,
        play_time: 180,
      }
    };

    websocket?.ws?.send(JSON.stringify(message));

  };

  return (
    <OnlinePlayLayout>
      <Wrapper>
        <Button color={'blue'} onClick={onClickCreateRoom} disabled={websocket === null}>
        Create Room
        </Button>
      </Wrapper>
    </OnlinePlayLayout>
  );
};

export default OnlinePlay;
