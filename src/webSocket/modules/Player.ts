import crypto from "crypto";

import WebSocket from "ws";
import { IShip } from "../../type";
export class Player {
  name: string;
  password: string;
  id: string;
  error: boolean = false;
  errorText: string = '';
  ships: IShip[] = [];
  isTurn: boolean = false;
  ws: WebSocket;

  constructor(name: string, password: string, ws: WebSocket) {
    this.name = name;
    this.password = password;
    this.id = crypto.randomUUID();
    this.ws = ws;
  }

  getData() {
    const data = {
      name: this.name,
      index: this.id,
      error: this.error,
      errorText: this.errorText,
    };
    return data;
  }

  addShips(ships: IShip[]) {
    this.ships = ships;
  }

  changeTurn() {
    this.isTurn = !this.isTurn
  }
}
