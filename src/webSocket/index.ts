import { IRequest, IRoom } from "../type";
import { Player } from "./modules/Player";
import { DataBase } from "./modules/database";
import { addUser } from "./methods/addUser";
import { createRoom } from "./methods/createRoom";
import { registration } from "./methods/registration";
import { TypeRequest } from "../type";
import { addShips } from "./methods/addShips";
import { attack } from "./methods/attack";
import WebSocket, { RawData } from "ws";

export const db = new DataBase();

export const connectWithWebSocket = (ws: WebSocket) => {
  let currentPlayer: Player;

  ws.on('error', console.error);

  ws.on('message', (message: RawData) => {
    const request = JSON.parse(message.toString()) as IRequest;
    
    switch (request.type) {
      case TypeRequest.reg:
        currentPlayer = registration(ws, request);
        break;

      case TypeRequest.createRoom:
        createRoom(ws, currentPlayer, request);
        break;

      case TypeRequest.addUserToRoom:
        addUser(ws, currentPlayer, request);
        break;

      case TypeRequest.addShips:
        addShips(ws, currentPlayer, request);
        break;

      case TypeRequest.attack:
        attack(request);
        break;
    }
  });
};
