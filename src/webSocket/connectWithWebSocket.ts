import { Player } from "./Player";
import { Game } from "./Game";
import { IRequest } from "../type";

export const connectWithWebSocket = (ws: any) => {
  let newPlayer: Player;
  let newGame: Game;

  ws.onmessage = (message: { data: string }) => {
    const { data } = message;
    const request = JSON.parse(data) as IRequest;
    const requestType = request.type;
    console.log(0, requestType);

    switch (true) {
      case requestType === "reg":
        {
          const dataFromReg = JSON.parse(request.data);
          newPlayer = new Player(dataFromReg.name, dataFromReg.password, ws);
          const response = JSON.stringify({
            type: "reg",
            data: JSON.stringify(newPlayer.getData()),
            id: 0,
          });
          ws.send(response);
        }
        break;

      case requestType === "create_room":
        {
          newGame = new Game(newPlayer);
          const response = JSON.stringify({
            type: "update_room",
            data: JSON.stringify([
              {
                roomId: newGame.indexRoom,
                roomUsers: [
                  {
                    name: newPlayer.name,
                    index: newPlayer.id,
                  },
                ],
              },
            ]),
            id: 0,
          });
          ws.send(response);
        }
        break;

      case requestType === "add_user_to_room":
        {
          const dataFromReg = JSON.parse(request.data);
          newGame.indexRoom = dataFromReg.indexRoom;
          const response = JSON.stringify({
            type: "create_game",
            data: JSON.stringify({
              idGame: newGame.idGame,
              idPlayer: newPlayer.id,
            }),
            id: 0,
          });
          ws.send(response);

          const response3 = JSON.stringify({
            type: "update_room",
            data: JSON.stringify([
              {
                roomId: newGame.idGame,
                roomUsers: [
                  {
                    name: newPlayer.name,
                    index: newPlayer.id,
                  },
                ],
              },
            ]),
            id: 0,
          });
          ws.send(response3);
        }
        break;

      case requestType === "add_ships":
        {
          const dataFromReg = JSON.parse(request.data);
          newGame.ships = dataFromReg.data.ships;
          newGame.idGame = dataFromReg.data.idGame;
          const response = JSON.stringify({
            type: "start_game",
            data: JSON.stringify({
              ships: newGame.ships,
              currentPlayerIndex: newPlayer.id,
            }),
            id: 0,
          });
          ws.send(response);
        }
        break;
    }
  };
};
