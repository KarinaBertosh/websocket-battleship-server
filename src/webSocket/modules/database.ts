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
    const currentRoom = this.rooms.find((room) => room.id === gameId);
    return currentRoom
      ? currentRoom.players
      : [];
  }

  addShips(gameId: string, playerId: string, ships: IShip[]) {
    this.rooms.map((room) => {
      if (room.id === gameId) {
        room.players.map(player => player.id === playerId ? player.addShips(ships) : player);
      } else {
        return room;
      }
    });
  }

  getStatusAttack(gameId: string, attackerPlayerId: string, x: number, y: number) {
    const game = this.rooms.find((room) => room.id === gameId);
    let status = false;
    let type;
    let direction;

    if (game) {
      const defenderPlayer = game.players.filter((p) => p.id !== attackerPlayerId)[0];
      const ships = defenderPlayer.ships;
      console.log('ships', ships);
      console.log('x', x);
      console.log('y', y);
      

      ships.forEach((ship) => {
        if (ship.position.x === x && ship.position.y === y) {
          status = true;
          type = ship.type;
          return;
        }
      });
      console.log(3, status);

      return status && type !== 'small' ? 'shot' : status && type === 'small' ? "killed" : 'miss';
    }
  };

  deleteRoom(roomId: string) {
    this.rooms.filter((room) => room.id !== roomId);
  }

  getRoomsForResp() {
    const freeRooms = this.rooms.filter((r) => r.players.length === 1);

    return JSON.stringify(freeRooms.map((room) => ({
      roomId: room.id,
      roomUsers: room.players.map((player) => ({ name: player.name, index: player.id }))
    })));
  }
}
