import express from "express";
//import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import usersRoutes from "./routes/usersRoutes";
import gameRoutes from "./routes/gameRoutes";
import aiBotRoutes from "./routes/aiBotRoutes";
import chatRoutes from "./routes/chatRoutes";

const app = express();

app.use(
  cors({
    origin: ["https://rudechess.xyz", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT"],
  })
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", usersRoutes);
app.use("/game", gameRoutes);
app.use("/ai-game", aiBotRoutes);
app.use("/chat", chatRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

app.set("port", process.env.PORT || 3000);

export default app;
