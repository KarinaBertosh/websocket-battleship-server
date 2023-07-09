import { IRequest, IRoom } from "../type";
import { Game } from "./Game";
import { Player } from "./Player";
import { Room } from "./Room";
import { sendResponse } from "./utils";

let newGame: Game;
const players = new Set<Player>();
const newRoom = new Room(players);

setInterval(() => {
  newRoom.updateRooms();
}, 500);

export const connectWithWebSocket = (ws: WebSocket) => {
  const reg = "reg";
  const updateRoom = "update_room";
  const createRoom = "create_room";
  const createGame = "create_game";
  const addShips = "add_ships";
  const addUserToRoom = "add_user_to_room";
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
          newGame.ships = requestData2.ships;
          newRoom.ships = requestData2.ships;

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
        }
        break;

      case type === addUserToRoom:
        {
          const requestData = JSON.parse(request.data);
          newGame = new Game(newPlayer);
          const data = JSON.stringify({
            idGame: requestData.indexRoom,
            idPlayer: newPlayer.id,
          });
          sendResponse(createGame, data, ws);
        }
        break;
    }
  };
};
