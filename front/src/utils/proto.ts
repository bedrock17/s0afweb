import { google } from '~/proto/google/protobuf/any';
import { proto } from '~/proto/message';
import type { ProtoMessage, ProtoResponse } from '~/types/proto';

interface IProtoMessage {
  serializeBinary(): Uint8Array;
}

export const newProtoRequest = (type: proto.RequestType, message: IProtoMessage): proto.Request => {
  return proto.Request.fromObject({
    type,
    data: google.protobuf.Any.fromObject({
      value: message.serializeBinary()
    }),
  });
};

export const parseData = <T>(message: ProtoMessage): T => {
  const o = responseType[message.type].deserializeBinary(message.data!.value).toObject() as T;
  console.log(o);
  return o;
};

export const responseType: Record<number, ProtoResponse> = {
  [proto.RequestType.get_rooms]: proto.GetRoomsResponse,
  [proto.RequestType.create_room]: proto.CreateRoomResponse,
  [proto.RequestType.join_room]: proto.JoinRoomResponse,
  [proto.RequestType.room_config]: proto.GetRoomConfigResponse,
  [proto.RequestType.start_game]: proto.StartGameResponse,
  [proto.RequestType.touch]: proto.TouchResponse,
  [proto.RequestType.finish_game]: proto.FinishGameResponse,
  [proto.RequestType.room_users]: proto.GetRoomUsersResponse,
};
