import { TypeRequest } from "../../type";
import { IRequest } from "../../type";
import { Player } from "../data/Player";
import { sendResponse } from "../utils";
import { db } from "..";


export const registration = (ws: WebSocket, request: IRequest): Player => {
  const requestData = JSON.parse(request.data);
  const player = new Player(requestData.name, requestData.password, ws);
  db.addPlayer(player);

  sendResponse(TypeRequest.reg, JSON.stringify(player.getData()), ws);

  if (db.rooms.length) {
    sendResponse(TypeRequest.updateRoom, db.returnRooms(), ws);
  }

  return player;
};
