import { TypeRequest } from "../../type";
import { IRequest } from "../../type";
import { Player } from "../modules/Player";
import { sendResponse } from "../utils";
import { db } from "..";
import WebSocket from "ws";


export const registration = (ws: WebSocket, request: IRequest): Player => {
  const requestData = JSON.parse(request.data);
  const userName = requestData.name;
  const userPassword = requestData.password;

  const resp = JSON.stringify({
    type: TypeRequest.reg,
    data:
      JSON.stringify({
        name: userName,
        index: 1,
        error: false,
        errorText: '',
      }),
    id: 0,
  });
  ws.send(resp);

  const player = new Player(userName, userPassword, ws);
  db.addPlayer(player);

  if (db.rooms.length) {
    ws.send(JSON.stringify({
      type: TypeRequest.updateRoom,
      data: db.getRoomsForResp(),
      id: 0,
    }))
  }

  return player;
};
