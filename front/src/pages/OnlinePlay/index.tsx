import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '~/components/Button';
import OnlinePlayLayout from '~/layout/OnlinePlayLayout';
import { getWebsocketInstance, messageType } from '~/ws/websocket';

import { Wrapper } from './styles';

const OnlinePlay = () => {
  const navigate = useNavigate();
  const websocket = getWebsocketInstance();

  useEffect(() => {
    websocket.messageHandle[messageType.createRoom] = (msg: WebsocketMessage<WebsocketMessageData>) => {
      const room = msg as WebsocketMessage<Room>;
      navigate('/online/room#' + room.data.id);
    };
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
