import { IRoom } from "../type";
import { Player } from "./Player";
import crypto from "crypto";
import { sendResponse } from "./utils";

const startGame = "start_game";

export class Room {
  rooms: IRoom[] = [];
  players: Player[] = [];
  ships: any;
  constructor(players: any, ships?: any) {
    this.players = players;
    this.ships = ships;
  }

  updateRooms() {
    const roomWithTwoPlayer = this.rooms.find(
      (room) => room.roomUsers.length === 2
    );

    if (roomWithTwoPlayer) {
      let playerFirst = roomWithTwoPlayer.roomUsers[0].index;
      let playerSecond = roomWithTwoPlayer.roomUsers[1].index;
      let currentPlayers: Player[] = [];

      this.players.forEach((pl) => {
        if (pl.id === playerFirst || pl.id === playerSecond) {
          currentPlayers.push(pl);
        }
      });

      if (currentPlayers) {
        const data = JSON.stringify({
          ships: this.ships,
          currentPlayerIndex: currentPlayers[0],
        });
        sendResponse(startGame, data, currentPlayers[0].ws);
        sendResponse(startGame, data, currentPlayers[1].ws);
      }
      this.deleteRoom(roomWithTwoPlayer);
    }
  }

  deleteRoom(room: any) {
    const index = this.rooms.indexOf(room);
    this.rooms.splice(index, 1);
  }
}
