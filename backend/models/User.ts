import { z } from "zod";

export const UserSchema = z.object({
  userId: z.string(),
  userEmail: z.email(),

  username: z.string().min(3),
  passwordHash: z.string().min(60), // bcrypt hashes are 60 chars
  createdAt: z.date(), // ISO string
  lastActiveAt: z.date().optional(),

  elo: z.number().default(1200), // Starting ELO
  gamesPlayed: z.number().default(0),
  gamesWon: z.number().default(0),
  gamesLost: z.number().default(0),
});

export type User = z.infer<typeof UserSchema>;
