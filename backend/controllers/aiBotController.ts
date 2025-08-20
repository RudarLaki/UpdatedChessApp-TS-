import { Request, Response } from "express";
import { aiBotService } from "../services/aiBotService";

const startGame = async (req: Request, res: Response) => {
  const { userId, level } = req.body;
  try {
    const roomId = await aiBotService.startGame(userId, level);

    return res.json({ roomId });
  } catch (err) {
    console.error("Starting game error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const makeMove = async (req: Request, res: Response) => {
  const { roomId, moves } = req.body;
  try {
    const bestmove = await aiBotService.makeMove(roomId, moves);
    return res.json(bestmove);
  } catch (err) {
    console.error("Making move error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const close = async (req: Request, res: Response) => {};
const reconnect = async (req: Request, res: Response) => {};

export { startGame, makeMove, close, reconnect };
