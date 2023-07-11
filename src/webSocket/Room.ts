import { IRoom } from "../type";
import { Player } from "./Player";
import { startGame } from "./typesRequest";
import { sendResponse } from "./utils";

export class Room {
  rooms: IRoom[] = [];
  players: Player[] = [];
  ships: any;
  currentPlayers: Player[] = [];
  constructor(players: any, ships?: any) {
    this.players = players;
    this.ships = ships;
  }

  updateRooms() {
    const roomWithTwoPlayer = this.rooms.find(
      (room) => room.roomUsers.length === 2
    );

    if (roomWithTwoPlayer) {
      this.players.forEach((pl) => {
        if (
          pl.id === roomWithTwoPlayer.roomUsers[0].index ||
          pl.id === roomWithTwoPlayer.roomUsers[1].index
        ) {
          this.currentPlayers.push(pl);
        }
      });

      if (this.currentPlayers) {
        const data = JSON.stringify({
          ships: this.ships,
          currentPlayerIndex: this.currentPlayers[0].id,
        });
        sendResponse(startGame, data, this.currentPlayers[0].ws);
        sendResponse(startGame, data, this.currentPlayers[1].ws);
      }

      this.deleteRoom(roomWithTwoPlayer);
    }
  }

  deleteRoom(room: any) {
    const index = this.rooms.indexOf(room);
    this.rooms.splice(index, 1);
  }

  sendCurrentPlayers() {
    return this.currentPlayers;
  }
}
