import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  email: z.email(),
  userName: z.string().min(3),
  password: z.string().min(60),
  continent: z.string().min(60),
  country: z.string().min(60),

  sentAt: z.coerce.date(),
  lastActiveAt: z.date().optional(),

  elo: z.number().default(1200),
  eloBlitz: z.number().default(1200),
  eloRapid: z.number().default(1200),
  eloBullet: z.number().default(1200),
  eloPuzzles: z.number().default(1200),

  gamesPlayed: z.number().default(0),
  gamesWon: z.number().default(0),
  gamesLost: z.number().default(0),
});

export type User = z.infer<typeof UserSchema>;
