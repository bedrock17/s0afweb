import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { websocketState } from '~/atoms/websocket';
import Button from '~/components/Button';
import { createPopTileWebsocket } from '~/ws/websocket';

import { Wrapper } from './styles';

const OnlinePlay = () => {
  const [websocket, setWebsocket] = useRecoilState(websocketState);

  useEffect(() => {

    const ws = createPopTileWebsocket();
    setWebsocket(ws);

  }, []);

  const onClickCreateRoom = () => {
    const message: WebsocketMessage<CreateRoom> = {
      type: 'create_room',
      data: {
        capacity: 10,
        game_time: 180,
      }
    };

    websocket?.send(JSON.stringify(message));

  };

  return (
    <Wrapper>
      <Button color={'blue'} onClick={onClickCreateRoom}>
        Create Room
      </Button>
    </Wrapper>
  );
};

export default OnlinePlay;
