import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import { gameRoomState } from '~/atoms/game';
import Button from '~/components/Button';
import OnlinePlayLayout from '~/layout/OnlinePlayLayout';
import type {
  Room, GetRoomsResponse, CreateRoomResponse 
} from '~/proto/messages/proto';
import * as CreateRoomRequest from '~/proto/messages/proto/CreateRoomRequest';
import { newProtoRequest, parseData } from '~/utils/proto';
import { getWebsocketInstance } from '~/ws/websocket';

import { Wrapper } from './styles';

const OnlinePlay = () => {
  const navigate = useNavigate();
  const websocket = getWebsocketInstance();
  const setRoom = useSetRecoilState(gameRoomState);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {

    websocket.messageHandle['get_rooms'] = (response) => {
      const data = parseData<GetRoomsResponse>(response);
      setRooms(data.rooms);
    };

    websocket.messageHandle['create_room'] = (response) => {
      const data = parseData<CreateRoomResponse>(response);

      setRoom(data.room);
      navigate(`/online/room/${data.room?.id}`);
    };

    const message = newProtoRequest('get_rooms');

    websocket.send(message);

  }, []);

  const onClickCreateRoom = () => {
    const message = newProtoRequest(
      'create_room',
      CreateRoomRequest.encodeBinary({
        capacity: 10,
        playTime: 30,
      })
    );

    websocket?.ws?.send(message);
  };

  return (
    <OnlinePlayLayout>
      <Wrapper>
        {
          rooms.map(value => {
            return <Link key={value.masterId} to={`/online/room/${value.id}`}>
              <Button disabled={value.status === 'inGame'} color={'orange'}>
                { value.id } - { value.masterId } - { value.headcount }/{ value.capacity }
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
