import { Player } from "./Player";
import crypto from "crypto";

export class Game {
  indexRoom: string;
  idGame: string;
  ships: any
  constructor(player: Player) {
    this.indexRoom = crypto.randomUUID();
    this.idGame = crypto.randomUUID();
    this.ships = [];
  }
}
