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

  addPlayerToRoom(player: Player, room: Room) {
    const index = this.rooms.indexOf(room);
    this.rooms[index].players.push(player);
  }

  addShips(ships: [], player: Player) {
    this.rooms.forEach((r) => {
      const indexPlayer = r.players.indexOf(player);
      if (indexPlayer !== undefined)
        r.players[indexPlayer].ships.push(...ships);
    });
  }

  deleteRoom(room: Room) {
    const index = this.rooms.indexOf(room);
    this.rooms.splice(index, 1);
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
