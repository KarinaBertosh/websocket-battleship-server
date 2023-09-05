import { TypeRequest } from "../../type";
import { IRequest } from "../../type";
import { Player } from "../modules/Player";
import { sendResponse } from "../utils";
import { db } from "..";
import WebSocket from "ws";
import { randomUUID } from "crypto";


export const registration = (ws: WebSocket, request: IRequest): Player => {
  const requestData = JSON.parse(request.data);
  const userName = requestData.name;
  const userPassword = requestData.password;

  const player = new Player(userName, userPassword, ws);
  const {id, name} = player
  db.addPlayer(player);

  const resp = JSON.stringify({
    type: TypeRequest.reg,
    data:
      JSON.stringify({
        name: name,
        index: id,
        error: false,
        errorText: '',
      }),
    id: 0,
  });
  ws.send(resp);

  if (db.rooms.length) {
    ws.send(JSON.stringify({
      type: TypeRequest.updateRoom,
      data: db.getRoomsForResp(),
      id: 0,
    }));
  }

  return player;
};
