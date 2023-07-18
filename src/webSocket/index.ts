import { IRequest, IRoom } from "../type";
import { Player } from "./data/Player";
import { DataBase } from "./data/database";
import { addUser } from "./methods/addUser";
import { createRoom } from "./methods/createRoom";
import { registration } from "./methods/registration";
import { TypeRequest } from "../type";
import { addShips } from "./methods/addShips";
import { attack } from "./methods/attack";
import WebSocket from "ws";

export const db = new DataBase();

export const connectWithWebSocket = (ws: WebSocket) => {
  let newPlayer: Player;

  ws.onmessage = (message) => {
    console.log(0, message.data.toString());
    const request = JSON.parse(message.data.toString()) as IRequest;

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

      case TypeRequest.addShips:
        addShips(ws, newPlayer, request);
        break;

      case TypeRequest.attack:
        attack(ws, newPlayer, request);
        break;
    }
  };
};
