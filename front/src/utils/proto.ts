import * as Any from '~/proto/messages/google/protobuf/Any';
import * as proto from '~/proto/messages/proto';
import type { MessageType } from '~/proto/messages/proto';
import * as AttackResponse from '~/proto/messages/proto/AttackResponse';
import * as CreateRoomResponse from '~/proto/messages/proto/CreateRoomResponse';
import * as ExitRoomResponse from '~/proto/messages/proto/ExitRoomResponse';
import * as FinishGameResponse from '~/proto/messages/proto/FinishGameResponse';
import * as GetRoomConfigResponse from '~/proto/messages/proto/GetRoomConfigResponse';
import * as GetRoomsResponse from '~/proto/messages/proto/GetRoomsResponse';
import * as GetRoomUsersResponse from '~/proto/messages/proto/GetRoomUsersResponse';
import * as JoinRoomResponse from '~/proto/messages/proto/JoinRoomResponse';
import * as Request from '~/proto/messages/proto/Request';
import * as StartGameResponse from '~/proto/messages/proto/StartGameResponse';
import * as TouchResponse from '~/proto/messages/proto/TouchResponse';
import type { ProtoMessage } from '~/types/proto';

export const newProtoRequest = (type: proto.MessageType, message?: Uint8Array): Uint8Array => {
  let data;
  if (message) {
    data = Any.createValue({
      value: message,
    });
  }

  return Request.encodeBinary({
    type,
    data,
  });
};



export const parseData = <T>(message: ProtoMessage): T => {
  const o = messageDeserializers[message.type](message.data!.value) as T;
  return o;
};

const noop = () => {/* noop */};
export const messageDeserializers: Record<MessageType, (b: Uint8Array) => unknown> = {
  _: noop,
  heartbeat: noop,
  get_rooms: GetRoomsResponse.decodeBinary,
  create_room: CreateRoomResponse.decodeBinary,
  join_room: JoinRoomResponse.decodeBinary,
  room_config: GetRoomConfigResponse.decodeBinary,
  exit_room: ExitRoomResponse.decodeBinary,
  start_game: StartGameResponse.decodeBinary,
  touch: TouchResponse.decodeBinary,
  finish_game: FinishGameResponse.decodeBinary,
  room_users: GetRoomUsersResponse.decodeBinary,
  attack: AttackResponse.decodeBinary,
};
