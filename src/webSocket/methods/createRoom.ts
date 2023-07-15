import { IRequest } from "../../type";
import { Game } from "../data/Game";
import { Player } from "../data/Player";
import { Room } from "../data/Room";
import { db } from "..";
import { TypeRequest } from "../../type";
import { sendResponse } from "../utils";

export const createRoom = (
  ws: WebSocket,
  player: Player,
  request: IRequest
) => {
  const newGame = new Game();
  db.addGame(newGame);
  const room = new Room(player);
  db.addRoom(room);

  sendResponse(
    TypeRequest.createGame,
    JSON.stringify({
      idGame: newGame.idGame,
      idPlayer: player.id,
    }),
    ws
  );
};
