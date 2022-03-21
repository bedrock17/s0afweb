import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { userState } from '~/atoms/auth';
import { gameRoomState } from '~/atoms/game';
import Button from '~/components/Button';
import OnlinePlayLayout from '~/layout/OnlinePlayLayout';
import { proto } from '~/proto/message';
import { newProtoRequest, parseData } from '~/utils/proto';
import { getWebsocketInstance } from '~/ws/websocket';

import { Wrapper } from './styles';

const OnlinePlay = () => {
  const navigate = useNavigate();
  const websocket = getWebsocketInstance();
  const setRoom = useSetRecoilState(gameRoomState);
  const user = useRecoilValue(userState);
  const [rooms, setRooms] = useState<proto.Room[]>([]);

  useEffect(() => {

    if (!user) {
      navigate('/');
      return;
    }

    websocket.messageHandle[proto.MessageType.get_rooms] = (response) => {
      const data = parseData<proto.GetRoomsResponse>(response);
      setRooms(data.rooms);
    };

    websocket.messageHandle[proto.MessageType.create_room] = (response) => {
      const data = parseData<proto.CreateRoomResponse>(response);

      setRoom(data.room);
      navigate(`/online/room/${data.room.id}`);
    };

    const message = newProtoRequest(
      proto.MessageType.get_rooms
    ).serializeBinary();

    websocket.send(message);

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
            return <Link key={value.master_id} to={`/online/room/${value.id}`}>
              <Button disabled={value.status === proto.Room.RoomStatus.inGame} color={'orange'}>
                { value.id } - { value.master_id } - { value.headcount}/{value.capacity }
              </Button>
            </Link>;
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
