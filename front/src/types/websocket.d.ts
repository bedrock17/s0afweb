type RoomStatus = number;

type Room = {
  id: number,
  capacity: number,
  play_time: number,
  status: RoomStatus,
  master_id: UserID,
  game_started_at: number,
};

