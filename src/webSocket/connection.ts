import { IRequest } from "../type";
import { Player } from "./Player";
import { Room } from "./Room";

const connections = new Set();

export const connection = (ws: any) => {
  let newPlayer: Player;
  let newRoom: Room;
  connections.add(ws);

  ws.onmessage = (message: { data: string }) => {
    const { data } = message;
    const request = JSON.parse(data) as IRequest;
    const requestType = request.type;

    switch (true) {
      case requestType === "reg":
        {
          const dataFromReg = JSON.parse(request.data);
          newPlayer = new Player(dataFromReg.name, dataFromReg.password);
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
          newRoom = new Room(newPlayer);
          const response = JSON.stringify({
            type: "create_game",
            data: JSON.stringify(newRoom),
            id: 0,
          });
          ws.send(response);
        }
        break;
    }
  };
};
