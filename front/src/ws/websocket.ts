import type { MessageType } from '~/proto/messages/proto';
import * as HeartbeatRequest from '~/proto/messages/proto/HeartbeatRequest';
import * as Response from '~/proto/messages/proto/Response';
import type { ProtoMessage } from '~/types/proto';
import { newProtoRequest } from '~/utils/proto';
import Queue from '~/utils/queue';

export class PopTileWebsocket {
  ws: WebSocket;
  messageHandle: Partial<Record<MessageType, (msg: ProtoMessage) => void>> = {

  };

  messageQueue = new Queue<Uint8Array>();

  constructor(ws: WebSocket) {
    this.ws = ws;
    this.ws.addEventListener('open', () => {
      while (this.messageQueue.length > 0) {
        const data = this.messageQueue.dequeue();
        if (data) {
          this.ws.send(data);
        }
      }
    });
  }

  send(data: Uint8Array) {
    if (this.ws.readyState === this.ws.OPEN) {
      this.ws.send(data);
    } else {
      this.messageQueue.enqueue(data);
    }
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
      'heartbeat',
      HeartbeatRequest.encodeBinary({
        timestamp: `${new Date().getTime()}`,
      }),
    );
    websocket.send(message);
  };
  setInterval(sendHeartBeat, 5000);

  websocket.onerror = (e) => {
    // eslint-disable-next-line no-console
    console.log('onerror', e);
  };

  websocket.onmessage = (msg) => {
    msg.data.arrayBuffer().then((buffer: ArrayBuffer) => {
      const response = Response.decodeBinary(new Uint8Array(buffer));
      if (response.type !== undefined && response.type in popTileWebsocket.messageHandle) {
        popTileWebsocket.messageHandle[response.type]?.(response);
      } else {
        console.error('Unknown message type');
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
