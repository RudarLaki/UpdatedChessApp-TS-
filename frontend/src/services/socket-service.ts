import { io, Socket } from "socket.io-client";

class SocketService {
  socket: Socket | null = null;

  connect(url: string) {
    this.socket = io(url);
  }

  joinRoom(
    userId: string,
    timeControl: { matchTime: number; addition: number }
  ) {
    console.log(userId);
    this.socket?.emit("joinRoom", userId, timeControl);
  }

  waitForOpponent() {
    this.socket?.on("waiting", (msg: string) => {
      console.log(msg);
    });
  }

  onPlayerJoined(callback: (playerId: string) => void) {
    this.socket?.on("playerJoined", callback);
  }
  onGameStart(
    callback: (data: {
      roomId: string;
      players: { color: "Black" | "White"; userId: string }[];
    }) => void
  ) {
    this.socket?.on("gameStart", callback);
  }

  getMove(callback: (moveCordinations: { from: number; to: number }) => void) {
    this.socket?.on("getMove", (coords) => {
      console.log("Client got move", coords);
      callback(coords);
    });
  }

  sendMove(roomId: string, move: { from: number; to: number }) {
    this.socket?.emit("makeMove", roomId, move);
  }
  off() {
    this.socket?.off("getMove");
  }
  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();
