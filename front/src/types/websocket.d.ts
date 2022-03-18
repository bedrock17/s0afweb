type CreateRoom = {
  capacity: number,
  play_time: number,
};

type RoomStatus = number;
type RoomId = number;
type HeartBeatValue = number;

type Room = {
  id: number,
  capacity: number,
  play_time: number,
  status: RoomStatus,
  master: UserID,
  game_started_at: number,
};

type GameStartResponse = {
  game_started_at: bigint,
  seed: number,
};

type RoomUsersResponse = {
  user_ids: UserID[],
};

type TileTouchEvent = Point & {
  user_id: UserID,
};

type FinishGameResponse = Record<string, number>;

type WebsocketMessageData = |
  Room |
  CreateRoom |
  RoomId |
  UserID |
  GameStartResponse |
  RoomUsersResponse |
  Point |
  TileTouchEvent;

type WebsocketSendMessage<T> = {
  type: string,
  data: T,
};

type WebsocketReceiveMessage<T> = {
  type: string,
  data: T,
  error: number,
};
