import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import { gameRoomState } from '~/atoms/game';
import Button from '~/components/Button';
import { Room } from '~/components/RoomItem/styles';
import OnlinePlayLayout from '~/layout/OnlinePlayLayout';
import { getWebsocketInstance, messageType } from '~/ws/websocket';

import { Wrapper } from './styles';

const OnlinePlay = () => {
  const navigate = useNavigate();
  const websocket = getWebsocketInstance();
  const setRoom = useSetRecoilState(gameRoomState);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    websocket.messageHandle[messageType.createRoom] = (msg) => {
      const response = msg as WebsocketReceiveMessage<Room>;
      setRoom(response.data);
      navigate(`/online/room#${response.data.id}`);
    };

    websocket.messageHandle[messageType.getRooms] = (msg) => {
      const response = msg as WebsocketReceiveMessage<Room[]>;
      console.log(response);
      setRooms(response.data);
    };

    const requestRooms: WebsocketSendMessage<GetRooms> = {
      type: messageType.getRooms,
      data: undefined,
    };

    console.log("step1")

    websocket.ws.onopen = () => {
      console.log("step2")
      websocket.ws.send(JSON.stringify(requestRooms));
    };

  }, []);

  const onClickCreateRoom = () => {
    const message: WebsocketSendMessage<CreateRoom> = {
      type: messageType.createRoom,
      data: {
        capacity: 10,
        play_time: 10,
      }
    };

    websocket?.ws?.send(JSON.stringify(message));
  };

  return (
    <OnlinePlayLayout>
      {
        rooms.map((v) => {
          return <Link key={v.id} to={`/online/room#${v.id}`}>
            <div> {v.master} </div>
          </Link>;
        })
      }
      <Wrapper>
        <Button color={'blue'} onClick={onClickCreateRoom} disabled={websocket === null}>
        Create Room
        </Button>
      </Wrapper>
    </OnlinePlayLayout>
  );
};

export default OnlinePlay;
