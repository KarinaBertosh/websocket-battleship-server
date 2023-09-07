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

  renderSavedShips(ships: IShip[]) {
    this.ships.forEach((ship) => {

      if(ship.direction) {
        const array = []
        for (let i = 0; i < ship.length; i++) {
          array.push({ x: ship.position.x, y: ship.position.y + i, status: 'miss' });
        }
        this.savedShips.push(array);
      } else {
        const array = []
        for (let i = 0; i < ship.length; i++) {
          array.push({ x: ship.position.x + i, y: ship.position.y, status: 'miss' });
        }
        this.savedShips.push(array);
      }

    }); 
  }

  addShips(ships: IShip[]) {
    this.ships = ships;
    this.savedShips.length = 0;
    this.renderSavedShips(this.ships);
  }

  getShip() {
    return this.savedShips.find((ship) => ship[0].status === 'killed');
  }

  changeSavedShips(x: number, y: number) {
    this.savedShips.forEach((ship) => {

      for (let i = 0; i < ship.length; i++) {
        if (ship[i].x === x && ship[i].y === y) {
          ship[i].status = 'shot';
        }
      }

      for (let i = 0; i < ship.length; i++) {
        if (ship[0].status === 'shot' && ship[ship.length - 1].status === 'shot') {
          ship[i].status = 'killed';
        }
        if (ship[i].status === 'shot' && ship[i].type === 'small') {
          ship[i].status = 'killed';
        }
      }

    });
    console.log(15, this.savedShips);
  }


  isKilledShip() {
    let isKilledShip = false;
    this.savedShips.forEach((ship) => {
      for (let i = 0; i < ship.length; i++) {
        if (ship[0].status === 'killed') {
          isKilledShip = true;
          return;
        }
      }
    });
    return isKilledShip;
  }

  deleteShip() {
    this.savedShips.forEach((ship) => {
      for (let i = 0; i < ship.length; i++) {
        if (ship[0].status === 'killed') {
          console.log(5, 'ship[0].status', ship[0].status);

          ship[0].status = 'o';
          return;
        }
      }
    });
  }

  changeTurn() {
    this.isTurn = !this.isTurn;
  }
}
