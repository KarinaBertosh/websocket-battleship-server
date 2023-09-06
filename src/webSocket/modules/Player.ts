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

  addShips(ships: IShip[]) {
    this.ships = ships;
    console.log(888, this.ships);
    
    this.ships.forEach((ship) => {
      if (ship.type === 'small') {
        this.savedShips.push([{ x: ship.position.x, y: ship.position.y, status: 'miss' }]);
        return;
      }


      if (ship.direction && ship.type === 'medium') {
        this.savedShips.push([{ x: ship.position.x, y: ship.position.y, status: 'miss' }, { x: ship.position.x, y: ship.position.y + 1, status: 'miss' }]);
        return;
      
      }
      if (ship.direction && ship.type === 'large') {
        this.savedShips.push([{ x: ship.position.x, y: ship.position.y, status: 'miss' }, { x: ship.position.x, y: ship.position.y + 1, status: 'miss' }, { x: ship.position.x, y: ship.position.y + 2, status: 'miss' }]);
        return;
      
      }
      if (ship.direction && ship.type === 'huge') {
        this.savedShips.push([{ x: ship.position.x, y: ship.position.y, status: 'miss' }, { x: ship.position.x, y: ship.position.y + 1, status: 'miss' }, { x: ship.position.x, y: ship.position.y + 2, status: 'miss' }, { x: ship.position.x, y: ship.position.y + 3, status: 'miss' }]);
        return;
      
      }


      if (!ship.direction && ship.type === 'medium') {
        this.savedShips.push([{ x: ship.position.x, y: ship.position.y, status: 'miss' }, { x: ship.position.x + 1, y: ship.position.y, status: 'miss' }]);
        return;
      
      }
      if (!ship.direction && ship.type === 'large') {
        this.savedShips.push([{ x: ship.position.x, y: ship.position.y, status: 'miss' }, { x: ship.position.x + 1, y: ship.position.y, status: 'miss' }, { x: ship.position.x + 2, y: ship.position.y, status: 'miss' }]);
        return;
      
      }
      if (!ship.direction && ship.type === 'huge') {
        this.savedShips.push([{ x: ship.position.x, y: ship.position.y, status: 'miss' }, { x: ship.position.x + 1, y: ship.position.y, status: 'miss' }, { x: ship.position.x + 2, y: ship.position.y, status: 'miss' }, { x: ship.position.x + 3, y: ship.position.y, status: 'miss' }]);
        return;
      
      }

    });
  }

  changeSavedShips(x: number, y: number) {
    this.savedShips.forEach((ship) => {

      for (let i = 0; i < ship.length; i++) {
        if (ship[i].x === x && ship[i].y === y) {
          ship[i].status = 'shot';
          return;
        }

        // if (ship[0].x === x && ship[0].y === y && ship[0].status === 'shot' && ship[ship.length - 1].status === 'shot') {
        //   ship[i].status = 'killed';
        // }

      }

    });
    console.log(15, this.savedShips);
  }

  isKilledShip() {
    let isKilledShip = false;
    this.savedShips.forEach((ship) => {
      for (let i = 0; i < ship.length; i++) {
        if (ship[0].status === 'shot' && ship[ship.length - 1].status === 'shot') {
          isKilledShip = true;
          ship[0].status === 'killed';
          return;

        }
      }
    });
    return isKilledShip;
  }

  changeTurn() {
    this.isTurn = !this.isTurn;
  }
}
