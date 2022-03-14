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

type RoomUsersResponse = {
  user_ids: UserID[],
};

type WebsocketMessageData = |
  Room |
  CreateRoom |
  RoomId |
  UserID |
  GameStartResponse |
  RoomUsersResponse |
  Point;

type WebsocketSendMessage<T> = {
  type: string,
  data: T,
};

type WebsocketReceiveMessage<T> = {
  type: string,
  data: T,
  error: number,
};
