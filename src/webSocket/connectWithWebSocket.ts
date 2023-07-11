import { IRequest, IRoom } from "../type";
import { Game } from "./Game";
import { Player } from "./Player";
import { Room } from "./Room";
import {
  addShips,
  addUserToRoom,
  attack,
  createGame,
  createRoom,
  reg,
  turn,
  updateRoom,
} from "./typesRequest";
import { sendResponse } from "./utils";

let newGame: Game;
const players = new Set<Player>();
const newRoom = new Room(players);
const currentPlayers = newRoom.sendCurrentPlayers();

setInterval(() => {
  newRoom.updateRooms();
}, 500);

const renderStatusAttack = (x: string, y: string, player: Player) => {
  return checkPositionAttack(player.ships, x, y);
};

function checkPositionAttack(ships: any, x: string, y: string) {
  let result = false;
  for (var i = 0; i < ships.length; i++) {
    if (ships[i].position.x === x && ships[i].position.y === y) {
      result = true;
      continue;
    }
  }
  return result;
}

const sendResponseForAttack = (
  status: boolean,
  player: Player,
  nextPlayer: Player,
  x: string,
  y: string,
  ws: WebSocket
) => {
  const data = JSON.stringify({
    position: {
      x: x,
      y: y,
    },
    currentPlayer: player,
    status: status === true ? "shot" : "miss",
  });

  sendResponse(attack, data, ws);

  const dataTurn = JSON.stringify({
    currentPlayer: status === false ? nextPlayer.id : player.id,
  });
  sendResponse(turn, dataTurn, ws);
};

export const connectWithWebSocket = (ws: WebSocket) => {
  let newPlayer: Player;

  ws.onmessage = (message) => {
    console.log(0, message.data);
    const request = JSON.parse(message.data) as IRequest;
    const type = request.type;

    switch (true) {
      case type === reg:
        {
          const requestFromReg = JSON.parse(request.data);
          newPlayer = new Player(
            requestFromReg.name,
            requestFromReg.password,
            ws
          );
          players.add(newPlayer);
          sendResponse(reg, JSON.stringify(newPlayer.getData()), ws);

          if (newRoom.rooms.length) {
            sendResponse(updateRoom, JSON.stringify(newRoom.rooms), ws);
          }
        }
        break;

      case type === createRoom:
        {
          newGame = new Game(newPlayer);
          sendResponse(createGame, JSON.stringify(newGame), ws);
        }
        break;

      case type === addShips:
        {
          const requestData2 = JSON.parse(request.data);
          newPlayer.ships = requestData2.ships;

          const currentRoom = newRoom.rooms.find(
            (r) => r.roomId === requestData2.gameId
          );
          currentRoom
            ? currentRoom.roomUsers.push({
                name: newPlayer.name,
                index: newPlayer.id,
              })
            : newRoom.rooms.push({
                roomId: newGame.idGame,
                roomUsers: [
                  {
                    name: newPlayer.name,
                    index: newPlayer.id,
                  },
                ],
              });
          const dataTurn = JSON.stringify({
            currentPlayer: newPlayer,
          });
          sendResponse(turn, dataTurn, ws);
        }
        break;

      case type === addUserToRoom:
        {
          const requestData = JSON.parse(request.data);
          newGame = new Game(newPlayer);
          const dataCreateGame = JSON.stringify({
            idGame: requestData.indexRoom,
            idPlayer: newPlayer.id,
          });
          sendResponse(createGame, dataCreateGame, ws);
          sendResponse(updateRoom, JSON.stringify(newRoom.rooms), ws);
        }
        break;

      case type === attack:
        {
          const requestData = JSON.parse(request.data);
          const getStatus = (player: Player) => {
            return renderStatusAttack(requestData.x, requestData.y, player);
          };

          const x = requestData.x;
          const y = requestData.y;

          if (currentPlayers[1].id === requestData.indexPlayer) {
            const currentPlayer = currentPlayers[1];
            const nextPlayer = currentPlayers[0];
            const status = getStatus(currentPlayer);
            sendResponseForAttack(status, currentPlayer, nextPlayer, x, y, ws);
          } else if (currentPlayers[0].id === requestData.indexPlayer) {
            const currentPlayer = currentPlayers[0];
            const nextPlayer = currentPlayers[1];
            const status = getStatus(currentPlayer);
            sendResponseForAttack(status, currentPlayer, nextPlayer, x, y, ws);
          }
        }
        break;
    }
  };
};
