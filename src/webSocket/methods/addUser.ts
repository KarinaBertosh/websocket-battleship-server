import { IRequest } from "../../type";
import { Player } from "../modules/Player";
import { Room } from "../modules/Room";
import { db } from "..";
import { TypeRequest } from "../../type";
import { sendResponse } from "../utils";
import WebSocket from "ws";

export const addUser = (ws: WebSocket, player: Player, request: IRequest) => {
  const requestData = JSON.parse(request.data);
  const indexRoom = requestData.indexRoom;
  db.addPlayerToRoom(indexRoom, player);

  sendResponse(
    TypeRequest.createGame,
    {
      idGame: indexRoom,
      idPlayer: player.id,
    },
    ws
  );

  sendResponse(
    TypeRequest.updateRoom,
    db.getRoomsForResp(),
    ws
  );
};
