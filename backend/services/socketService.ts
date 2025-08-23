import { Server } from "socket.io";
import crypto from "crypto";
import { gameService } from "./gameService";
import {
  SendMoveRequest,
  GetMoveRequest,
  StartGameRequest,
  SendMessageRequest,
  GetMessageRequest,
} from "../../sharedGameLogic/types/game";
import { chatService } from "./chatService";
import { error } from "console";

interface Room {
  id: string;
  players: { color: "White" | "Black"; userId: string }[];
}

const rooms: Record<string, Room> = {};
const waitingPlayers: { userId: string; socketId: string }[] = [];

export function initSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on(
      "joinRoom",
      (userId: string, timeControl: { initial: number; increment: number }) => {
        if (!userId) return socket.emit("error", "User ID required");

        if (waitingPlayers.length > 0) {
          const waitingPlayer = waitingPlayers.shift()!;
          const roomId = crypto.randomBytes(6).toString("base64url");

          rooms[roomId] = {
            id: roomId,
            players: [
              { userId: waitingPlayer.userId, color: "Black" },
              { userId, color: "White" },
            ],
          };

          const whitePlayerId = rooms[roomId].players.find(
            (p) => p.color === "White"
          )!.userId;
          const blackPlayerId = rooms[roomId].players.find(
            (p) => p.color === "Black"
          )!.userId;

          socket.join(roomId);
          io.sockets.sockets.get(waitingPlayer.socketId)?.join(roomId);

          const startGameRequest: StartGameRequest = {
            whitePlayerId,
            blackPlayerId,
            roomId,
            timeControl,
          };
          gameService.startGame(startGameRequest);

          io.to(roomId).emit("gameStart", {
            roomId,
            players: rooms[roomId].players,
          });

          console.log(
            `Room ${roomId} started with ${waitingPlayer.userId} & ${userId}`
          );
        } else {
          waitingPlayers.push({ userId, socketId: socket.id });
          console.log(`User ${userId} is waiting for opponent`);
        }
      }
    );

    socket.on("rejoin-room", ({ roomId, userId }) => {
      const room = rooms[roomId];
      if (room && room.players.find((p) => p.userId === userId)) {
        socket.join(roomId);
        socket.emit("rejoined", { roomId, players: room.players });
        console.log(`User ${userId} rejoined room ${roomId}`);
      } else {
        socket.emit("error", "Room not found or user not part of it");
      }
    });

    socket.on("makeMove", async (sendMoveRequest: SendMoveRequest) => {
      const { roomId, moveData } = sendMoveRequest;
      await gameService.makeMove(sendMoveRequest);
      socket.to(roomId).emit("getMove", { moveData });
    });

    socket.on("sendMessage", async (sendMessageRequest: SendMessageRequest) => {
      const res: GetMessageRequest = (await chatService.sendMessage(
        sendMessageRequest
      )) as GetMessageRequest;
      socket.to(sendMessageRequest.roomId).emit("getMessage", res);
    });

    socket.on("disconnect", () => {
      const index = waitingPlayers.findIndex((p) => p.socketId === socket.id);
      if (index !== -1) waitingPlayers.splice(index, 1);
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}
