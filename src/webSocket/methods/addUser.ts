import { IRequest } from "../../type";
import { Player } from "../data/Player";
import { Room } from "../data/Room";
import { db } from "..";
import { TypeRequest } from "../../type";
import { sendResponse } from "../utils";
import WebSocket from "ws";

export const addUser = (ws: WebSocket, player: Player, request: IRequest) => {
  const requestData = JSON.parse(request.data);
  const indexRoom = requestData.indexRoom;

  sendResponse(
    TypeRequest.createGame,
    JSON.stringify({
      idGame: indexRoom,
      idPlayer: player.id,
    }),
    ws
  );

  const currentRoom = db.rooms.find((r) => (r.id = indexRoom));
  currentRoom && db.addPlayerToRoom(player, currentRoom);

  // db.deleteRoom(room);

  // sendResponse(TypeRequest.updateRoom, JSON.stringify(db.rooms), ws);
};
