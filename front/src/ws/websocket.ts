
export const messageType = {
  createRoom: 'create_room',
  joinRoom: 'join_room',
  exitRoom: 'exit_room',
};

export class PopTileWebsocket {
  ws: WebSocket;
  messageHandle: Record<string, (msg: WebsocketMessage<WebsocketMessageData>) => void> = {};

  constructor(ws: WebSocket) {
    this.ws = ws;
  }
}


const createPopTileWebsocket = (): PopTileWebsocket => {
  const l = window.location;
  const url = ((l.protocol === 'https:') ? 'wss://' : 'ws://') + l.host + l.pathname + '/v1/ws';

  let websocket: WebSocket;
  if (import.meta.env.DEV) {
    websocket = new WebSocket('ws://localhost:8080/v1/ws');
  } else {
    websocket = new WebSocket(url);
  }
  const popTileWebsocket = new PopTileWebsocket(websocket);

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
    console.log('onmessage', msg.data);

    const serverMessage: WebsocketMessage<WebsocketMessageData> = JSON.parse(msg.data);

    if (serverMessage.type in popTileWebsocket.messageHandle) {
      popTileWebsocket.messageHandle[serverMessage.type](serverMessage);
    } else {
      // eslint-disable-next-line no-console
      console.log('Unknown message type');
    }

  };

  return popTileWebsocket;
};

let websocket: PopTileWebsocket;

export const getWebsocketInstance = (): PopTileWebsocket => {
  websocket = websocket ?? createPopTileWebsocket();
  return websocket;
};
