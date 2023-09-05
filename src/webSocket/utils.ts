import WebSocket from "ws";

export const sendResponse = (type: string, data: any, ws: WebSocket) => {
  const response = JSON.stringify({
    type: type,
    data: JSON.stringify(data),
    id: 0,
  });
  ws.send(response);
};
