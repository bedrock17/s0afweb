
export const messageType = {
  createRoom: 'create_room',
  joinRoom: 'join_room',
};

export class PopTileWebsocket {
  ws: WebSocket | undefined;
  messageHandle: Record<string, (msg: WebsocketMessage<WebsocketMessageData>) => void> = {};
}

export const createPopTileWebsocket = (): PopTileWebsocket => {

  const l = window.location;
  const url = ((l.protocol === 'https:') ? 'wss://' : 'ws://') + l.host + l.pathname + '/v1/ws';

  let websocket: null | WebSocket = null;
  if (import.meta.env.DEV) {
    websocket = new WebSocket('ws://localhost:8080/v1/ws');
  } else {
    websocket = new WebSocket(url);
  }
  const popTileWebsocket = new PopTileWebsocket();

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

  popTileWebsocket.ws = websocket;
  return popTileWebsocket;
};
