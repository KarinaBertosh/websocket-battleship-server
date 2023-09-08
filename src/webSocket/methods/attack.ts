import { db } from '..';
import { IPosition, IRequest, TypeRequest } from '../../type';
import { sendResponse } from '../utils';

export const attack = (request: IRequest, isRandom = false) => {
  const requestData = JSON.parse(request.data);
  const { x, y, indexPlayer, gameId } = requestData;
  const roomPlayers = db.getRoomPlayers(gameId);
  const turnUser = roomPlayers.find((p) => p.isTurn);
  const status = db.getStatusAttack(gameId, indexPlayer, x, y);
  let isAllShipsKilled;

  if (status === 'killed' && turnUser) {
    const killedShip = db.getPosShip(gameId, indexPlayer, x, y);

    roomPlayers.forEach(player => {
      killedShip.forEach((el: IPosition) => {
        sendResponse(
          TypeRequest.attack,
          {
            position:
            {
              x: el.x,
              y: el.y,
            },
            currentPlayer: indexPlayer,
            status: status,
          },
          player.ws
        );
        player.deleteShip();
      });

      isAllShipsKilled = player.isAllShipsKilled();
    });
  };

  if (turnUser && turnUser.id === indexPlayer && status !== 'killed') {
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

  if (isAllShipsKilled && turnUser)
  roomPlayers.forEach(player => {
    sendResponse(
      TypeRequest.finish,
      {
        winPlayer: turnUser.id,
      },
      player.ws
    );
  });
};
