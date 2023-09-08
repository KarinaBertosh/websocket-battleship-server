import { randomUUID } from "crypto";

import WebSocket from "ws";
import { IPosition, IShip } from "../../type";
export class Player {
  name: string;
  password: string;
  id: string;
  error: boolean = false;
  errorText: string = '';
  ships: IShip[] = [];
  savedShips: any[] = [];
  isTurn: boolean = false;
  ws: WebSocket;

  constructor(name: string, password: string, ws: WebSocket) {
    this.name = name;
    this.password = password;
    this.id = randomUUID();
    this.ws = ws;
  }

  getData() {
    const data = {
      name: this.name,
      index: this.id,
      error: this.error,
      errorText: this.errorText,
    };
    return data;
  }

  saveShips(ships: IShip[]) {
    this.ships.forEach((ship) => {
      const { position, length, direction } = ship;
      const posX = position.x;
      const posY = position.y;
      const array = [];

      const addToArray = (curDirection: boolean, i: number) => curDirection
        ? { x: posX, y: posY + i, status: 'miss' }
        : { x: posX + i, y: posY, status: 'miss' };

      for (let i = 0; i < length; i++) {
        array.push(addToArray(direction, i));
      }

      this.savedShips.push(array);
    });
  }

  addShips(ships: IShip[]) {
    this.ships = ships;
    this.savedShips.length = 0;
    this.saveShips(this.ships);
  }

  getShip() {
    return this.savedShips.find((ship) => ship[0].status === 'killed');
  }

  changeSavedShips(x: number, y: number) {
    this.savedShips.forEach((ship) => {

      ship.forEach((el: IPosition, i: number) => {
        if (ship[i].x === x && ship[i].y === y) {
          ship[i].status = 'shot';
        }
      });

      ship.forEach((el: IPosition, i: number) => {
        if (ship[0].status === 'shot' && ship[ship.length - 1].status === 'shot') {
          el.status = 'killed';
        }
      });
    });

  }

  isAllShipsKilled() {
    const missedShipsSells = [];

    this.savedShips.forEach((ship) => {
      ship.forEach((el: IPosition, i: number) => {
        if (ship[i].status === 'miss') {
          missedShipsSells.push(ship[i]);
        }
      });
    });

    if (!(missedShipsSells.length > 0)) return true;
    return false;
  }


  isKilledShip() {
    let isKilledShip = false;

    this.savedShips.forEach((ship) => {
      if (ship[0].status === 'killed') {
        isKilledShip = true;
        return;
      }
    });

    return isKilledShip;
  }

  deleteShip() {
    this.savedShips.forEach((ship) => {
      if (ship[0].status === 'killed') {
        ship[0].status = 'o';
        return;
      }
    });
  }

  changeTurn() {
    this.isTurn = !this.isTurn;
  }
}
