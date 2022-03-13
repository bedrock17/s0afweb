import { Point } from '~/game';

type CreateRoom = {
  capacity: number,
  play_time: number,
};

type RoomStatus = number;
type RoomId = number;

type Room = {
  id: number,
  capacity: number,
  play_time: number,
  status: RoomStatus,
  master: UserID,
};

type GameStartResponse = {
  game_started_at: bigint,
  seed: number,
};


type WebsocketMessageData = (Room | CreateRoom | RoomId | UserID | GameStartResponse | Point);

type WebsocketMessage<T> = {
  type: string,
  data: T,
};
