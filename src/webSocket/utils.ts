export const sendResponse = (type: string, data: string, ws: WebSocket) => {
  const response = JSON.stringify({
    type: type,
    data: data,
    id: 0,
  });
  ws.send(response);
};
