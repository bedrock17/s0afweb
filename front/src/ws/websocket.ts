
export const createPopTileWebsocket = (): WebSocket => {

  const l = window.location;
  const url = ((l.protocol === 'https:') ? 'wss://' : 'ws://') + l.host + l.pathname + '/v1/ws';

  let websocket: null | WebSocket = null;
  if (import.meta.env.DEV) {
    websocket = new WebSocket('ws://localhost:8080/v1/ws');
  } else {
    websocket = new WebSocket(url);
  }
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
  };

  return websocket;
};

