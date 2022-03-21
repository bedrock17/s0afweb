import { google } from '~/proto/google/protobuf/any';
import { proto } from '~/proto/message';
import type { ProtoMessage, ProtoResponse } from '~/types/proto';

interface IProtoMessage {
  serializeBinary(): Uint8Array;
}

export const newProtoRequest = (type: proto.MessageType, message: IProtoMessage): proto.Request => {
  return proto.Request.fromObject({
    type,
    data: google.protobuf.Any.fromObject({
      value: message.serializeBinary()
    }),
  });
};

export const parseData = <T>(message: ProtoMessage): T => {
  const o = responseType[message.type].deserializeBinary(message.data!.value).toObject() as T;
  return o;
};

export const responseType: Record<number, ProtoResponse> = {
  [proto.MessageType.get_rooms]: proto.GetRoomsResponse,
  [proto.MessageType.create_room]: proto.CreateRoomResponse,
  [proto.MessageType.join_room]: proto.JoinRoomResponse,
  [proto.MessageType.room_config]: proto.GetRoomConfigResponse,
  [proto.MessageType.exit_room]: proto.ExitRoomResponse,
  [proto.MessageType.start_game]: proto.StartGameResponse,
  [proto.MessageType.touch]: proto.TouchResponse,
  [proto.MessageType.finish_game]: proto.FinishGameResponse,
  [proto.MessageType.room_users]: proto.GetRoomUsersResponse,
};
