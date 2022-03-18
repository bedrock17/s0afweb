export const messageType = {
  createRoom: 'create_room',
  joinRoom: 'join_room',
  exitRoom: 'exit_room',
  getRooms: 'get_rooms',
  roomConfig: 'room_config',
  roomUsers: 'room_users',
  startGame: 'start_game',
  finishGame: 'finish_game',
  touch: 'touch_tile',
  heartbeat: 'heartbeat',
};

export class PopTileWebsocket {
  ws: WebSocket;
  messageHandle: Record<string, (msg: WebsocketReceiveMessage<WebsocketMessageData>) => void> = {};

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

  const sendHeartBeat = () => {
    const heartBeatMessage: WebsocketSendMessage<HeartBeatValue> = {
      type: messageType.heartbeat,
      data: new Date().getTime()
    };
    websocket.send(JSON.stringify(heartBeatMessage));
  };
  setInterval(sendHeartBeat, 5000);

  websocket.onerror = (e) => {
    // eslint-disable-next-line no-console
    console.log('onerror', e);
  };

  websocket.onmessage = (msg) => {
    // eslint-disable-next-line no-console
    console.log('onmessage', msg.data);

    const serverMessage: WebsocketReceiveMessage<WebsocketMessageData> = JSON.parse(msg.data);

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
