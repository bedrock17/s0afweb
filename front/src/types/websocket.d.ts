
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
  master: string,
};

type WebsocketMessageData = (Room | CreateRoom | RoomId);

type WebsocketMessage<T> = {
  type: string,
  data: T,
};
