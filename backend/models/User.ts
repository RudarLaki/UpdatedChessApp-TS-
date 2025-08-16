import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  email: z.email(),

  userName: z.string().min(3),
  password: z.string().min(60), // bcrypt hashes are 60 chars
  sentAt: z.coerce.date(),
  lastActiveAt: z.date().optional(),

  elo: z.number().default(1200), // Starting ELO
  gamesPlayed: z.number().default(0),
  gamesWon: z.number().default(0),
  gamesLost: z.number().default(0),
});

export type User = z.infer<typeof UserSchema>;
