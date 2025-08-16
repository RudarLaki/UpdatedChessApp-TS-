import { z } from "zod";

export const ChessGameSchema = z.object({
  gameId: z.string(),
  whitePlayerId: z.string(),
  blackPlayerId: z.string().min(3),
  whitePlayerUsername: z.string(),
  blackPlayerUsername: z.string(),
  whitePlayerRating: z.number().optional(),
  blackPlayerRating: z.number().optional(),
  resultReason: z
    .enum(["checkmate", "resignation", "timeout", "draw", "aborted"])
    .nullable(),
  roomId: z.string(),
  // sentAt: z.coerce.date(),
  // finishedAt: z.coerce.date().nullable,
  sentAt: z.string(),
  finishedAt: z.string(),
  winner: z.number().nullable(),
  chatId: z.number().nullable(),
  moves: z.array(z.string()), // e.g., ["e4", "e5", "Nf3", ...] in PGN or SAN notation
  status: z.enum(["waiting", "active", "finished", "aborted"]),
  turn: z.enum(["White", "Black"]), // who should play next
  timeControl: z.object({
    // Blitz, Rapid, etc.
    initial: z.number(), // in seconds
    increment: z.number(), // per move in seconds
  }),
});

export type ChessGame = z.infer<typeof ChessGameSchema>;
