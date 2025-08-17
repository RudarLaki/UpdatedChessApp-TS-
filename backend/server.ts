import app from "./app";
import http from "http";
import { Server } from "socket.io";
import crypto from "crypto";

import { gameService } from "./services/gameService";

// set our port
app.set("port", process.env.PORT || 3000);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
interface Room {
  id: string;
  players: { color: "White" | "Black"; userId: string }[]; // store userIds here, not socket ids
}

const rooms: Record<string, Room> = {};
const waitingPlayers: { userId: string; socketId: string }[] = [];

io.on("connection", (socket) => {
  const allSocketIds = Array.from(io.sockets.sockets.keys());
  console.log("Connected socket IDs:", allSocketIds);
  console.log("User connected", socket.id);

  socket.on("joinRoom", (userId, timeControl) => {
    if (!userId) {
      socket.emit("error", "User ID required");
      return;
    }

    // Check if someone is waiting
    if (waitingPlayers.length > 0) {
      // Match with waiting player
      const waitingPlayer = waitingPlayers.shift()!;

      // Create a unique room id, e.g. combine user ids sorted
      const roomId = crypto.randomBytes(6).toString("base64url"); // ~8 chars, URL safe

      rooms[roomId] = {
        id: roomId,
        players: [
          { userId: waitingPlayer.userId, color: "Black" },
          { userId: userId, color: "White" },
        ],
      };
      const whitePlayerId =
        rooms[roomId].players[0].color == "White"
          ? rooms[roomId].players[0].userId
          : rooms[roomId].players[1].userId;

      const blackPlayerId =
        rooms[roomId].players[0].color == "Black"
          ? rooms[roomId].players[0].userId
          : rooms[roomId].players[1].userId;

      // Join sockets to the room
      socket.join(roomId);
      io.sockets.sockets.get(waitingPlayer.socketId)?.join(roomId);

      // Notify both players to start game
      gameService.startGame(whitePlayerId, blackPlayerId, roomId, timeControl);
      io.to(roomId).emit("gameStart", {
        roomId,
        players: rooms[roomId].players,
      });

      console.log(
        `Room ${roomId} started with players ${waitingPlayer.userId} and ${userId}`
      );
    } else {
      // No one waiting - add this user to waiting list
      waitingPlayers.push({ userId, socketId: socket.id });
      console.log(`User ${userId} is waiting for opponent`);
    }
  });
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

  socket.on(
    "makeMove",
    async (roomId: string, moveCordinations: { from: number; to: number }) => {
      await gameService.makeMove(roomId, moveCordinations);
      socket.to(roomId).emit("getMove", moveCordinations);
    }
  );

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    // Remove from waitingPlayers if present
    const index = waitingPlayers.findIndex((p) => p.socketId === socket.id);
    if (index !== -1) {
      waitingPlayers.splice(index, 1);
      console.log(`Removed user from waitingPlayers: ${socket.id}`);
    }
  });

  // Other handlers ...
});

// start listening on our port
server.listen(3000, "0.0.0.0", () => {
  console.log("Server listening on port 3000");
});
