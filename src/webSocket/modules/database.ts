import { IShip } from '../../type';
import { Player } from './Player';
import { Room } from './Room';

export class DataBase {
  players: Player[] = [];
  rooms: Room[] = [];

  addPlayer(newPlayer: Player) {
    this.players.push(newPlayer);
  }

  addRoom(room: Room) {
    this.rooms.push(room);
  }

  isStartGame(gameId: string) {
    const currentRoom = this.rooms.find((room) => room.id === gameId);
    return currentRoom && currentRoom.players.length === 2 && currentRoom.players.every(player => player.ships.length);
  }

  addPlayerToRoom(roomId: string, player: Player) {
    this.rooms.map((room) => room.id === roomId ? room.addPlayer(player) : room);

  }

  getRoomPlayers(gameId: string): Player[] {
    const currentRoom = this.rooms.find((room) => room.id === gameId)
    return currentRoom
      ? currentRoom.players
      : [];
  }

  addShips(gameId: string, playerId: string, ships: IShip[]) {
    this.rooms.map((room) => {
      if (room.id === gameId) {
        room.players.map(player => player.id === playerId ? player.addShips(ships) : player)
      } else {
        return room;
      }
    });
  }

  deleteRoom(roomId: string) {
    this.rooms.filter((room) => room.id !== roomId);
  }

  getRoomsForResp() {
    return JSON.stringify(this.rooms.map((room) => ({
      roomId: room.id,
      roomUsers: room.players.map((player) => ({ name: player.name, index: player.id }))
    })))
  }
}
