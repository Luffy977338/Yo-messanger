import { makeAutoObservable } from "mobx";
import { Socket as WebSocket } from "socket.io-client";

interface CustomSocket extends WebSocket {
  room: string | null;
}

class Socket {
  socket: CustomSocket = {} as CustomSocket;

  constructor() {
    makeAutoObservable(this);
  }

  setSocket(socket: any) {
    this.socket = socket;
  }
}

export default new Socket();
