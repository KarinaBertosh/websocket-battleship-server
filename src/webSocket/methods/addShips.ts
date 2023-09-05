import { IRequest } from "../../type";
import { db } from "..";
import { TypeRequest } from "../../type";
import { sendResponse } from "../utils";
import WebSocket from "ws";
import { Player } from "../modules/Player";

export const addShips = (ws: WebSocket, player: Player, request: IRequest) => {
  const requestData = JSON.parse(request.data);
  const { ships, gameId, indexPlayer } = requestData;
  player.addShips(ships);

  const roomPlayers = db.getRoomPlayers(gameId)
  const currentPlayer = roomPlayers[0];
  db.addShips(gameId, indexPlayer, ships);

  if (db.isStartGame(gameId)) {
    currentPlayer.changeTurn();
    roomPlayers.forEach(player => {
      sendResponse(
        TypeRequest.startGame,
        player.ships,
        player.ws
      )
      sendResponse(
        TypeRequest.turn,
        {
          currentPlayer: currentPlayer.id,
        },
        player.ws
      )
    });
  }

  sendResponse(
    TypeRequest.updateRoom,
    db.getRoomsForResp(),
    ws,
  )
};
