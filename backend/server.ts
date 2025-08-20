import app from "./app";
import http from "http";
import { Server } from "socket.io";
import { initSocket } from "./services/socketService";

app.set("port", process.env.PORT || 3000);
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

initSocket(io);

server.listen(app.get("port"), "0.0.0.0", () => {
  console.log(`Server listening on port ${app.get("port")}`);
});
