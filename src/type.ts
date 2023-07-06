export interface IRequest {
  type: string;
  data: string;
  id: number;
}

export interface IRoom {
  roomId: string,
  roomUsers:
    {
      name: string,
      index: string,
    }[],
}
