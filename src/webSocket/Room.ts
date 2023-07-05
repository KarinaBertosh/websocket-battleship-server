import { Player } from "./Player";
import crypto from "crypto";

export class Room {
  idRoom: string;
  constructor(player: Player) {
    this.idRoom = crypto.randomUUID();
  }
}
