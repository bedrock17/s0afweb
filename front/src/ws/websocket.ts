import { proto } from '~/proto/message';
import type { ProtoMessage } from '~/types/proto';
import { newProtoRequest } from '~/utils/proto';

export class PopTileWebsocket {
  ws: WebSocket;
  messageHandle: Record<string, (msg: ProtoMessage) => void> = {};

  constructor(ws: WebSocket) {
    this.ws = ws;
  }
}

const createPopTileWebsocket = (): PopTileWebsocket => {
  const l = window.location;
  const url = ((l.protocol === 'https:') ? 'wss://' : 'ws://') + l.host + '/v1/ws';

  let websocket: WebSocket;
  if (import.meta.env.DEV) {
    websocket = new WebSocket('ws://localhost:8080/v1/ws');
  } else {
    websocket = new WebSocket(url);
  }
  const popTileWebsocket = new PopTileWebsocket(websocket);

  const sendHeartBeat = () => {
    const message = newProtoRequest(
      proto.RequestType.heartbeat,
      proto.HeartbeatRequest.fromObject({
        timestamp: new Date().getTime(),
      })
    ).serializeBinary();
    websocket.send(message);
  };
  setInterval(sendHeartBeat, 5000);

  websocket.onopen = () => {
    // eslint-disable-next-line no-console
    console.log('open');
  };

  websocket.onerror = (e) => {
    // eslint-disable-next-line no-console
    console.log('onerror', e);
  };

  websocket.onmessage = (msg) => {
    // eslint-disable-next-line no-console
    msg.data.arrayBuffer().then((buffer: Uint8Array) => {
      const response = proto.Response.deserializeBinary(buffer);
      const respObj = response.toObject();
      console.log(respObj);
      if (respObj.type !== undefined && respObj.type in popTileWebsocket.messageHandle) {
        popTileWebsocket.messageHandle[respObj.type](respObj as ProtoMessage);
      } else {
        // eslint-disable-next-line no-console
        console.log('Unknown message type');
      }
    });
  };

  return popTileWebsocket;
};

let websocket: PopTileWebsocket;

export const getWebsocketInstance = (): PopTileWebsocket => {
  websocket = websocket ?? createPopTileWebsocket();
  return websocket;
};
