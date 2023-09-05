import { IRequest } from "../../type";
import { Game } from "../modules/Game";
import { Player } from "../modules/Player";
import { Room } from "../modules/Room";
import { db } from "..";
import { TypeRequest } from "../../type";
import { sendResponse } from "../utils";
import WebSocket from "ws";

export const createRoom = (
  ws: WebSocket,
  player: Player,
  request: IRequest
) => {
  const room = new Room();
  room.addPlayer(player);
  db.addRoom(room);

  sendResponse(
    TypeRequest.createGame,
    {
      idGame: room.id,
      idPlayer: player.id,
    },
    ws
  );
};
