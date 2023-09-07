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

  getPosShip(gameId: string, attackerPlayerId: string, x: number, y: number) {
    const game = this.rooms.find((room) => room.id === gameId);
    if (game) {
      const defenderPlayer = game.players.filter((p) => p.id !== attackerPlayerId)[0];
      const savedShips = defenderPlayer.savedShips;
      const killedShip = defenderPlayer.getShip();
      // console.log(555, killedShip);
      return killedShip && killedShip;
    }

  }


  getStatusAttack(gameId: string, attackerPlayerId: string, x: number, y: number) {
    const game = this.rooms.find((room) => room.id === gameId);
    let status = 'miss';
    let type;

    if (game) {
      const defenderPlayer = game.players.filter((p) => p.id !== attackerPlayerId)[0];
      const ships = defenderPlayer.ships;
      const savedShips = defenderPlayer.savedShips;
      let isKilled = false;

      // console.log('ships', ships);
      // console.log('savedShips', savedShips);
      console.log('x', x);
      console.log('y', y);


      ships.forEach((ship) => {
        type = ship.type;
        const direction = ship.direction;


        if ((ship.position.x === x && ship.position.y === y && ship.type === 'small')) {
          status = "killed";
        }

        if ((ship.position.x === x && ship.position.y === y && ship.type !== 'small')) {
          status = "shot";
        }


        if (direction && type !== 'small') {
          if ((ship.position.x === x && ship.position.y + 1 === y && ship.position.y + 1 < ship.position.y + ship.length)) {
            status = 'shot';
          }
          if ((ship.position.x === x && ship.position.y + 2 === y && ship.position.y + 2 < ship.position.y + ship.length)) {
            status = 'shot';
          }
          if ((ship.position.x === x && ship.position.y + 3 === y && ship.position.y + 3 < ship.position.y + ship.length)) {
            status = 'shot';
          }
          if ((ship.position.x === x && ship.position.y + 4 === y && ship.position.y + 4 < ship.position.y + ship.length)) {
            status = 'shot';
          }


        }

        if (!direction && type !== 'small') {
          if ((ship.position.x + 1 === x && ship.position.y === y && ship.position.x + 1 < ship.position.x + ship.length)) {
            status = 'shot';
          }
          if ((ship.position.x + 2 === x && ship.position.y === y && ship.position.x + 2 < ship.position.x + ship.length)) {
            status = 'shot';
          }
          if ((ship.position.x + 3 === x && ship.position.y === y && ship.position.x + 3 < ship.position.x + ship.length)) {
            status = 'shot';
          }
          if ((ship.position.x + 4 === x && ship.position.y === y && ship.position.x + 4 < ship.position.x + ship.length)) {
            status = 'shot';
          }
        }

        
        type = ship.type;
      });
      defenderPlayer.changeSavedShips(x, y);

      isKilled = defenderPlayer.isKilledShip();
      // console.log(222, isKilled);

      if (isKilled) {
        status = 'killed';
        isKilled = false;
      }
      // console.log(3, status);

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
