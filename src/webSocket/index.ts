import { IRequest, IRoom } from "../type";
import { Player } from "./data/Player";
import { DataBase } from "./data/database";
import { addUser } from "./methods/addUser";
import { createRoom } from "./methods/createRoom";
import { registration } from "./methods/registration";
import { TypeRequest } from "../type";

export const db = new DataBase();

export const connectWithWebSocket = (ws: WebSocket) => {
  let newPlayer: Player;

  ws.onmessage = (message) => {
    console.log(0, message.data);
    const request = JSON.parse(message.data) as IRequest;

    switch (request.type) {
      case TypeRequest.reg:
        newPlayer = registration(ws, request);
        break;

      case TypeRequest.createRoom:
        createRoom(ws, newPlayer, request);
        break;

      case TypeRequest.addUserToRoom:
        addUser(ws, newPlayer, request);
        break;
    }
  };
};
