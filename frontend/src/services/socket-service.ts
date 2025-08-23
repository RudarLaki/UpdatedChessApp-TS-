import { io, Socket } from "socket.io-client";
import type {
  GetMoveRequest,
  SendMoveRequest,
  GetMessageRequest,
  SendMessageRequest,
} from "../../../sharedGameLogic/types/game";

class SocketService {
  socket: Socket | null = null;

  connect(url: string) {
    this.socket = io(url);
  }

  joinRoom(
    userId: string,
    timeControl: { initial: number; increment: number }
  ) {
    this.socket?.emit("joinRoom", userId, timeControl);
  }

  onGameStart(
    callback: (data: {
      roomId: string;
      players: { color: "Black" | "White"; userId: string }[];
    }) => void
  ) {
    this.socket?.on("gameStart", callback);
  }

  getMove(callback: (getMoveRequest: GetMoveRequest) => void) {
    this.socket?.on("getMove", callback);
  }

  sendMove(sendMoveRequest: SendMoveRequest) {
    this.socket?.emit("makeMove", sendMoveRequest);
  }

  getMessage(callback: (getMessageRequest: GetMessageRequest) => void) {
    this.socket?.on("getMessage", callback);
  }

  sendMessage(sendMessageRequest: SendMessageRequest) {
    this.socket?.emit("sendMessage", sendMessageRequest);
  }

  offChatMessage(callback: (getMessageRequest: GetMessageRequest) => void) {
    this.socket?.off("receiveMessage", callback);
  }
  off() {
    this.socket?.off("getMove");
  }
  reconnect(roomId: string, userId: string) {
    this.socket?.emit("rejoin-room", {
      roomId,
      userId,
    });
  }
  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();
