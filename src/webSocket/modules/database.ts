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

  changeStatus(ships: IShip[], x: number, y: number) {
    let status = 'miss';
    let type = '';
    ships.forEach((ship) => {
      type = ship.type;
      const direction = ship.direction;

      const doStatusKilled = () => status = "killed";
      const doStatusShot = () => status = "shot";
      const posX = ship.position.x
      const posY = ship.position.y
      const shipLength = ship.length

      if ((posX === x && posY === y && type === 'small')) {
        doStatusKilled();
      }

      if ((posX === x && posY === y && type !== 'small')) {
        doStatusShot();
      }


      if (direction && type !== 'small') {
        if ((posX === x
          && ((posY + 1 === y && posY + 1 < posY + shipLength)
            || (posY + 2 === y && posY + 2 < posY + shipLength)
            || (posY + 3 === y && posY + 3 < posY + shipLength)
            || (posY + 4 === y && posY + 4 < posY + shipLength))
        )) {
          doStatusShot();
        }
      }

      if (!direction && type !== 'small') {
        if ((posY === y
          && ((posX + 1 === x && posX + 1 < posX + shipLength)
            || (posX + 2 === x && posX + 2 < posX + shipLength)
            || (posX + 3 === x && posX + 3 < posX + shipLength)
            || (posX + 4 === x && posX + 4 < posX + shipLength))
        )) {
          doStatusShot();
        }
      }
    });
    return status;
  }


  getStatusAttack(gameId: string, attackerPlayerId: string, x: number, y: number) {
    const game = this.getRoom(gameId);
    let status = 'miss';

    if (game) {
      const defenderPlayer = game.players.filter((p) => p.id !== attackerPlayerId)[0];
      const ships = defenderPlayer.ships;
      let isKilledShip = false;

      status = this.changeStatus(ships, x, y);
      defenderPlayer.changeSavedShips(x, y);

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
