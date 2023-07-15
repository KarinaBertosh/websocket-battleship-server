import { Game } from "./Game";
import { Player } from "./Player";
import { Room } from "./Room";

export class DataBase {
  players: Player[] = [];
  games: Game[] = [];
  rooms: Room[] = [];

  addPlayer(newPlayer: Player) {
    this.players.push(newPlayer);
  }

  addRoom(room: Room) {
    this.rooms.push(room);
  }

  addGame(game: Game) {
    this.games.push(game);
  }

  returnRooms() {
    return JSON.stringify(
      this.rooms.map((room) => ({
        roomId: room.id,
        roomUsers: room.players.map((pl) => ({
          name: pl.name,
          index: pl.id,
        })),
      }))
    );
  }
}
