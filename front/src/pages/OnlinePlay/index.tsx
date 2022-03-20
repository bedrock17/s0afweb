import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { userState } from '~/atoms/auth';
import { gameRoomState } from '~/atoms/game';
import Button from '~/components/Button';
import OnlinePlayLayout from '~/layout/OnlinePlayLayout';
import { proto } from '~/proto/message';
import { newProtoRequest, responseType } from '~/utils/proto';
import { getWebsocketInstance } from '~/ws/websocket';

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

    websocket.messageHandle[proto.RequestType.create_room] = (response) => {
      const data = responseType[response.type].deserializeBinary(response.data!.value).toObject() as proto.CreateRoomResponse;
      setRoom(data.room);
      navigate(`/online/room/${data.room.id}`);
    };
  }, []);

  const onClickCreateRoom = () => {
    const message = newProtoRequest(
      proto.RequestType.create_room,
      proto.CreateRoomRequest.fromObject({
        capacity: 10,
        play_time: 30,
      })
    ).serializeBinary();

    websocket?.ws?.send(message);
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
