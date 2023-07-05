import { IRequest } from "../type";
import { Player } from "./Player";

const connections = new Set();

export const connection = (ws: any) => {
  let newPlayer: Player;
  connections.add(ws);

  ws.onmessage = (message: { data: string }) => {
    const { data } = message;
    const request = JSON.parse(data) as IRequest;
    const requestType = request.type;

    if (requestType === "reg") {
      const dataFromReg = JSON.parse(request.data);
      newPlayer = new Player(dataFromReg.name, dataFromReg.password);
      const response = JSON.stringify({
        type: "reg",
        data: JSON.stringify(newPlayer.getData()),
        id: 0,
      });
      ws.send(response);
    }
  };
};
