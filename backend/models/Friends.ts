import z from "zod";

export const FriendsSchema = z.object({
  id: z.string(),
  userId1: z.string(),
  userId2: z.string(),
  status: z.string(),
  sentAt: z.string(),
});

export type Friends = z.infer<typeof FriendsSchema>;
