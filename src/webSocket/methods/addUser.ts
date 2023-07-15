import { IRequest } from "../../type";
import { Player } from "../data/Player";
import { Room } from "../data/Room";
import { db } from "..";
import { TypeRequest } from "../../type";
import { sendResponse } from "../utils";


export const addUser = (ws: WebSocket, player: Player, request: IRequest) => {
  const requestData = JSON.parse(request.data);
  const indexRoom = requestData.indexRoom;

  const room = new Room(player);
  db.addRoom(room);

  sendResponse(
    TypeRequest.createGame,
    JSON.stringify({
      idGame: indexRoom,
      idPlayer: player.id,
    }),
    ws
  );
};
