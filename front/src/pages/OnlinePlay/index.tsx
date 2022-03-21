import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { userState } from '~/atoms/auth';
import { gameRoomState } from '~/atoms/game';
import Button from '~/components/Button';
import OnlinePlayLayout from '~/layout/OnlinePlayLayout';
import { proto } from '~/proto/message';
import { newProtoRequest, parseData } from '~/utils/proto';
import { getWebsocketInstance } from '~/ws/websocket';

import { Wrapper } from './styles';
import index from "~/pages/Index";

const OnlinePlay = () => {
  const navigate = useNavigate();
  const websocket = getWebsocketInstance();
  const setRoom = useSetRecoilState(gameRoomState);
  const user = useRecoilValue(userState);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {

    if (!user) {
      navigate('/');
      return;
    }


    websocket.messageHandle[proto.MessageType.get_rooms] = (response) => {
      const data = parseData<proto.GetRoomsResponse>(response);
      console.log(data);
      setRooms(data.rooms);
    };

    websocket.messageHandle[proto.MessageType.create_room] = (response) => {
      const data = parseData<proto.CreateRoomResponse>(response);

      setRoom(data.room);
      navigate(`/online/room/${data.room.id}`);
    };

    websocket.ws.onopen = () => {
      console.log('open ---- ');

      const message = newProtoRequest(
        proto.MessageType.get_rooms
      ).serializeBinary();

      console.log(message);

      websocket.ws.send(message);
    };

  }, []);

  const onClickCreateRoom = () => {
    const message = newProtoRequest(
      proto.MessageType.create_room,
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
        {
          rooms.map(value => {
            return <> { value.id } </>
          })
        }
        <Button color={'blue'} onClick={onClickCreateRoom} disabled={websocket === null}>
        Create Room
        </Button>
      </Wrapper>
    </OnlinePlayLayout>
  );
};

export default OnlinePlay;
