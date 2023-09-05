import { Player } from "./Player";
import crypto from "crypto";

export class Room {
  id = crypto.randomUUID();
  players: Player[] = [];

  addPlayer(player: Player) {
    this.players.push(player);
  }
}
