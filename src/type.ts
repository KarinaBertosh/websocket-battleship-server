export interface IRequest {
  type: string;
  data: string;
  id: number;
}

export interface IRoom {
  roomId: string;
  roomUsers: {
    name: string;
    index: string;
  }[];
}

export const TypeRequest = {
  reg: "reg",
  updateRoom: "update_room",
  createRoom: "create_room",
  createGame: "create_game",
  addShips: "add_ships",
  addUserToRoom: "add_user_to_room",
  turn: "turn",
  attack: "attack",
  startGame: "start_game",
};

interface IShipPosition {
  x: number,
  y: number,
}

export interface IShip {
  position: IShipPosition,
  direction: boolean,
  type: "huge" | "large" | "medium" | "small",
  length: number
}

// export interface ISavedShips {}

// ISavedShips

export interface IPosition {
  x: number,
  y: number,
  status: "huge" | "large" | "medium" | "small" | '',
}
