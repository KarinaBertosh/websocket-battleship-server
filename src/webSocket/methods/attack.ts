import { db } from "..";
import { IRequest, TypeRequest } from "../../type";
import { Player } from "../data/Player";
import { sendResponse } from "../utils";

export const attack = (ws: WebSocket, player: Player, request: IRequest) => {
  const requestData = JSON.parse(request.data);
  const { x, y, indexPlayer, gameId } = requestData;
  const currentRoom = db.rooms.find(
    (room) => room.players.length === 2 && room.id === gameId
  );
  const currentPlayer = currentRoom?.players.find((p) => p.id === indexPlayer);
  const nextPlayer = currentRoom?.players.find((p) => p.id !== indexPlayer);
  let status = false;

  console.log(5, currentRoom);

  if (nextPlayer && currentPlayer) {
    for (var i = 0; i < nextPlayer.ships.length; i++) {
      if (
        nextPlayer.ships[i]["position"]["x"] === x &&
        nextPlayer.ships[i]["position"]["y"] === y
      ) {
        status = true;
        continue;
      }
    }

    const data = JSON.stringify({
      position: {
        x: x,
        y: y,
      },
      currentPlayer: currentPlayer.id,
      status: status === true ? "shot" : "miss",
    });

    sendResponse(TypeRequest.attack, data, ws);

    const dataTurn = JSON.stringify({
      currentPlayer: status === false ? nextPlayer.id : player.id,
    });
    sendResponse(TypeRequest.turn, dataTurn, ws);

    console.log(6, status);
    console.log(7, indexPlayer);
    console.log(8, nextPlayer);
  }
};
