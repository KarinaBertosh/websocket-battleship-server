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

  getRoom(gameId: string) {
    return this.rooms.find((room) => room.id === gameId);
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

  getPosShip(gameId: string, attackerPlayerId: string, x: number, y: number) {
    const game = this.getRoom(gameId);
    if (game) {
      const defenderPlayer = game.players.filter((p) => p.id !== attackerPlayerId)[0];
      const killedShip = defenderPlayer.getShip();
      return killedShip && killedShip;
    }
  }

  changeStatus(ships: IShip[], x: number, y: number, defenderPlayer: Player) {
    let status = 'miss';
    let type = '';

    ships.forEach((ship) => {
      type = ship.type;
      const { position, length, direction } = ship;

      const doStatusKilled = () => status = "killed";
      const doStatusShot = () => status = "shot";
      const posX = position.x;
      const posY = position.y;

      if (type === 'small') {
        posX === x && posY === y && doStatusKilled();
      } else {
        for (let i = 0; i < length; i++) {
          if (direction && (posX === x && ((posY === y) || (posY + i === y && posY + i < posY + length)))) doStatusShot();
          if (!direction && (posY === y && ((posX === x) || (posX + i === x && posX + i < posX + length)))) doStatusShot();
        }
      }
    });

    defenderPlayer.changeSavedShips(x, y);
    return status;
  }


  getStatusAttack(gameId: string, attackerPlayerId: string, x: number, y: number) {
    const game = this.getRoom(gameId);
    let status = 'miss';
    let isKilledShip = false;

    if (game) {
      const defenderPlayer = game.players.filter((p) => p.id !== attackerPlayerId)[0];
      const ships = defenderPlayer.ships;

      status = this.changeStatus(ships, x, y, defenderPlayer);
      isKilledShip = defenderPlayer.isKilledShip();

      if (isKilledShip) {
        status = 'killed';
        isKilledShip = false;
      }

      return status;
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
