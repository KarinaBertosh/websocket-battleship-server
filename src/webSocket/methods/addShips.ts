import { IRequest } from "../../type";
import { Player } from "../data/Player";
import { Room } from "../data/Room";
import { db } from "..";
import { TypeRequest } from "../../type";
import { sendResponse } from "../utils";
import WebSocket from "ws";

export const addShips = (ws: WebSocket, player: Player, request: IRequest) => {
  const requestData = JSON.parse(request.data);
  db.addShips(requestData.ships, player);

  const roomWithTwoPlayer = db.rooms.find(
    (room) => room.players.length === 2 && room.id === requestData.gameId
  );

  if (roomWithTwoPlayer !== undefined) {
    roomWithTwoPlayer.players.forEach((player) => {
      sendResponse(
        TypeRequest.startGame,
        JSON.stringify({
          ships: player.ships,
          currentPlayerIndex: player.id,
        }),
        player.ws
      );
    });
    // db.deleteRoom(roomWithTwoPlayer);
  }

  sendResponse(
    TypeRequest.turn,
    JSON.stringify({ currentPlayer: player.id }),
    ws
  );

  // sendResponse(TypeRequest.updateRoom, JSON.stringify(db.rooms), ws);
};
