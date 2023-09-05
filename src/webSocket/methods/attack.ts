import { db } from '..';
import { IRequest, TypeRequest } from '../../type';
import { Player } from '../modules/Player';
import { sendResponse } from '../utils';
import WebSocket from 'ws';

export const attack = (ws: WebSocket, player: Player, request: IRequest) => {
  const requestData = JSON.parse(request.data);
  const { x, y, indexPlayer, gameId } = requestData;
  const currentRoom = db.rooms.find((room) => room.players.length === 2 && room.id === gameId);
  const currentPlayer = currentRoom?.players.find((p) => p.id === indexPlayer);
  const nextPlayer = currentRoom?.players.find((p) => p.id !== indexPlayer);
  let status = 'miss';

  if (nextPlayer && currentPlayer) {
    for (var i = 0; i < nextPlayer.ships.length; i++) {
      if (nextPlayer.ships[i]['position']['x'] === x && nextPlayer.ships[i]['position']['y'] === y) {
        status = 'shot';
        continue;
      }
    }

    const data = JSON.stringify({
      position: {
        x: x,
        y: y,
      },
      currentPlayer: currentPlayer.id,
      status: status,
    });

    sendResponse(TypeRequest.attack, data, ws);

    const dataTurn = JSON.stringify({
      currentPlayer: status === 'miss' ? nextPlayer.id : currentPlayer.id,
    });

    sendResponse(TypeRequest.turn, dataTurn, ws);
  }
};
