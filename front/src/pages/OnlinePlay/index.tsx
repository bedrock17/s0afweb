import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { userState } from '~/atoms/auth';
import { gameRoomState } from '~/atoms/game';
import Button from '~/components/Button';
import OnlinePlayLayout from '~/layout/OnlinePlayLayout';
import { getWebsocketInstance, messageType } from '~/ws/websocket';

import { Wrapper } from './styles';

const OnlinePlay = () => {
  const navigate = useNavigate();
  const websocket = getWebsocketInstance();
  const setRoom = useSetRecoilState(gameRoomState);
  const user = useRecoilValue(userState);

  useEffect(() => {

    if (!user) {
      navigate('/');
      return;
    }

    websocket.messageHandle[messageType.createRoom] = (msg) => {
      const response = msg as WebsocketReceiveMessage<Room>;
      setRoom(response.data);
      navigate(`/online/room/${response.data.id}`);
    };
  }, []);

  const onClickCreateRoom = () => {
    const message: WebsocketSendMessage<CreateRoom> = {
      type: messageType.createRoom,
      data: {
        capacity: 10,
        play_time: 30,
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
