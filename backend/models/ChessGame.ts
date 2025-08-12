import { z } from "zod";

export const ChessGameSchema = z.object({
  gameId: z.string(),
  whiteUserId: z.string(),
  blackUserId: z.string().min(3),
  whiteUsername: z.string(),
  blackUsername: z.string(),
  whiteRating: z.number().optional(),
  blackRating: z.number().optional(),
  resultReason: z
    .enum(["checkmate", "resignation", "timeout", "draw", "aborted"])
    .optional(),
  roomId: z.string(),
  createdAt: z.date(),
  finishedAt: z.date(),
  winner: z.number(),
  chatId: z.number(),
  moves: z.array(z.string()), // e.g., ["e4", "e5", "Nf3", ...] in PGN or SAN notation
  currentFen: z.string(), // FEN string to track live board state
  status: z.enum(["waiting", "active", "finished", "aborted"]),
  turn: z.enum(["White", "Black"]), // who should play next
  timeControl: z.object({
    // Blitz, Rapid, etc.
    initial: z.number(), // in seconds
    increment: z.number(), // per move in seconds
  }),
});

export type ChessGame = z.infer<typeof ChessGameSchema>;
