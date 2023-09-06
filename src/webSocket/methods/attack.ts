import { db } from '..';
import { IRequest, TypeRequest } from '../../type';
import { sendResponse } from '../utils';

export const attack = (request: IRequest, isRandom = false) => {
  const requestData = JSON.parse(request.data);
  const { x, y, indexPlayer, gameId } = requestData;
  const roomPlayers = db.getRoomPlayers(gameId);

  const turnUser = roomPlayers.find((p) => p.isTurn);
  const status = db.getStatusAttack(gameId, indexPlayer, x, y);
  console.log(122, status);
  

  if (turnUser && turnUser.id === indexPlayer) {
    roomPlayers.forEach(player => {
      sendResponse(
        TypeRequest.attack,
        {
          position:
          {
            x: x,
            y: y,
          },
          currentPlayer: indexPlayer,
          status: status,
        },
        player.ws
      );
      if (status === 'miss') player.changeTurn();
    });

    const newTurnUser = roomPlayers.find((p) => p.isTurn);
    roomPlayers.forEach(player => {
      sendResponse(
        TypeRequest.turn,
        {
          currentPlayer: newTurnUser ? newTurnUser.id : turnUser.id,
        },
        player.ws
      );
    });
  }
};
