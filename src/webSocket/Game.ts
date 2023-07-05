import { Player } from "./Player";
import crypto from "crypto";

export class Game {
  idRoom: string;
  constructor(player: Player) {
    this.idRoom = crypto.randomUUID();
  }
}
