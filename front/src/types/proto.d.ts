import type { proto } from '~/proto/message';

type ProtoMessage = {
  type: typeof proto.Response.prototype.type,
  data?: typeof proto.Response.prototype.data,
  error?: number,
};

type ProtoResponse =
  | typeof proto.GetRoomsResponse
  | typeof proto.CreateRoomResponse
  | typeof proto.JoinRoomResponse
  | typeof proto.GetRoomConfigResponse
  | typeof proto.StartGameResponse
  | typeof proto.TouchResponse
  | typeof proto.FinishGameResponse
  | typeof proto.GetRoomUsersResponse;
