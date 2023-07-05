import { Player } from "./Player";
import { Game } from "./Game";
import { IRequest } from "../type";

const connections = new Set();

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
          newPlayer = new Player(dataFromReg.name, dataFromReg.password);

          connections.add(dataFromReg);

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
            type: "create_game",
            data: JSON.stringify(newGame),
            id: 0,
          });
          ws.send(response);
        }
        break;

      case requestType === "add_ships":
        {
          const dataFromReg = JSON.parse(request.data);
          newPlayer.ships = dataFromReg.ships;
        }
        break;
    }
  };
};
