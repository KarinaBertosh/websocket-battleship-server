import { Player } from "./Player";
import crypto from "crypto";

export class Game {
  idGame = crypto.randomUUID();
  players: Player[] = [];
  constructor(player: Player) {
    this.players.push(player);
  }
}
