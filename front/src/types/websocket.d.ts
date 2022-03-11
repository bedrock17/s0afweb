
type CreateRoom = {
  capacity: number,
  game_time: number,
};

type RoomStatus = number;

type Room = {
  id: number,
  capacity: number,
  game_time: number,
  status: RoomStatus,
};

type WebsocketMessage<T> = {
  type: string,
  data: T,
};
