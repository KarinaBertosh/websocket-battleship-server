import crypto from "crypto";

export class Player {
  name: string;
  password: string;
  id: string;
  error: boolean;
  errorText: string;
  ships: [];
  ws: WebSocket;

  constructor(name: string, password: string, ws: WebSocket) {
    this.name = name;
    this.password = password;
    this.id = crypto.randomUUID();
    this.error = false;
    this.errorText = "";
    this.ships = [];
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
}
