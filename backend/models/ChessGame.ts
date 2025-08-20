import { z } from "zod";

export const ChessGameSchema = z.object({
  gameId: z.string(),
  whitePlayerId: z.string(),
  blackPlayerId: z.string().min(3),
  whitePlayerUsername: z.string(),
  blackPlayerUsername: z.string(),
  whitePlayerRating: z.number().optional(),
  blackPlayerRating: z.number().optional(),
  boardState: z.object({
    pieces: z.array(
      z.object({
        piece: z.string(),
        pieceAlliance: z.enum(["White", "Black"]),
        piecePosition: z.number().min(0).max(63),
      })
    ),
    turn: z.enum(["White", "Black"]),
    enPassant: z.number().nullable().optional(),
    castlingRights: z.object({
      whiteKingSide: z.boolean(),
      whiteQueenSide: z.boolean(),
      blackKingSide: z.boolean(),
      blackQueenSide: z.boolean(),
    }),
  }),
  moveHistory: z.array(
    z.object({
      from: z.number().min(0).max(63),
      to: z.number().min(0).max(63),
      notation: z.string(),
    })
  ),
  resultReason: z
    .enum(["checkmate", "resignation", "timeout", "draw", "aborted"])
    .nullable(),
  roomId: z.string(),
  sentAt: z.string(),
  finishedAt: z.string(),
  winner: z.number().nullable(),
  chatId: z.number().nullable(),
  status: z.enum(["waiting", "active", "finished", "aborted"]),
  turn: z.enum(["White", "Black"]),
  timeControl: z.object({
    initial: z.number(),
    increment: z.number(),
  }),
});

export type ChessGame = z.infer<typeof ChessGameSchema>;
